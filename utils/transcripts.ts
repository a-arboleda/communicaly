import fs from "fs"
import path from "path"

export type Cue = { start: number; end?: number; text: string }
export type TranscriptData = { cues: Cue[]; offset?: number }

type RawWord = {
  text?: unknown
  start_time?: unknown
  start?: unknown
  end_time?: unknown
  end?: unknown
}

type RawSegment = {
  text?: unknown
  start_time?: unknown
  start?: unknown
  end_time?: unknown
  end?: unknown
  words?: unknown
}

const T_DIR = path.join(process.cwd(), "content/transcripts")

function toNumber(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) ? n : fallback
}

function sttSegmentsToCues(segments: RawSegment[]): Cue[] {
  const cues: Cue[] = []
  for (const seg of segments) {
    const segText = String(seg.text ?? "")
    const segStart = toNumber(seg.start_time ?? seg.start ?? 0, 0)
    const segEnd =
      typeof seg.end_time !== "undefined"
        ? toNumber(seg.end_time, segStart)
        : typeof seg.end === "number"
          ? seg.end
          : segStart
    const words: RawWord[] = Array.isArray(seg.words) ? (seg.words as RawWord[]) : []
    if (words.length > 0) {
      let tokens: string[] = []
      let sentStart: number | undefined
      const flush = (lastEnd?: number) => {
        const text = tokens.join("").replace(/\s+/g, " ").trim()
        if (text) cues.push({ start: sentStart ?? segStart, end: typeof lastEnd === "number" ? lastEnd : undefined, text })
        tokens = []
        sentStart = undefined
      }
      for (let i = 0; i < words.length; i++) {
        const w = words[i]
        const t = String(w.text ?? "")
        const trimmed = t.trim()
        if (!sentStart && trimmed) {
          const wStart = toNumber(w.start_time ?? w.start ?? segStart, segStart)
          sentStart = wStart
        }
        tokens.push(t)
        const wEnd = toNumber(w.end_time ?? w.end ?? segEnd, segEnd)
        const isSentenceEnd = /[.!?]["'”’)]?$/.test(trimmed) || i === words.length - 1
        if (isSentenceEnd) flush(wEnd)
      }
      continue
    }
    // No word-level timing: split by sentences and proportionally assign times
    const parts = segText
      .split(/(?<=[.!?])\s+/)
      .map((s: string) => s.replace(/\s+/g, " ").trim())
      .filter(Boolean)
    if (parts.length === 0) continue
    const dur = Math.max(0, (segEnd || segStart) - segStart)
    for (let i = 0; i < parts.length; i++) {
      const start = segStart + (dur * i) / parts.length
      const end = i === parts.length - 1 ? segEnd : segStart + (dur * (i + 1)) / parts.length
      cues.push({ start, end, text: parts[i] })
    }
  }
  // Ensure sorted by start
  return cues.sort((a, b) => a.start - b.start)
}

function isCue(value: unknown): value is Cue {
  if (typeof value !== "object" || value === null) return false
  const maybe = value as { start?: unknown; end?: unknown; text?: unknown }
  return typeof maybe.start === "number" && typeof maybe.text === "string" && (typeof maybe.end === "number" || typeof maybe.end === "undefined")
}

export function getTranscript(slug: string): TranscriptData | null {
  const p = path.join(T_DIR, slug + ".json")
  if (!fs.existsSync(p)) return null
  try {
    const raw = fs.readFileSync(p, "utf8")
    const data: unknown = JSON.parse(raw)
    if (Array.isArray(data)) {
      const cues = data.filter(isCue) as Cue[]
      if (cues.length) return { cues, offset: 0 }
    }
    if (typeof data === "object" && data !== null && Array.isArray((data as { cues?: unknown }).cues)) {
      const cues = ((data as { cues: unknown[] }).cues).filter(isCue) as Cue[]
      const offsetValue = (data as { offset?: unknown }).offset
      return { cues, offset: typeof offsetValue === "number" ? offsetValue : 0 }
    }
    // STT-style schema: { segments: [{ text, start_time, end_time, ... }], language_code?: string }
    if (typeof data === "object" && data !== null && Array.isArray((data as { segments?: unknown }).segments)) {
      const segments = (data as { segments: RawSegment[] }).segments
      const cues = sttSegmentsToCues(segments)
      return { cues, offset: 0 }
    }
  } catch {}
  return null
}

// Back-compat shim
export function getTranscriptCues(slug: string): Cue[] | null {
  const t = getTranscript(slug)
  return t ? t.cues : null
}
