"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

type PhraseItem = {
  id: number
  text: string
  tag?: string
  ep?: string
  date: string
}

export default function EpisodeInteractive({
  episodeId,
  audioTitle,
}: {
  episodeId: string
  audioTitle?: string
}) {
  const STORAGE_EP = useMemo(() => `ep:${episodeId}`, [episodeId])
  const STORAGE_PB = "pb:myphrases"

  // Per-episode state
  const [answer, setAnswer] = useState("")
  const [sentences, setSentences] = useState("")
  const [shadowing, setShadowing] = useState("")
  const [selfRate, setSelfRate] = useState<number>(0)
  const [recSkipped, setRecSkipped] = useState<boolean>(false)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)

  // Recorder state
  const [micMsg, setMicMsg] = useState<string>("Status: checking microphone…")
  const [recReady, setRecReady] = useState<boolean>(false)
  const [recording, setRecording] = useState<boolean>(false)
  const [elapsed, setElapsed] = useState<number>(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<number | null>(null)

  // Phrasebook (global across episodes)
  const [pb, setPb] = useState<PhraseItem[]>([])
  const [pbText, setPbText] = useState("")
  const [pbTag, setPbTag] = useState("")
  const [pbSearch, setPbSearch] = useState("")
  const [pbFilter, setPbFilter] = useState("")
  const pbRef = useRef<HTMLDivElement>(null)

  // Default sentence starters
  const starters = [
    "I usually start my day with ___.",
    "Most days I ___, but sometimes I ___.",
    "I prefer ___ because ___.",
    "If I’m in a rush, I ___.",
    "My small daily ritual is ___.",
  ]

  // Load persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_EP)
      if (raw) {
        const s = JSON.parse(raw)
        if (s.answer) setAnswer(s.answer)
        if (s.sentences) setSentences(s.sentences)
        if (typeof s.selfRate === "number") setSelfRate(Math.min(5, Math.max(0, s.selfRate)))
        if (typeof s.shadowing === "string") setShadowing(s.shadowing)
        if (s.recSkipped) setRecSkipped(!!s.recSkipped)
        if (s.recordingUrl) setRecordingUrl(s.recordingUrl)
      }
    } catch {}

    try {
      const rawPb = localStorage.getItem(STORAGE_PB)
      if (rawPb) setPb(JSON.parse(rawPb))
    } catch {}

    // Initial mic status
    if (!window.isSecureContext) {
      setMicMsg("Not secure: use HTTPS or http://localhost for recording.")
    } else {
      setMicMsg("Click Enable microphone to grant access.")
    }
  }, [STORAGE_EP])

  // Persist per-episode state
  useEffect(() => {
    const s = { answer, sentences, shadowing, selfRate, recSkipped, recordingUrl }
    try {
      localStorage.setItem(STORAGE_EP, JSON.stringify(s))
    } catch {}
  }, [STORAGE_EP, answer, sentences, shadowing, selfRate, recSkipped, recordingUrl])

  // Helpers
  function todayStr() {
    const d = new Date()
    return d.toISOString().slice(0, 10)
  }
  function fmtTime(sec: number) {
    const s = Math.max(0, Math.floor(sec))
    const m = String(Math.floor(s / 60)).padStart(2, "0")
    const r = String(s % 60).padStart(2, "0")
    return `${m}:${r}`
  }
  function stopActiveStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  // Recorder actions
  async function preflight() {
    if (recSkipped) return
    if (!window.isSecureContext) {
      setMicMsg("Not secure: use HTTPS or http://localhost for recording.")
      setRecSkipped(true)
      return
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicMsg("This browser does not support microphone access.")
      setRecSkipped(true)
      return
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      })
      s.getTracks().forEach((t) => t.stop())
      setRecReady(true)
      setMicMsg("Microphone enabled. You can start recording.")
    } catch (err: any) {
      setMicMsg("Permission denied or no microphone.")
      setRecSkipped(true)
    }
  }

  async function startRec() {
    try {
      if (recSkipped) return
      if (!window.isSecureContext)
        throw new Error("Recording requires HTTPS or http://localhost")
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      })
      streamRef.current = stream
      chunksRef.current = []
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        stopActiveStream()
        const url = URL.createObjectURL(blob)
        setRecordingUrl(url)
        setMicMsg("Recording saved locally.")
      }
      mr.start()
      setRecording(true)
      setElapsed(0)
      if (timerRef.current) window.clearInterval(timerRef.current)
      const start = Date.now()
      timerRef.current = window.setInterval(() => {
        setElapsed((Date.now() - start) / 1000)
      }, 200) as any
    } catch (err: any) {
      setMicMsg("Couldn’t start recording. Check permission/HTTPS.")
      setRecSkipped(true)
      setRecReady(false)
    }
  }

  function stopRec() {
    try {
      mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive" &&
        mediaRecorderRef.current.stop()
    } finally {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
      setRecording(false)
      setElapsed(0)
    }
  }

  function skipRecording() {
    setRecSkipped(true)
    stopActiveStream()
    setRecReady(false)
    setRecording(false)
  }

  function enableRecording() {
    setRecSkipped(false)
    setMicMsg("Click Enable microphone to grant access.")
  }

  // Phrasebook helpers
  function savePhrase(text?: string, tag?: string) {
    const t = (text || "").trim()
    const tg = (tag || "").trim()
    if (!t) return
    const item: PhraseItem = { id: Date.now(), text: t, tag: tg, ep: episodeId, date: todayStr() }
    const next = [item, ...pb]
    setPb(next)
    try { localStorage.setItem(STORAGE_PB, JSON.stringify(next)) } catch {}
    setPbText("")
    setPbTag("")
  }

  function deletePhrase(id: number) {
    const next = pb.filter((x) => x.id !== id)
    setPb(next)
    try { localStorage.setItem(STORAGE_PB, JSON.stringify(next)) } catch {}
  }

  async function exportPdf() {
    const el = pbRef.current
    if (!el) return
    const canvas = await html2canvas(el)
    const img = canvas.toDataURL("image/png")
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = (canvas.height * pageWidth) / canvas.width
    pdf.addImage(img, "PNG", 0, 0, pageWidth, pageHeight)
    pdf.save("phrasebook.pdf")
  }

  const filtered = pb.filter((it) => {
    const q = pbSearch.trim().toLowerCase()
    const tg = pbFilter.trim().toLowerCase()
    const okQ = !q || it.text.toLowerCase().includes(q)
    const okT = !tg || (it.tag || "").toLowerCase().includes(tg)
    return okQ && okT
  })

  return (
    <div className="mt-8 space-y-8">
      {/* Top: Episode question and Recorder */}
      <div className="grid gap-6 sm:grid-cols-2">
        <section className="rounded-2xl border bg-white p-4 shadow-sm">
          <h3 className="font-semibold">Episode question</h3>
          <p className="text-sm text-gray-600 mb-2">Write your answer, then try to say it out loud.</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here…"
            className="w-full min-h-[120px] rounded-xl border p-3"
          />

          <div className="mt-4">
            <div className="text-sm font-semibold mb-1">Build your sentences</div>
            <p className="text-sm text-gray-600">Click a starter, then edit to make it true for you.</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {starters.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  className="px-3 py-1 rounded-full border text-sm bg-orange-50 border-orange-200 text-orange-700"
                  onClick={() => setSentences((prev) => (prev ? prev + "\n" + s : s))}
                >
                  {s.split(" ")[0]}…
                </button>
              ))}
            </div>
            <textarea
              value={sentences}
              onChange={(e) => setSentences(e.target.value)}
              placeholder="Your personalized sentences will go here…"
              className="mt-2 w-full min-h-[110px] rounded-xl border p-3"
            />
            <div className="mt-4">
              <div className="text-sm font-semibold mb-1">Shadowing practice</div>
              <p className="text-sm text-gray-600">As you listen, jot ideas or tricky phrases to repeat and mimic.</p>
              <textarea
                value={shadowing}
                onChange={(e) => setShadowing(e.target.value)}
                placeholder="Type your shadowing ideas here… (e.g., stress patterns, chunks to copy, intonation notes)"
                className="mt-2 w-full min-h-[100px] rounded-xl border p-3"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-4 shadow-sm">
          <h3 className="font-semibold">Record yourself</h3>
          {!recSkipped ? (
            <div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <button onClick={preflight} className="px-3 py-2 rounded-xl border">Enable microphone</button>
                <button onClick={startRec} disabled={!recReady || recording} className="px-3 py-2 rounded-xl border disabled:opacity-50">● Record</button>
                <button onClick={stopRec} disabled={!recording} className="px-3 py-2 rounded-xl border disabled:opacity-50">■ Stop</button>
                <button onClick={skipRecording} className="px-3 py-2 rounded-xl border">Skip recording</button>
                <span className="text-sm text-gray-600 tabular-nums">{fmtTime(elapsed)}</span>
              </div>
              <p className="mt-2 text-sm">{micMsg}</p>
              {recordingUrl && (
                <div className="mt-3 space-y-2">
                  <audio controls className="w-full" src={recordingUrl} />
                  <a
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border"
                    download={`${(audioTitle || episodeId).replace(/\s+/g, "-").toLowerCase()}-recording.webm`}
                    href={recordingUrl}
                  >
                    Download recording
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border p-3 bg-gray-50 mt-2">
              <p className="text-sm mb-2">Recording was skipped. Practice out loud, then use the self‑rating below. You can enable the recorder anytime.</p>
              <button onClick={enableRecording} className="px-3 py-2 rounded-xl border">Enable recorder</button>
            </div>
          )}

          <div className="mt-4">
            <label className="text-sm text-gray-600 mr-3">How natural did that sound?</label>
            <div className="inline-flex items-center gap-1" role="radiogroup" aria-label="Self-rating out of 5">
              {Array.from({ length: 5 }).map((_, i) => {
                const n = i + 1
                const active = selfRate >= n
                return (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={active}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    onClick={() => setSelfRate(n === selfRate ? 0 : n)}
                    className={`text-2xl leading-none ${active ? "text-yellow-500" : "text-gray-300"}`}
                  >
                    {active ? "★" : "☆"}
                  </button>
                )
              })}
              <span className="text-sm text-gray-600 ml-2">{selfRate}/5</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Your recordings + rating stay on this device.</p>
        </section>
      </div>

      {/* Phrasebook */}
      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <h3 className="font-semibold">Save to My phrasebook</h3>
        <div className="grid gap-3 sm:grid-cols-2 mt-2">
          <input
            value={pbText}
            onChange={(e) => setPbText(e.target.value)}
            placeholder="Type or select a phrase to save"
            className="rounded-xl border p-2"
          />
          <input
            value={pbTag}
            onChange={(e) => setPbTag(e.target.value)}
            placeholder="Tag (e.g., dinner, routine)"
            className="rounded-xl border p-2"
          />
        </div>
        <div className="flex gap-2 flex-wrap mt-3">
          <button onClick={() => savePhrase(pbText || sentences.split("\n").slice(-1)[0] || "", pbTag)} className="px-3 py-2 rounded-xl border">
            Save phrase
          </button>
          <button onClick={exportPdf} className="px-3 py-2 rounded-xl border">Export PDF</button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 mt-3">
          <input
            value={pbSearch}
            onChange={(e) => setPbSearch(e.target.value)}
            placeholder="Search phrasebook…"
            className="rounded-xl border p-2"
          />
          <input
            value={pbFilter}
            onChange={(e) => setPbFilter(e.target.value)}
            placeholder="Filter by tag…"
            className="rounded-xl border p-2"
          />
        </div>

        <div ref={pbRef} className="mt-3">
          <h4 className="font-semibold">My Phrasebook</h4>
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-600">No saved phrases yet.</p>
          ) : (
            <div className="grid gap-2 mt-2">
              {filtered.map((it) => (
                <div key={it.id} className="rounded-xl border p-3">
                  <div>{it.text}</div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {it.date}
                      {it.tag ? (
                        <span className="ml-2 inline-block rounded-full border bg-orange-50 border-orange-200 text-orange-700 px-2 py-0.5 text-xs font-semibold">
                          {it.tag}
                        </span>
                      ) : null}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 rounded-lg border"
                        onClick={async () => {
                          try { await navigator.clipboard.writeText(it.text) } catch {}
                        }}
                      >
                        Copy
                      </button>
                      <button className="px-2 py-1 rounded-lg border" onClick={() => deletePhrase(it.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">PDF export includes only this phrasebook section.</p>
      </section>

      {/* Utilities */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => window.print()}
          className="px-3 py-2 rounded-xl border"
        >
          Print page
        </button>
        <button
          onClick={() => {
            if (!confirm("Clear saved inputs for this episode?")) return
            try { localStorage.removeItem(STORAGE_EP) } catch {}
            setAnswer("")
            setSentences("")
            setSelfRate(0)
            setRecSkipped(false)
            setRecordingUrl(null)
          }}
          className="px-3 py-2 rounded-xl border"
        >
          Reset this episode
        </button>
      </div>
    </div>
  )
}
