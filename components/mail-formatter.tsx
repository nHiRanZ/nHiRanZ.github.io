"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ClipboardPaste, Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  CODE_MARKER,
  CODE_STYLES,
  cleanHtml,
  mdToHtml,
  toEmailHtml,
  type CodeStyle,
} from "@/lib/mail-formatter"

const CODE_STYLE_OPTIONS: { value: CodeStyle; label: string }[] = [
  { value: "box", label: "Gray box" },
  { value: "mono", label: "Monospace" },
  { value: "plain", label: "Plain" },
]

async function writeClipboard(html: string, text: string) {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" }),
      }),
    ])
  } catch {
    // Fallback: copy the selection from a neutral, off-screen container.
    const holder = document.createElement("div")
    holder.style.cssText = "position:fixed;left:-9999px;top:0;background:transparent;color:#000;"
    holder.innerHTML = html
    document.body.appendChild(holder)
    const range = document.createRange()
    range.selectNodeContents(holder)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
    document.execCommand("copy")
    sel?.removeAllRanges()
    holder.remove()
  }
}

export function MailFormatter() {
  const previewRef = useRef<HTMLDivElement>(null)
  const [codeStyle, setCodeStyle] = useState<CodeStyle>("box")
  const [hasContent, setHasContent] = useState(false)
  const [status, setStatus] = useState<"idle" | "cleaned" | "copied">("idle")

  const codeStyleRef = useRef(codeStyle)
  codeStyleRef.current = codeStyle

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const html = e.clipboardData?.getData("text/html")
      const text = e.clipboardData?.getData("text/plain")
      if (!html && !text) return
      e.preventDefault()
      const cleaned = cleanHtml(html || mdToHtml(text ?? ""), codeStyleRef.current)
      previewRef.current?.replaceChildren(...Array.from(cleaned.childNodes))
      setHasContent(!!previewRef.current?.textContent?.trim())
      setStatus("cleaned")
    }
    document.addEventListener("paste", onPaste)
    return () => document.removeEventListener("paste", onPaste)
  }, [])

  useEffect(() => {
    if (status !== "copied") return
    const t = setTimeout(() => setStatus("idle"), 2000)
    return () => clearTimeout(t)
  }, [status])

  const changeCodeStyle = (value: string) => {
    if (!value) return
    const style = value as CodeStyle
    setCodeStyle(style)
    for (const el of Array.from(previewRef.current?.querySelectorAll(`code[${CODE_MARKER}]`) ?? [])) {
      el.setAttribute("style", CODE_STYLES[style])
    }
  }

  const copy = async () => {
    const preview = previewRef.current
    if (!preview) return
    await writeClipboard(toEmailHtml(preview), preview.innerText)
    setStatus("copied")
  }

  const clear = () => {
    previewRef.current?.replaceChildren()
    setHasContent(false)
    setStatus("idle")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Inline code
          </span>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={codeStyle}
            onValueChange={changeCodeStyle}
          >
            {CODE_STYLE_OPTIONS.map((opt) => (
              <ToggleGroupItem
                key={opt.value}
                value={opt.value}
                className="px-3 text-xs data-[state=on]:bg-primary/15 data-[state=on]:text-primary"
              >
                {opt.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={clear} disabled={!hasContent}>
            <Trash2 /> Clear
          </Button>
          <Button size="sm" onClick={copy} disabled={!hasContent}>
            {status === "copied" ? <Check /> : <Copy />}
            {status === "copied" ? "Copied" : "Copy for email"}
          </Button>
        </div>
      </div>

      <div className="relative rounded-lg border border-border bg-card p-2">
        {!hasContent && (
          <div className="pointer-events-none absolute inset-2 flex flex-col items-center justify-center gap-3 rounded-md text-center">
            <ClipboardPaste size={28} className="text-primary" />
            <p className="font-mono text-sm text-foreground">
              Paste anywhere on this page
            </p>
            <p className="max-w-sm text-xs text-muted-foreground">
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">⌘V</kbd>
              {" / "}
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">Ctrl+V</kbd>
              {" "}rich text from Claude or raw Markdown. The email-ready version shows up here.
            </p>
          </div>
        )}
        {/* Deliberately light: this previews how the email will look to recipients. */}
        <div
          ref={previewRef}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onInput={() => setHasContent(!!previewRef.current?.textContent?.trim())}
          className={`min-h-[360px] overflow-x-auto rounded-md px-7 py-6 text-[14px] text-[#222] outline-none [overflow-wrap:anywhere] [font-family:Arial,Helvetica,sans-serif] transition-colors ${
            hasContent ? "bg-white" : "bg-transparent"
          }`}
        />
      </div>

      <p className="h-4 text-xs text-muted-foreground" aria-live="polite">
        {status === "cleaned" && "Cleaned. Edit the preview if needed, then copy."}
        {status === "copied" && "Copied. Paste it into your email."}
      </p>
    </div>
  )
}
