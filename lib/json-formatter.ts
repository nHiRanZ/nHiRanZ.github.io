// A small JSON parser and printer for the JSON Formatter tool.
//
// It doesn't use JSON.parse because that loses information people care about:
// big integers get rounded (9007199254740993 -> 9007199254740992), integer-like
// keys get reordered ({"b":1,"2":2} -> {"2":2,"b":1}), and its errors don't say
// where the problem is in every browser. This parser keeps numbers as their
// source text, keeps entries in order, and reports line/column on failure.
//
// It is also forgiving: comments, trailing commas, single quotes, unquoted keys,
// Python literals (True/False/None) and missing commas are repaired, and each
// repair is reported so the input is never silently called valid.

export type JsonNode =
  | { type: 'null' }
  | { type: 'boolean'; value: boolean }
  | { type: 'number'; raw: string }
  | { type: 'string'; value: string }
  | { type: 'array'; items: JsonNode[] }
  | { type: 'object'; entries: JsonEntry[] }

export type JsonEntry = { key: string; value: JsonNode }

export type Location = { offset: number; line: number; column: number }

export type Repair = Location & { message: string; count: number }

export type ParseError = Location & { message: string }

export type ParseResult =
  | { ok: true; node: JsonNode; repairs: Repair[] }
  | { ok: false; error: ParseError }

class Failure {
  constructor(public message: string, public offset: number) {}
}

const IDENT_START = /[A-Za-z_$]/
const IDENT_PART = /[\w$]/
const ESCAPES: Record<string, string> = { '"': '"', '\\': '\\', '/': '/', b: '\b', f: '\f', n: '\n', r: '\r', t: '\t' }

export function locate(src: string, offset: number): Location {
  let line = 1
  let lineStart = 0
  for (let i = 0; i < offset && i < src.length; i++) {
    if (src.charCodeAt(i) === 10) {
      line++
      lineStart = i + 1
    }
  }
  return { offset, line, column: offset - lineStart + 1 }
}

function describe(ch: string | undefined): string {
  if (ch === undefined) return 'end of input'
  if (ch === '\n') return 'a line break'
  if (/\s/.test(ch)) return 'whitespace'
  return `'${ch}'`
}

class Parser {
  private pos = 0
  // Grouped by message so a huge Python dict doesn't produce 10k entries.
  private repairs = new Map<string, { offset: number; count: number }>()

  constructor(private src: string) {}

  parse(): JsonNode {
    const node = this.value()
    this.skip()
    if (this.pos < this.src.length) {
      throw new Failure(`Unexpected ${describe(this.src[this.pos])} after the JSON value`, this.pos)
    }
    return node
  }

  getRepairs(): Repair[] {
    return Array.from(this.repairs, ([message, r]) => ({ message, count: r.count, ...locate(this.src, r.offset) }))
      .sort((a, b) => a.offset - b.offset)
  }

  private repair(message: string, offset: number) {
    const existing = this.repairs.get(message)
    if (existing) existing.count++
    else this.repairs.set(message, { offset, count: 1 })
  }

