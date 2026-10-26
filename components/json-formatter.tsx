"use client"

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import {
  AlertTriangle,
  Braces,
  Check,
  ChevronRight,
  CircleCheck,
  CircleX,
  Copy,
  Download,
  FileUp,
  Trash2,
  Wand2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  embeddedJson,
  formatPath,
  highlight,
  parseJson,
  stats,
  stringify,
  type Indent,
  type JsonNode,
  type PathSegment,
  type TokenKind,
} from "@/lib/json-formatter"

type OutputMode = "pretty" | "minified" | "escaped"
type View = "code" | "tree"

const TOKEN_CLASSES: Record<TokenKind, string> = {
  key: "text-primary",
  string: "text-amber-200",
  number: "text-sky-300",
  boolean: "text-violet-300",
  null: "text-rose-300",
}

// Past this size, coloring every token makes the page sluggish; show plain text.
const HIGHLIGHT_LIMIT = 1_500_000
const TREE_PAGE = 200

const SAMPLE = `{
  "id": 9007199254740993,
  "name": "Nimila's Lab",
  "active": true,
  "tags": ["tools", "json", "no-ads"],
  "owner": { "handle": "nhiranz", "joined": "2014-03-01", "manager": null },
  "projects": [
    { "slug": "mail-formatter", "stars": 12, "score": 4.75 },
    { "slug": "json-formatter", "stars": 0, "score": 1e3 }
  ]
}`

const MODE_OPTIONS: { value: OutputMode; label: string }[] = [
  { value: "pretty", label: "Pretty" },
  { value: "minified", label: "Minified" },
  { value: "escaped", label: "Escaped" },
]

const INDENT_OPTIONS: { value: Indent; label: string }[] = [
  { value: "2", label: "2" },
  { value: "4", label: "4" },
  { value: "tab", label: "Tab" },
]

const TOGGLE_ITEM = "px-3 text-xs data-[state=on]:bg-primary/15 data-[state=on]:text-primary"

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const holder = document.createElement("textarea")
    holder.value = text
    holder.style.cssText = "position:fixed;left:-9999px;top:0;"
    document.body.appendChild(holder)
    holder.select()
    document.execCommand("copy")
    holder.remove()
  }
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

function useFlag(ms = 1500) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!on) return
    const t = setTimeout(() => setOn(false), ms)
    return () => clearTimeout(t)
  }, [on, ms])
  return [on, () => setOn(true)] as const
}

function CopyButton({ text, label, disabled }: { text: string; label: string; disabled?: boolean }) {
  const [copied, flash] = useFlag()
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={async () => {
        await copyText(text)
        flash()
      }}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? "Copied" : label}
    </Button>
  )
}

