// Converts rich HTML (e.g. copied from a dark-themed AI chat) or raw Markdown into
// email-safe HTML: structure is kept, all colors/backgrounds/classes are dropped,
// and light inline styles are applied so it pastes cleanly into Gmail/Outlook.

const MONO = "Consolas, Menlo, Monaco, 'Courier New', monospace"

export type CodeStyle = 'box' | 'mono' | 'plain'

export const CODE_STYLES: Record<CodeStyle, string> = {
  box: `font-family:${MONO};font-size:90%;background-color:#f1f3f4;color:#1f2328;padding:1px 4px;border:1px solid #e1e4e8;border-radius:3px;`,
  mono: `font-family:${MONO};font-size:90%;`,
  plain: '',
}

const STYLES: Record<string, string> = {
  p: 'margin:0 0 12px 0;line-height:1.5;',
  div: '',
  h1: 'font-size:20px;font-weight:bold;margin:18px 0 10px 0;',
  h2: 'font-size:17px;font-weight:bold;margin:16px 0 8px 0;',
  h3: 'font-size:15px;font-weight:bold;margin:14px 0 6px 0;',
  h4: 'font-size:14px;font-weight:bold;margin:12px 0 6px 0;',
  h5: 'font-size:14px;font-weight:bold;margin:12px 0 6px 0;',
  h6: 'font-size:14px;font-weight:bold;margin:12px 0 6px 0;',
  ul: 'margin:0 0 12px 0;padding-left:24px;',
  ol: 'margin:0 0 12px 0;padding-left:24px;',
  li: 'margin:0 0 4px 0;line-height:1.5;',
  blockquote: 'margin:0 0 12px 0;padding:0 0 0 12px;border-left:3px solid #d0d7de;color:#555555;',
  pre: `margin:0 0 12px 0;padding:10px 12px;background-color:#f6f8fa;color:#1f2328;border:1px solid #e1e4e8;border-radius:4px;font-family:${MONO};font-size:13px;line-height:1.45;white-space:pre-wrap;`,
  table: 'border-collapse:collapse;margin:0 0 12px 0;',
  th: 'border:1px solid #d0d7de;padding:6px 10px;background-color:#f6f8fa;text-align:left;font-weight:bold;',
  td: 'border:1px solid #d0d7de;padding:6px 10px;vertical-align:top;',
  a: 'color:#1a73e8;text-decoration:underline;',
  hr: 'border:0;border-top:1px solid #dddddd;margin:16px 0;',
  strong: '', b: '', em: '', i: '', u: '', s: '', del: '', br: '', sub: '', sup: '',
  thead: '', tbody: '', tfoot: '', tr: '',
}

const DROP = new Set(['script', 'style', 'meta', 'link', 'title', 'head', 'button', 'svg', 'noscript', 'iframe', 'object', 'input', 'textarea', 'select', 'template'])
const BLOCKISH = new Set(['section', 'article', 'header', 'footer', 'main', 'aside', 'nav', 'figure', 'figcaption', 'details', 'summary', 'dl', 'dd', 'dt', 'center'])

// Marks inline code so its style can be switched after rendering.
export const CODE_MARKER = 'data-mf'

function make(tag: string, style?: string) {
  const el = document.createElement(tag)
  if (style) el.setAttribute('style', style)
  return el
}