  private skip() {
    const src = this.src
    while (this.pos < src.length) {
      const ch = src[this.pos]
      if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === '﻿') {
        this.pos++
      } else if (ch === '/' && src[this.pos + 1] === '/') {
        this.repair('Comment removed', this.pos)
        const end = src.indexOf('\n', this.pos)
        this.pos = end === -1 ? src.length : end
      } else if (ch === '/' && src[this.pos + 1] === '*') {
        const end = src.indexOf('*/', this.pos + 2)
        if (end === -1) throw new Failure('Unterminated /* comment', this.pos)
        this.repair('Comment removed', this.pos)
        this.pos = end + 2
      } else {
        break
      }
    }
  }

  private startsValue(ch: string | undefined): boolean {
    return ch !== undefined && /["'{[\-\dtfnTFN]/.test(ch)
  }

  private value(): JsonNode {
    this.skip()
    const ch = this.src[this.pos]
    if (ch === '{') return this.object()
    if (ch === '[') return this.array()
    if (ch === '"' || ch === "'") return { type: 'string', value: this.string() }
    if (ch === '-' || (ch >= '0' && ch <= '9')) return this.number()
    if (ch !== undefined && IDENT_START.test(ch)) return this.literal()
    if (ch === undefined) throw new Failure('Unexpected end of input, expected a value', this.pos)
    throw new Failure(`Unexpected ${describe(ch)}, expected a value`, this.pos)
  }

  private object(): JsonNode {
    const open = this.pos++
    const entries: JsonEntry[] = []
    this.skip()
    if (this.src[this.pos] === '}') {
      this.pos++
      return { type: 'object', entries }
    }
    for (;;) {
      this.skip()
      const keyStart = this.pos
      const ch = this.src[this.pos]
      let key: string
      if (ch === '"' || ch === "'") {
        key = this.string()
      } else if (ch !== undefined && IDENT_START.test(ch)) {
        key = this.identifier()
        this.repair('Unquoted key quoted', keyStart)
      } else if (ch === undefined) {
        throw new Failure("Unexpected end of input, the object opened here is missing a '}'", open)
      } else {
        throw new Failure(`Unexpected ${describe(ch)}, expected a property name in double quotes`, this.pos)
      }
      this.skip()
      if (this.src[this.pos] !== ':') {
        throw new Failure(`Expected ':' after property name, found ${describe(this.src[this.pos])}`, this.pos)
      }
      this.pos++
      entries.push({ key, value: this.value() })
      this.skip()
      const next = this.src[this.pos]
      if (next === ',') {
        const comma = this.pos++
        this.skip()
        if (this.src[this.pos] === '}') {
          this.repair('Trailing comma removed', comma)
          this.pos++
          return { type: 'object', entries }
        }
      } else if (next === '}') {
        this.pos++
        return { type: 'object', entries }
      } else if (next === '"' || next === "'" || (next !== undefined && IDENT_START.test(next))) {
        this.repair('Missing comma inserted', this.pos)
      } else if (next === undefined) {
        throw new Failure("Unexpected end of input, the object opened here is missing a '}'", open)
      } else {
        throw new Failure(`Expected ',' or '}' after property value, found ${describe(next)}`, this.pos)
      }
    }
  }

  private array(): JsonNode {
    const open = this.pos++
    const items: JsonNode[] = []
    this.skip()
    if (this.src[this.pos] === ']') {
      this.pos++
      return { type: 'array', items }
    }
    for (;;) {
      this.skip()
      if (this.src[this.pos] === ',') throw new Failure('Unexpected \',\', expected a value (empty array slot)', this.pos)
      if (this.src[this.pos] === undefined) {
        throw new Failure("Unexpected end of input, the array opened here is missing a ']'", open)
      }
      const itemStart = this.pos
      items.push(this.value())
      this.skip()
      const next = this.src[this.pos]
      if (next === ':') {
        throw new Failure("Found a property name inside an array, is a ']' missing before it?", itemStart)
      }
      if (next === ',') {
        const comma = this.pos++
        this.skip()
        if (this.src[this.pos] === ']') {
          this.repair('Trailing comma removed', comma)
          this.pos++
          return { type: 'array', items }
        }
      } else if (next === ']') {
        this.pos++
        return { type: 'array', items }
      } else if (this.startsValue(next)) {
        this.repair('Missing comma inserted', this.pos)
      } else if (next === undefined) {
        throw new Failure("Unexpected end of input, the array opened here is missing a ']'", open)
      } else {
        throw new Failure(`Expected ',' or ']' after array item, found ${describe(next)}`, this.pos)
      }
    }
  }

  private string(): string {
    const src = this.src
    const quote = src[this.pos]
    const start = this.pos++
    if (quote === "'") this.repair('Single-quoted string converted', start)
    let out = ''
    let chunk = this.pos
    for (;;) {
      if (this.pos >= src.length) throw new Failure('Unterminated string, missing closing quote', start)
      const ch = src[this.pos]
      if (ch === quote) {
        out += src.slice(chunk, this.pos++)
        return out
      }
      if (ch === '\\') {
        out += src.slice(chunk, this.pos)
        const esc = src[this.pos + 1]
        if (esc === 'u') {
          const hex = src.slice(this.pos + 2, this.pos + 6)
          if (!/^[0-9a-fA-F]{4}$/.test(hex)) throw new Failure('Invalid \\u escape, expected 4 hex digits', this.pos)
          out += String.fromCharCode(parseInt(hex, 16))
          this.pos += 6
        } else if (esc !== undefined && esc in ESCAPES) {
          out += ESCAPES[esc]
          this.pos += 2
        } else if (esc === "'") {
          if (quote !== "'") this.repair("Invalid escape \\' fixed", this.pos)
          out += "'"
          this.pos += 2
        } else {
          throw new Failure(`Invalid escape sequence \\${esc ?? ''}`, this.pos)
        }
        chunk = this.pos
        continue
      }
      if (ch === '\n' || ch === '\r') throw new Failure('Unterminated string, line break before the closing quote', start)
      if (ch < ' ') this.repair('Unescaped control character escaped', this.pos)
      this.pos++
    }
  }

  private number(): JsonNode {
    const src = this.src
    const start = this.pos
    if (src[this.pos] === '-') this.pos++
    const digits = () => {
      const from = this.pos
      while (src[this.pos] >= '0' && src[this.pos] <= '9') this.pos++
      return this.pos - from
    }
    if (src[this.pos] === '0') {
      this.pos++
      if (src[this.pos] >= '0' && src[this.pos] <= '9') throw new Failure('Numbers cannot have leading zeros', start)
    } else if (digits() === 0) {
      throw new Failure(`Invalid number, expected a digit after '-'`, start)
    }
    if (src[this.pos] === '.') {
      this.pos++
      if (digits() === 0) throw new Failure('Invalid number, expected a digit after the decimal point', start)
    }
    if (src[this.pos] === 'e' || src[this.pos] === 'E') {
      this.pos++
      if (src[this.pos] === '+' || src[this.pos] === '-') this.pos++
      if (digits() === 0) throw new Failure('Invalid number, expected a digit in the exponent', start)
    }
    return { type: 'number', raw: src.slice(start, this.pos) }
  }

  private identifier(): string {
    const start = this.pos
    while (this.pos < this.src.length && IDENT_PART.test(this.src[this.pos])) this.pos++
    return this.src.slice(start, this.pos)
  }

  private literal(): JsonNode {
    const start = this.pos
    const word = this.identifier()
    switch (word) {
      case 'true': return { type: 'boolean', value: true }
      case 'false': return { type: 'boolean', value: false }
      case 'null': return { type: 'null' }
      case 'True':
      case 'False':
      case 'None':
        this.repair('Python literal converted', start)
        return word === 'None' ? { type: 'null' } : { type: 'boolean', value: word === 'True' }
      case 'undefined':
      case 'NaN':
      case 'Infinity':
        throw new Failure(`${word} is not valid in JSON, use null or a string instead`, start)
      default:
        throw new Failure(`Unexpected word '${word}', strings must be in double quotes`, start)
    }
  }
}