export function JsonFormatter() {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState("")
  const [mode, setMode] = useState<OutputMode>("pretty")
  const [indent, setIndent] = useState<Indent>("2")
  const [sortKeys, setSortKeys] = useState(false)
  const [view, setView] = useState<View>("code")

  // Parsing a few MB takes a moment; let typing stay responsive.
  const source = useDeferredValue(input)
  const result = useMemo(() => (source.trim() ? parseJson(source) : null), [source])
  const node = result?.ok ? result.node : null

  const output = useMemo(() => {
    if (!node) return ""
    if (mode === "minified") return stringify(node, null, sortKeys)
    if (mode === "escaped") return JSON.stringify(stringify(node, null, sortKeys))
    return stringify(node, indent, sortKeys)
  }, [node, mode, indent, sortKeys])

  const highlighted = useMemo(
    () => (output && output.length <= HIGHLIGHT_LIMIT ? highlight(output, TOKEN_CLASSES) : null),
    [output],
  )
  const lineCount = useMemo(() => (output.match(/\n/g)?.length ?? 0) + 1, [output])
  const nodeStats = useMemo(() => (node ? stats(node) : null), [node])
  const embedded = useMemo(() => (node ? embeddedJson(node) : null), [node])

  const jumpTo = (offset: number) => {
    const el = inputRef.current
    if (!el) return
    el.focus()
    el.setSelectionRange(offset, Math.min(offset + 1, el.value.length))
    const line = el.value.slice(0, offset).split("\n").length
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20
    el.scrollTop = Math.max(0, (line - 1) * lineHeight - el.clientHeight / 3)
  }

  const loadFile = async (file: File | undefined) => {
    if (file) setInput(await file.text())
  }

  const download = () => {
    const blob = new Blob([output], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = mode === "escaped" ? "escaped.txt" : "formatted.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const unwrap = () => {
    if (!embedded) return
    const inner = parseJson(embedded)
    if (inner.ok) setInput(stringify(inner.node, indent))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Output</span>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={mode}
            onValueChange={(v) => v && setMode(v as OutputMode)}
          >
            {MODE_OPTIONS.map((opt) => (
              <ToggleGroupItem key={opt.value} value={opt.value} className={TOGGLE_ITEM}>
                {opt.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Indent</span>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={indent}
            disabled={mode !== "pretty"}
            onValueChange={(v) => v && setIndent(v as Indent)}
          >
            {INDENT_OPTIONS.map((opt) => (
              <ToggleGroupItem key={opt.value} value={opt.value} className={TOGGLE_ITEM}>
                {opt.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <Switch checked={sortKeys} onCheckedChange={setSortKeys} />
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Sort keys</span>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <section className="flex min-w-0 flex-col rounded-lg border border-border bg-card">
          <header className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Input</h2>
            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setInput(SAMPLE)}>
                <Braces /> Sample
              </Button>
              <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
                <FileUp /> Open file
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setInput("")} disabled={!input}>
                <Trash2 /> Clear
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept=".json,.txt,application/json,text/plain"
                className="hidden"
                onChange={(e) => {
                  loadFile(e.target.files?.[0])
                  e.target.value = ""
                }}
              />
            </div>
          </header>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              if (!e.dataTransfer.files.length) return
              e.preventDefault()
              loadFile(e.dataTransfer.files[0])
            }}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
            placeholder={"Paste or type JSON here, or drop a .json file.\n\nComments, trailing commas, single quotes and\nPython dicts are fixed for you."}
            aria-label="JSON input"
            className="h-[360px] w-full resize-none bg-transparent px-4 py-3 font-mono text-[13px] leading-5 text-foreground outline-none placeholder:text-muted-foreground/60 lg:h-[600px]"
          />
        </section>

        {/* Output */}
        <section className="flex min-w-0 flex-col rounded-lg border border-border bg-card">
          <header className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={view}
              onValueChange={(v) => v && setView(v as View)}
            >
              <ToggleGroupItem value="code" className={TOGGLE_ITEM}>Code</ToggleGroupItem>
              <ToggleGroupItem value="tree" className={TOGGLE_ITEM}>Tree</ToggleGroupItem>
            </ToggleGroup>
            <div className="ml-auto flex items-center gap-2">
              <CopyButton text={output} label="Copy" disabled={!output} />
              <Button variant="outline" size="sm" onClick={download} disabled={!output}>
                <Download /> Download
              </Button>
            </div>
          </header>

          <StatusBar
            result={result}
            embedded={!!embedded}
            onJump={jumpTo}
            onUseFixed={() => node && setInput(stringify(node, indent, sortKeys))}
            onUnwrap={unwrap}
          />

          <div className="relative h-[360px] lg:h-[600px]">
            {!result && (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                <Braces size={28} className="text-primary" />
                <p className="font-mono text-sm text-foreground">Formatted JSON shows up here</p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  Everything runs in your browser. Nothing you paste leaves this page.
                </p>
              </div>
            )}
            {result && !result.ok && <ErrorPanel source={source} error={result.error} onJump={jumpTo} />}
            {node && view === "code" && (
              <div className="absolute inset-0 overflow-auto">
                <div className="flex min-w-max font-mono text-[13px] leading-5">
                  <pre
                    aria-hidden
                    className="sticky left-0 select-none border-r border-border bg-card py-3 pr-3 pl-4 text-right text-muted-foreground/50"
                  >
                    {Array.from({ length: lineCount }, (_, i) => i + 1).join("\n")}
                  </pre>
                  {highlighted !== null ? (
                    <pre
                      className="py-3 pr-6 pl-4 text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: highlighted }}
                    />
                  ) : (
                    <pre className="py-3 pr-6 pl-4 text-foreground">{output}</pre>
                  )}
                </div>
              </div>
            )}
            {node && view === "tree" && <TreeView node={node} sortKeys={sortKeys} indent={indent} />}
          </div>
        </section>
      </div>

      <p className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground" aria-live="polite">
        {input && <span>Input {formatBytes(new Blob([input]).size)}</span>}
        {output && <span>Output {formatBytes(new Blob([output]).size)}</span>}
        {nodeStats && <span>{nodeStats.nodes.toLocaleString()} values</span>}
        {nodeStats && <span>Depth {nodeStats.depth}</span>}
      </p>
    </div>
  )
}

function StatusBar({
  result,
  embedded,
  onJump,
  onUseFixed,
  onUnwrap,
}: {
  result: ReturnType<typeof parseJson> | null
  embedded: boolean
  onJump: (offset: number) => void
  onUseFixed: () => void
  onUnwrap: () => void
}) {
  if (!result) return null

  if (!result.ok) {
    return (
      <div className="flex items-center gap-2 border-b border-border bg-destructive/10 px-4 py-2 text-xs text-red-300">
        <CircleX size={14} /> Invalid JSON
      </div>
    )
  }

  if (result.repairs.length > 0) {
    return (
      <div className="space-y-2 border-b border-border bg-amber-400/10 px-4 py-2 text-xs text-amber-200">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} />
          <span>Not valid JSON as written. Fixed automatically; the output below is valid.</span>
          <Button variant="ghost" size="sm" className="ml-auto h-6 px-2 text-xs" onClick={onUseFixed}>
            <Wand2 /> Replace input
          </Button>
        </div>
        <ul className="space-y-0.5 pl-6">
          {result.repairs.map((r) => (
            <li key={r.message}>
              <button
                type="button"
                onClick={() => onJump(r.offset)}
                className="text-left hover:underline"
              >
                {r.message}
                {r.count > 1 && ` (×${r.count})`}
                <span className="text-amber-200/60">
                  {" "}· {r.count > 1 ? "first at " : ""}line {r.line}, col {r.column}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 border-b border-border bg-primary/10 px-4 py-2 text-xs text-primary">
      <CircleCheck size={14} /> Valid JSON
      {embedded && (
        <>
          <span className="text-muted-foreground">· This is a string that contains JSON.</span>
          <Button variant="ghost" size="sm" className="ml-auto h-6 px-2 text-xs" onClick={onUnwrap}>
            <Wand2 /> Unwrap
          </Button>
        </>
      )}
    </div>
  )
}

function ErrorPanel({
  source,
  error,
  onJump,
}: {
  source: string
  error: { message: string; offset: number; line: number; column: number }
  onJump: (offset: number) => void
}) {
  const lineText = source.split("\n")[error.line - 1] ?? ""
  // Keep the snippet short on long (often minified) lines.
  const from = Math.max(0, error.column - 1 - 40)
  const snippet = lineText.slice(from, from + 80).replace(/\t/g, " ")
  const caret = error.column - 1 - from

  return (
    <div className="space-y-4 p-5">
      <div>
        <p className="text-sm text-foreground">{error.message}</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          Line {error.line}, column {error.column}
        </p>
      </div>
      <pre className="overflow-x-auto rounded-md border border-border bg-background px-3 py-2 font-mono text-[13px] leading-5">
        <span className="text-foreground">{snippet || " "}</span>
        {"\n"}
        <span className="text-red-400">{" ".repeat(Math.max(0, caret))}^</span>
      </pre>
      <Button variant="outline" size="sm" onClick={() => onJump(error.offset)}>
        Show in input
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tree view

type Selection = { path: PathSegment[]; node: JsonNode }

function TreeView({ node, sortKeys, indent }: { node: JsonNode; sortKeys: boolean; indent: Indent }) {
  const [selected, setSelected] = useState<Selection | null>(null)
  // Remounting the tree with a new key applies "expand / collapse all".
  const [expand, setExpand] = useState({ key: 0, depth: 2 })

  useEffect(() => setSelected(null), [node])

  const selectedPath = selected ? formatPath(selected.path) : null

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
        <code className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
          {selectedPath ?? <span className="text-muted-foreground">Click a row to get its path</span>}
        </code>
        {selected && (
          <>
            <CopyButton text={selectedPath!} label="Path" />
            <CopyButton text={stringify(selected.node, indent, sortKeys)} label="Value" />
          </>
        )}
        <Button variant="ghost" size="sm" onClick={() => setExpand((e) => ({ key: e.key + 1, depth: Infinity }))}>
          Expand all
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setExpand((e) => ({ key: e.key + 1, depth: 1 }))}>
          Collapse
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto py-2 font-mono text-[13px] leading-6" role="tree">
        <TreeNode
          key={expand.key}
          label={null}
          node={node}
          path={[]}
          depth={0}
          openDepth={expand.depth}
          sortKeys={sortKeys}
          selectedPath={selectedPath}
          onSelect={setSelected}
        />
      </div>
    </div>
  )
}

function Primitive({ node }: { node: JsonNode }) {
  switch (node.type) {
    case "string": return <span className={TOKEN_CLASSES.string}>{JSON.stringify(node.value)}</span>
    case "number": return <span className={TOKEN_CLASSES.number}>{node.raw}</span>
    case "boolean": return <span className={TOKEN_CLASSES.boolean}>{String(node.value)}</span>
    case "null": return <span className={TOKEN_CLASSES.null}>null</span>
    default: return null
  }
}

function TreeNode({
  label,
  node,
  path,
  depth,
  openDepth,
  sortKeys,
  selectedPath,
  onSelect,
}: {
  label: PathSegment | null
  node: JsonNode
  path: PathSegment[]
  depth: number
  openDepth: number
  sortKeys: boolean
  selectedPath: string | null
  onSelect: (s: Selection) => void
}) {
  const [open, setOpen] = useState(depth < openDepth)
  const [limit, setLimit] = useState(TREE_PAGE)

  const children = useMemo((): [PathSegment, JsonNode][] => {
    if (node.type === "array") return node.items.map((item, i) => [i, item])
    if (node.type === "object") {
      const entries = sortKeys ? [...node.entries].sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0)) : node.entries
      return entries.map((e) => [e.key, e.value])
    }
    return []
  }, [node, sortKeys])

  const isContainer = node.type === "array" || node.type === "object"
  const isSelected = selectedPath === formatPath(path)
  const summary =
    node.type === "array"
      ? `${children.length} ${children.length === 1 ? "item" : "items"}`
      : `${children.length} ${children.length === 1 ? "key" : "keys"}`

  return (
    <div role="treeitem" aria-expanded={isContainer ? open : undefined} aria-selected={isSelected}>
      <div
        onClick={() => onSelect({ path, node })}
        className={`flex cursor-pointer items-center gap-1 whitespace-nowrap pr-4 hover:bg-muted ${
          isSelected ? "bg-primary/10" : ""
        }`}
        style={{ paddingLeft: depth * 16 + 8 }}
      >
        {isContainer ? (
          <button
            type="button"
            aria-label={open ? "Collapse" : "Expand"}
            onClick={(e) => {
              e.stopPropagation()
              setOpen(!open)
            }}
            className="flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground"
          >
            <ChevronRight size={14} className={`transition-transform ${open ? "rotate-90" : ""}`} />
          </button>
        ) : (
          <span className="size-5 shrink-0" />
        )}
        {label !== null && (
          <>
            <span className={typeof label === "number" ? "text-muted-foreground" : TOKEN_CLASSES.key}>
              {typeof label === "number" ? label : label === "" ? '""' : label}
            </span>
            <span className="text-muted-foreground">:</span>
          </>
        )}
        {isContainer ? (
          <span className="text-muted-foreground">
            {node.type === "array" ? "[" : "{"}
            {!open && (children.length ? "…" : "")}
            {(!open || children.length === 0) && (node.type === "array" ? "]" : "}")}
            {children.length > 0 && <span className="ml-2 text-xs text-muted-foreground/60">{summary}</span>}
          </span>
        ) : (
          <Primitive node={node} />
        )}
      </div>
      {isContainer && open && children.length > 0 && (
        <div role="group">
          {children.slice(0, limit).map(([key, child], i) => (
            <TreeNode
              key={i}
              label={key}
              node={child}
              path={[...path, key]}
              depth={depth + 1}
              openDepth={openDepth}
              sortKeys={sortKeys}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
          {children.length > limit && (
            <button
              type="button"
              onClick={() => setLimit(limit + TREE_PAGE)}
              className="py-0.5 text-xs text-primary hover:underline"
              style={{ paddingLeft: (depth + 1) * 16 + 32 }}
            >
              Show {Math.min(TREE_PAGE, children.length - limit)} more of {children.length - limit}
            </button>
          )}
          <div className="text-muted-foreground" style={{ paddingLeft: depth * 16 + 32 }}>
            {node.type === "array" ? "]" : "}"}
          </div>
        </div>
      )}
    </div>
  )
}