function cleanInto(src: Node, dest: Node, inPre: boolean, codeStyle: string) {
  for (const node of Array.from(src.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      dest.appendChild(document.createTextNode(node.nodeValue ?? ''))
      continue
    }
    if (node.nodeType !== Node.ELEMENT_NODE) continue

    const el = node as HTMLElement
    const tag = el.tagName.toLowerCase()
    if (DROP.has(tag)) continue

    if (tag === 'code' || tag === 'kbd' || tag === 'samp' || tag === 'tt') {
      if (inPre) { cleanInto(el, dest, true, codeStyle); continue }
      const code = make('code', codeStyle)
      code.setAttribute(CODE_MARKER, 'code')
      cleanInto(el, code, false, codeStyle)
      dest.appendChild(code)
      continue
    }

    if (tag === 'pre') {
      const pre = make('pre', STYLES.pre)
      cleanInto(el, pre, true, codeStyle)
      dest.appendChild(pre)
      continue
    }

    if (tag === 'img') {
      const src = el.getAttribute('src')
      if (src && !inPre) {
        const img = make('img', 'max-width:100%;') as HTMLImageElement
        img.src = src
        const alt = el.getAttribute('alt')
        if (alt) img.alt = alt
        dest.appendChild(img)
      }
      continue
    }

    if (inPre) {
      // Syntax-highlighting spans etc. — keep just the text and line breaks.
      if (tag === 'br') dest.appendChild(document.createTextNode('\n'))
      else cleanInto(el, dest, true, codeStyle)
      continue
    }

    if (tag in STYLES) {
      const out = make(tag, STYLES[tag])
      if (tag === 'a') {
        const href = el.getAttribute('href')
        if (href && !/^\s*javascript:/i.test(href)) out.setAttribute('href', href)
      }
      if (tag === 'td' || tag === 'th') {
        for (const attr of ['colspan', 'rowspan']) {
          const v = el.getAttribute(attr)
          if (v) out.setAttribute(attr, v)
        }
      }
      if (tag === 'ol') {
        const start = el.getAttribute('start')
        if (start) out.setAttribute('start', start)
      }
      cleanInto(el, out, false, codeStyle)
      dest.appendChild(out)
      continue
    }

    if (BLOCKISH.has(tag)) {
      const out = make('div')
      cleanInto(el, out, false, codeStyle)
      dest.appendChild(out)
      continue
    }

    // span, font, mark, etc.: translate meaningful inline styling, drop the rest.
    const { fontWeight, fontStyle, fontFamily } = el.style
    const isBold = fontWeight === 'bold' || fontWeight === 'bolder' || parseInt(fontWeight, 10) >= 600
    const isItalic = fontStyle === 'italic'
    const isMono = /mono|courier|consolas|menlo/i.test(fontFamily || '')

    let target: Node = dest
    const wrap = (t: string, s?: string) => {
      const w = make(t, s)
      target.appendChild(w)
      target = w
      return w
    }
    if (isMono) wrap('code', codeStyle).setAttribute(CODE_MARKER, 'code')
    if (isBold) wrap('strong')
    if (isItalic) wrap('em')
    cleanInto(el, target, false, codeStyle)
  }
}

function tidy(root: HTMLElement) {
  // Drop empty wrappers left over from stripped markup.
  let changed = true
  while (changed) {
    changed = false
    for (const el of Array.from(root.querySelectorAll('div, p, span, strong, em, b, i, li, ul, ol'))) {
      if (!el.textContent?.trim() && !el.querySelector('img, br, hr')) { el.remove(); changed = true }
    }
  }
  // Unwrap unstyled divs that only contain a single child.
  for (const div of Array.from(root.querySelectorAll('div:not([style])'))) {
    if (div.children.length === 1 && div.childNodes.length === 1) div.replaceWith(div.firstChild!)
  }
  // Remove whitespace-only text between list / table structure.
  for (const el of Array.from(root.querySelectorAll('ul, ol, table, thead, tbody, tr'))) {
    for (const n of Array.from(el.childNodes)) {
      if (n.nodeType === Node.TEXT_NODE && !n.nodeValue?.trim()) n.remove()
    }
  }
  for (const p of Array.from(root.querySelectorAll<HTMLElement>('li > p:last-child'))) p.style.marginBottom = '0'
  for (const list of Array.from(root.querySelectorAll<HTMLElement>('li > ul, li > ol'))) {
    list.style.marginTop = '4px'
    list.style.marginBottom = '0'
  }
}

export function cleanHtml(html: string, codeStyle: CodeStyle): HTMLElement {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const out = document.createElement('div')
  cleanInto(doc.body, out, false, CODE_STYLES[codeStyle])
  tidy(out)
  return out
}