export function parseJson(src: string): ParseResult {
  const parser = new Parser(src)
  try {
    const node = parser.parse()
    return { ok: true, node, repairs: parser.getRepairs() }
  } catch (e) {
    if (!(e instanceof Failure)) throw e
    return { ok: false, error: { message: e.message, ...locate(src, e.offset) } }
  }
}

// ---------------------------------------------------------------------------
// Printing

export type Indent = '2' | '4' | 'tab'

const INDENTS: Record<Indent, string> = { '2': '  ', '4': '    ', tab: '\t' }

function compareKeys(a: JsonEntry, b: JsonEntry) {
  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0
}

// `indent` of null prints minified.
export function stringify(node: JsonNode, indent: Indent | null, sortKeys = false): string {
  const unit = indent ? INDENTS[indent] : ''
  const out: string[] = []
  const write = (n: JsonNode, pad: string) => {
    switch (n.type) {
      case 'null': out.push('null'); return
      case 'boolean': out.push(n.value ? 'true' : 'false'); return
      case 'number': out.push(n.raw); return
      case 'string': out.push(JSON.stringify(n.value)); return
      case 'array': {
        if (n.items.length === 0) { out.push('[]'); return }
        const inner = pad + unit
        out.push('[')
        n.items.forEach((item, i) => {
          if (i > 0) out.push(',')
          if (unit) out.push('\n', inner)
          write(item, inner)
        })
        if (unit) out.push('\n', pad)
        out.push(']')
        return
      }
      case 'object': {
        if (n.entries.length === 0) { out.push('{}'); return }
        const inner = pad + unit
        const entries = sortKeys ? [...n.entries].sort(compareKeys) : n.entries
        out.push('{')
        entries.forEach((entry, i) => {
          if (i > 0) out.push(',')
          if (unit) out.push('\n', inner)
          out.push(JSON.stringify(entry.key), unit ? ': ' : ':')
          write(entry.value, inner)
        })
        if (unit) out.push('\n', pad)
        out.push('}')
      }
    }
  }
  write(node, '')
  return out.join('')
}

