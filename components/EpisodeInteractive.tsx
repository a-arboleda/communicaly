"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import jsPDF from "jspdf"
import PreAudioPlanner from "@/components/PreAudioPlanner"

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
  showPhrasebook = true,
  showResetControls = true,
}: {
  episodeId: string
  audioTitle?: string
  showPhrasebook?: boolean
  showResetControls?: boolean
}) {
  const STORAGE_EP = useMemo(() => `ep:${episodeId}`, [episodeId])
  const STORAGE_PB = "pb:myphrases"

  // Per-episode state
  const [answer, setAnswer] = useState("")
  const [selfRate, setSelfRate] = useState<number>(0)
  const [recSkipped, setRecSkipped] = useState<boolean>(false)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)

  // Recorder state
  const [micMsg, setMicMsg] = useState<string>("Status: checking microphone…")
  const [recording, setRecording] = useState<boolean>(false)
  const [elapsed, setElapsed] = useState<number>(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<number | null>(null)
  const autoResetGuardRef = useRef(false)

  // Phrasebook (global across episodes)
  const [pb, setPb] = useState<PhraseItem[]>([])
  const [pbText, setPbText] = useState("")
  const [pbTag, setPbTag] = useState("")
  const [autoResetNotice, setAutoResetNotice] = useState<string | null>(null)

  // Load persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_EP)
      if (raw) {
        const s = JSON.parse(raw)
        if (s.answer) setAnswer(s.answer)
        if (typeof s.selfRate === "number") setSelfRate(Math.min(5, Math.max(0, s.selfRate)))
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
    const s = { answer, selfRate, recSkipped, recordingUrl }
    try {
      localStorage.setItem(STORAGE_EP, JSON.stringify(s))
    } catch {}
  }, [STORAGE_EP, answer, selfRate, recSkipped, recordingUrl])

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
  function formatGetUserMediaError(err: unknown): string {
    const error =
      typeof err === "object" && err !== null
        ? (err as { name?: string; code?: string })
        : undefined
    const code = typeof error?.code === "string" ? error.code : ""
    const name = error?.name || code
    if (!window.isSecureContext) return "Recording requires HTTPS or http://localhost."
    switch (name) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        return "Microphone permission denied. Click the camera/mic icon in the address bar to allow it. In Brave, allow mic or lower Shields for this site, then retry."
      case "NotFoundError":
      case "DevicesNotFoundError":
        return "No microphone found. Plug in or enable a mic and try again."
      case "NotReadableError":
        return "Microphone is in use by another app. Close it and retry."
      case "OverconstrainedError":
        return "Requested mic settings aren’t supported. Try the default device."
      case "SecurityError":
        return "Recording blocked by the browser. Use HTTPS or adjust site permissions."
      case "AbortError":
        return "Recording request was aborted. Please try again."
      default:
        return "Couldn’t access the microphone. Check permission and try again."
    }
  }

  async function preflight() {
    if (recSkipped) return
    if (!window.isSecureContext) {
      setMicMsg("Recording requires HTTPS or http://localhost.")
      return
    }
    // Feature detection for MediaRecorder (Safari/older browsers)
    if (typeof window === "undefined" || typeof window.MediaRecorder === "undefined") {
      setMicMsg("Recording not supported in this browser (no MediaRecorder). Try Chrome, Edge, or Firefox.")
      return
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicMsg("This browser does not support microphone access.")
      return
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      })
      s.getTracks().forEach((t) => t.stop())
      setMicMsg("Microphone enabled. You can start recording.")
    } catch (err) {
      setMicMsg(formatGetUserMediaError(err))
    }
  }

  function pickMimeType(): MediaRecorderOptions | undefined {
    if (typeof window === "undefined" || typeof window.MediaRecorder === "undefined") {
      return undefined
    }
    const MediaRecorderCtor = window.MediaRecorder
    if (typeof MediaRecorderCtor.isTypeSupported !== "function") return undefined
    if (MediaRecorderCtor.isTypeSupported("audio/webm;codecs=opus")) return { mimeType: "audio/webm;codecs=opus" }
    if (MediaRecorderCtor.isTypeSupported("audio/webm")) return { mimeType: "audio/webm" }
    if (MediaRecorderCtor.isTypeSupported("audio/ogg;codecs=opus")) return { mimeType: "audio/ogg;codecs=opus" }
    if (MediaRecorderCtor.isTypeSupported("audio/mp4")) return { mimeType: "audio/mp4" }
    return undefined
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
      const opts = pickMimeType()
      let mr: MediaRecorder
      try {
        mr = new MediaRecorder(stream, opts)
      } catch {
        // Retry with no options if a provided mimeType was rejected
        mr = new MediaRecorder(stream)
      }
      mediaRecorderRef.current = mr
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      mr.onstop = () => {
        // Try to preserve the chosen mimeType; default to webm if unknown
        const type = mr.mimeType || opts?.mimeType || "audio/webm"
        const blob = new Blob(chunksRef.current, { type })
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
      }, 200)
    } catch (err) {
      setMicMsg(formatGetUserMediaError(err))
    }
  }

  function stopRec() {
    try {
      const recorder = mediaRecorderRef.current
      if (recorder && recorder.state !== "inactive") {
        recorder.stop()
      }
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
    setRecording(false)
  }

  function enableRecording() {
    setRecSkipped(false)
    setMicMsg("Click Enable microphone to grant access.")
    // Immediately retry preflight so the user sees a prompt or updated status
    preflight()
  }

  // Tips moved to a standalone component rendered on the page

  const resetEpisodeState = useCallback(
    (reason: "auto" | "manual" = "manual") => {
      stopRec()
      stopActiveStream()
      chunksRef.current = []
      setMicMsg("Session reset. Enable the microphone to start again.")
      setRecSkipped(false)
      setAnswer("")
      setSelfRate(0)
      setRecordingUrl((prev) => {
        if (prev) {
          try {
            URL.revokeObjectURL(prev)
          } catch {}
        }
        return null
      })
      setElapsed(0)
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
      setAutoResetNotice(null)
      try {
        localStorage.removeItem(STORAGE_EP)
        if (episodeId) {
          const textBase = `ep:${episodeId}:textAnswer`
          const cats = ["short", "reflective", "personal", "conversation", "summary"]
          cats.forEach((cat) => {
            try {
              localStorage.removeItem(`${textBase}:${cat}:value`)
            } catch {}
          })
          try {
            localStorage.removeItem(`${textBase}:value`)
          } catch {}
          try {
            localStorage.removeItem(`${textBase}:cat`)
          } catch {}
          try {
            localStorage.removeItem(`ep:${episodeId}:preplan`)
          } catch {}
        }
      } catch {}
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("episode:reset", {
            detail: { episodeId, reason },
          }),
        )
      }
    },
    [STORAGE_EP, episodeId],
  )

  useEffect(() => {
    if (typeof document === "undefined") return

    function triggerAutoReset() {
      if (autoResetGuardRef.current) return
      autoResetGuardRef.current = true
      resetEpisodeState("auto")
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        triggerAutoReset()
      } else {
        autoResetGuardRef.current = false
      }
    }

    function handlePageHide() {
      triggerAutoReset()
    }

    function handleBlur() {
      if (document.visibilityState === "hidden") {
        triggerAutoReset()
      }
    }

    window.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("pagehide", handlePageHide)
    window.addEventListener("beforeunload", handlePageHide)
    window.addEventListener("blur", handleBlur)
    function handleFocus() {
      autoResetGuardRef.current = false
    }
    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("pagehide", handlePageHide)
      window.removeEventListener("beforeunload", handlePageHide)
      window.removeEventListener("blur", handleBlur)
      window.removeEventListener("focus", handleFocus)
    }
  }, [resetEpisodeState])

  useEffect(() => {
    return () => {
      autoResetGuardRef.current = true
      resetEpisodeState("auto")
    }
  }, [resetEpisodeState])

  useEffect(() => {
    if (!autoResetNotice) return
    if (answer || recordingUrl || selfRate > 0) {
      setAutoResetNotice(null)
    }
  }, [autoResetNotice, answer, recordingUrl, selfRate])

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
    const items = filtered
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 48
    const contentWidth = pageWidth - margin * 2

    // Header with logo + Communicaly
    const makeSafe = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    const epSafe = makeSafe((audioTitle || episodeId || "episode").toString())
    // Light-blue header background
    pdf.setFillColor(219, 234, 254) // brand-200
    pdf.rect(0, 0, pageWidth, 64, "F")
    const brandY = 40
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(16)
    pdf.text("Communicaly", margin, brandY)
    // Title + subtitle (no date shown)
    pdf.setTextColor(17, 24, 39)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(20)
    pdf.text("My Phrasebook", margin, brandY + 52)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(11)
    pdf.setTextColor(75, 85, 99)
    const subtitle = `${audioTitle ? `${audioTitle}` : ""}`
    if (subtitle) pdf.text(subtitle, margin, brandY + 76)

    let y = brandY + 116
    if (!items.length) {
      pdf.setFontSize(12)
      pdf.setTextColor(107, 114, 128) // gray-500
      pdf.text("No saved phrases yet.", margin, y)
      pdf.save(`phrasebook-${epSafe}.pdf`)
      return
    }

    // List items with wrapping and metadata
    const itemGap = 14
    items.forEach((it) => {
      // Auto page break
      const approxNeeded = 16 + 12 + itemGap // rough estimate
      if (y + approxNeeded > pageHeight - margin) {
        pdf.addPage()
        // Repeat small header on new page with logo if available
        pdf.setFillColor(219, 234, 254) // brand-200
        pdf.rect(0, 0, pageWidth, 40, "F")
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(10)
        pdf.setTextColor(100, 116, 139)
        pdf.text("Communicaly — My Phrasebook", margin, 32)
        y = 76
      }

      // Phrase text
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(17, 24, 39) // gray-900
      pdf.setFontSize(12)
      const wrapped = pdf.splitTextToSize(it.text, contentWidth)
      pdf.text(wrapped, margin, y)
      y += wrapped.length * (12 + 2) // line height

      // Metadata line: only tag chip (no dates)
      if (it.tag) {
        const tagTxt = String(it.tag)
        const padX = 6
        const tagWidth = pdf.getTextWidth(tagTxt) + padX * 2
        const tagX = pageWidth - margin - tagWidth
        const tagY = y - 10
        pdf.setFillColor(255, 247, 237) // orange-50
        pdf.setDrawColor(254, 215, 170) // orange-200
        pdf.roundedRect(tagX, tagY, tagWidth, 18, 4, 4, "FD")
        pdf.setTextColor(194, 65, 12) // orange-700
        pdf.text(tagTxt, tagX + padX, tagY + 13)
        // Reset text color for next items
        pdf.setTextColor(100, 116, 139)
      }

      y += itemGap
      // Divider
      pdf.setDrawColor(229, 231, 235)
      pdf.line(margin, y, pageWidth - margin, y)
      y += 12
    })

    pdf.save(`phrasebook-${epSafe}.pdf`)
  }

  const filtered = pb

  return (
    <div className="mt-8 space-y-8">
      {/* Recorder */}
      <div>
        <section id="record" className="card scroll-mt-20">
          <div className="card-body">
            {autoResetNotice && (
              <div className="mb-3 rounded-lg border border-brand-300 bg-brand-50 px-3 py-2 text-sm text-brand-900">
                {autoResetNotice}
              </div>
            )}
          <div className="mb-2">
            <h3 className="font-semibold text-base">Respond to the audio</h3>
            <p className="mt-1 text-base sm:text-lg text-brand-900 font-semibold italic pl-3 border-l-2 border-brand-300">
              Speak your mind—what’s the most real answer you can give?
            </p>
          </div>
          {/* New planner between question and recorder */}
          <div className="mb-4">
            <PreAudioPlanner episodeId={episodeId} />
          </div>
          <h3 className="font-semibold">Record yourself</h3>
          {!recSkipped ? (
            <div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <button onClick={preflight} className="btn btn-muted inline-flex items-center gap-1" title="Enable microphone">
                  <span aria-hidden>🎙️</span>
                  <span>Enable microphone</span>
                </button>
                <button
                  onClick={recording ? stopRec : startRec}
                  className={`inline-flex items-center gap-1 btn ${recording ? "btn-danger bg-red-600 hover:bg-red-700 border-red-700" : "btn-primary"}`}
                  title={recording ? "Stop recording" : "Start recording"}
                >
                  <span aria-hidden>{recording ? "⏹" : "⏺"}</span>
                  <span>{recording ? "Stop" : "Record"}</span>
                </button>
                <button onClick={skipRecording} className="btn btn-ghost">Skip recording</button>
                <span className="text-sm text-gray-600 tabular-nums">{fmtTime(elapsed)}</span>
              </div>
              <p className="mt-2 text-sm">{micMsg}</p>
              {recordingUrl && (
                <div className="mt-3 space-y-2">
                  <audio controls className="w-full" src={recordingUrl} />
                  <a
                    className="btn btn-muted"
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
              {micMsg && <p className="text-sm text-gray-600 mb-2">{micMsg}</p>}
              <button onClick={enableRecording} className="btn btn-muted">Enable recorder</button>
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
          </div>
        </section>
      </div>

      {/* Tips card now rendered in the episode page under the transcript */}

      {/* Phrasebook */}
      {showPhrasebook && (
        <section id="phrasebook" className="card scroll-mt-20">
          <div className="card-body">
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
                placeholder="Purpose (Express feeling, Express opinion)"
                className="rounded-xl border p-2"
              />
            </div>
            <div className="flex gap-2 flex-wrap mt-3">
              <button onClick={() => savePhrase(pbText || answer || "", pbTag)} className="btn btn-primary">
                Save phrase
              </button>
              <button onClick={exportPdf} className="btn btn-muted">Export PDF</button>
            </div>

            {/* Removed search and tag filters per request */}

            <div className="mt-3">
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
                            className="btn btn-muted px-3 py-1"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(it.text)
                              } catch {}
                            }}
                          >
                            Copy
                          </button>
                          <button className="btn btn-ghost px-3 py-1" onClick={() => deletePhrase(it.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">PDF export includes only this phrasebook section.</p>
          </div>
        </section>
      )}

      {/* Utilities */}
      {showResetControls && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              if (!confirm("Clear saved inputs for this episode?")) return
              resetEpisodeState("manual")
            }}
            className="btn btn-ghost"
          >
            Reset this episode
          </button>
        </div>
      )}
    </div>
  )
}