/* ---------- Minimal Markdown → HTML for plain-text pastes ---------- */

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inlineMd(s: string) {
  const codes: string[] = []
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000` })
  s = esc(s)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*(?!\s)(.+?)\*(?!\w)/g, '$1<em>$2</em>')
    .replace(/(^|[^_\w])_(?!\s)(.+?)_(?!\w)/g, '$1<em>$2</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[Number(i)])}</code>`)
}

export function mdToHtml(md: string): string {
  const lines = md.replace(/\r\n?/g, '\n').split('\n')
  const out: string[] = []
  let para: string[] = []
  const listStack: { type: 'ul' | 'ol'; indent: number }[] = []

  const flushPara = () => {
    if (para.length) { out.push(`<p>${inlineMd(para.join(' '))}</p>`); para = [] }
  }
  const closeLists = (toIndent = -1) => {
    while (listStack.length && listStack[listStack.length - 1].indent > toIndent) {
      out.push(`</li></${listStack.pop()!.type}>`)
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const fence = line.match(/^\s*(```|~~~)/)
    if (fence) {
      flushPara(); closeLists()
      const body: string[] = []
      while (++i < lines.length && !lines[i].trim().startsWith(fence[1])) body.push(lines[i])
      out.push(`<pre>${esc(body.join('\n'))}</pre>`)
      continue
    }

    if (!line.trim()) { flushPara(); continue }

    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) { flushPara(); closeLists(); out.push(`<h${h[1].length}>${inlineMd(h[2])}</h${h[1].length}>`); continue }

    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { flushPara(); closeLists(); out.push('<hr>'); continue }

    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) && lines[i + 1].includes('-')) {
      flushPara(); closeLists()
      const cells = (l: string) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => inlineMd(c.trim()))
      let t = '<table><thead><tr>' + cells(line).map((c) => `<th>${c}</th>`).join('') + '</tr></thead><tbody>'
      i++
      while (i + 1 < lines.length && /^\s*\|.*\|\s*$/.test(lines[i + 1])) {
        t += '<tr>' + cells(lines[++i]).map((c) => `<td>${c}</td>`).join('') + '</tr>'
      }
      out.push(t + '</tbody></table>')
      continue
    }

    const li = line.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/)
    if (li) {
      flushPara()
      const indent = li[1].replace(/\t/g, '    ').length
      const type = /\d/.test(li[2]) ? 'ol' : 'ul'
      const top = listStack[listStack.length - 1]
      if (!top || indent > top.indent) {
        const n = parseInt(li[2], 10)
        const start = type === 'ol' && n !== 1 ? ` start="${n}"` : ''
        out.push(`<${type}${start}><li>`)
        listStack.push({ type, indent })
      } else {
        closeLists(indent)
        const cur = listStack[listStack.length - 1]
        if (cur && cur.type !== type) {
          out.push(`</li></${listStack.pop()!.type}><${type}><li>`)
          listStack.push({ type, indent })
        } else {
          out.push('</li><li>')
        }
      }
      out.push(inlineMd(li[3]))
      continue
    }

    const bq = line.match(/^\s*>\s?(.*)$/)
    if (bq) { flushPara(); closeLists(); out.push(`<blockquote>${inlineMd(bq[1])}</blockquote>`); continue }

    if (listStack.length && /^\s+/.test(line) && !para.length) { out.push(' ' + inlineMd(line.trim())); continue }

    closeLists()
    para.push(line.trim())
  }
  flushPara(); closeLists()
  return out.join('\n')
}

// Final HTML for the clipboard: strips internal markers and empty style attributes.
export function toEmailHtml(root: HTMLElement): string {
  const clone = root.cloneNode(true) as HTMLElement
  for (const el of Array.from(clone.querySelectorAll(`[${CODE_MARKER}]`))) el.removeAttribute(CODE_MARKER)
  for (const el of Array.from(clone.querySelectorAll('[style=""]'))) el.removeAttribute('style')
  return clone.innerHTML
}