export type Stats = { nodes: number; depth: number }

export function stats(node: JsonNode): Stats {
  let nodes = 0
  let depth = 0
  const walk = (n: JsonNode, d: number) => {
    nodes++
    if (d > depth) depth = d
    if (n.type === 'array') n.items.forEach((item) => walk(item, d + 1))
    else if (n.type === 'object') n.entries.forEach((e) => walk(e.value, d + 1))
  }
  walk(node, 0)
  return { nodes, depth }
}

// A string whose contents are themselves JSON, e.g. a copied log field like
// "{\"id\":1}". Returns the inner text so it can be unwrapped.
export function embeddedJson(node: JsonNode): string | null {
  if (node.type !== 'string') return null
  const inner = node.value.trim()
  if (!/^[[{]/.test(inner)) return null
  const result = parseJson(inner)
  return result.ok && result.repairs.length === 0 ? inner : null
}

// ---------------------------------------------------------------------------
// Paths and highlighting

export type PathSegment = string | number

export function formatPath(path: PathSegment[]): string {
  return path.reduce<string>((acc, seg) => {
    if (typeof seg === 'number') return `${acc}[${seg}]`
    return /^[A-Za-z_$][\w$]*$/.test(seg) ? `${acc}.${seg}` : `${acc}[${JSON.stringify(seg)}]`
  }, '$')
}

export type TokenKind = 'key' | 'string' | 'number' | 'boolean' | 'null'

const TOKEN_RE = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d[\d.eE+-]*)|\b(true|false)\b|\b(null)\b/g

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Highlights output produced by `stringify`, which is always well-formed, so a
// regex tokenizer is reliable here. Returns HTML with one span per token.
export function highlight(json: string, classes: Record<TokenKind, string>): string {
  let html = ''
  let last = 0
  for (const m of json.matchAll(TOKEN_RE)) {
    const index = m.index ?? 0
    html += escapeHtml(json.slice(last, index))
    const kind: TokenKind = m[1] ? (m[2] ? 'key' : 'string') : m[3] ? 'number' : m[4] ? 'boolean' : 'null'
    const text = m[1] ?? m[0]
    html += `<span class="${classes[kind]}">${escapeHtml(text)}</span>`
    if (m[2]) html += m[2]
    last = index + m[0].length
  }
  return html + escapeHtml(json.slice(last))
}
