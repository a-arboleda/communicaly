"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import jsPDF from "jspdf"
import addStarsToPdf from "@/utils/pdfStars"
import { Mp3Encoder } from "lamejs"
import EpisodeTaskCheckbox from "@/components/EpisodeTaskCheckbox"

type PhraseItem = {
  id: number
  text: string
  tag?: string
  ep?: string
  date: string
}

type SavedRecording = {
  id: string
  createdAt: number
  dataUrl: string
  mimeType: string
  duration: number
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(typeof reader.result === "string" ? reader.result : "")
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

function dataUrlToBlob(dataUrl: string) {
  const [metadata, base64] = dataUrl.split(",")
  const mimeMatch = /data:([^;]+);base64/.exec(metadata || "")
  const mime = mimeMatch?.[1] || "application/octet-stream"
  const binary = typeof atob === "function" ? atob(base64 || "") : ""
  const len = binary.length
  const buffer = new Uint8Array(len)
  for (let i = 0; i < len; i += 1) buffer[i] = binary.charCodeAt(i)
  return new Blob([buffer], { type: mime })
}

function getAudioContextCtor() {
  if (typeof window === "undefined") return null
  const audioWindow = window as Window &
    typeof globalThis & {
      webkitAudioContext?: typeof AudioContext
    }
  return audioWindow.AudioContext || audioWindow.webkitAudioContext || null
}

function floatTo16BitPCM(input: Float32Array) {
  const output = new Int16Array(input.length)
  for (let i = 0; i < input.length; i += 1) {
    const s = Math.max(-1, Math.min(1, input[i]))
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
  return output
}

function encodeFloat32SamplesToMp3(samples: Float32Array, sampleRate: number) {
  const encoder = new Mp3Encoder(1, sampleRate, 128)
  const blockSize = 1152
  const mp3Chunks: Uint8Array[] = []
  for (let i = 0; i < samples.length; i += blockSize) {
    const block = samples.subarray(i, i + blockSize)
    const mp3buf = encoder.encodeBuffer(floatTo16BitPCM(block))
    if (mp3buf.length > 0) mp3Chunks.push(mp3buf)
  }
  const flushed = encoder.flush()
  if (flushed.length > 0) mp3Chunks.push(flushed)
  const blobParts: BlobPart[] = mp3Chunks.map((chunk) => {
    const copy = new Uint8Array(chunk.length)
    copy.set(chunk)
    return copy.buffer
  })
  return new Blob(blobParts, { type: "audio/mpeg" })
}

function audioBufferToMonoSamples(buffer: AudioBuffer) {
  const length = buffer.length
  const channels = Math.max(1, buffer.numberOfChannels || 1)
  const mono = new Float32Array(length)
  for (let ch = 0; ch < channels; ch += 1) {
    const channelData = buffer.getChannelData(ch)
    for (let i = 0; i < length; i += 1) {
      mono[i] += channelData[i]
    }
  }
  if (channels > 1) {
    for (let i = 0; i < length; i += 1) {
      mono[i] /= channels
    }
  }
  return mono
}

export default function EpisodeInteractive({
  episodeId,
  audioTitle,
  showPhrasebook = true,
  showResetControls = true,
  renderStandaloneCard = true,
  storageKey,
  showTaskCheckbox = true,
}: {
  episodeId: string
  audioTitle?: string
  showPhrasebook?: boolean
  showResetControls?: boolean
  renderStandaloneCard?: boolean
  storageKey?: string
  showTaskCheckbox?: boolean
}) {
  const STORAGE_EP = useMemo(() => storageKey ?? `ep:${episodeId}`, [episodeId, storageKey])
  const STORAGE_PB = "pb:myphrases"
  const shouldClearEpisodeExtras = !storageKey && renderStandaloneCard
  const shouldBroadcastReset = renderStandaloneCard && !storageKey
  const shouldAutoReset = renderStandaloneCard
  const downloadBaseName = useMemo(() => {
    const raw = (audioTitle || episodeId || "recording").toString()
    return raw.replace(/\s+/g, "-").toLowerCase()
  }, [audioTitle, episodeId])

  // Per-episode state
  const [answer, setAnswer] = useState("")
  const [selfRate, setSelfRate] = useState<number>(0)
  const [recSkipped, setRecSkipped] = useState<boolean>(false)
  const [recordings, setRecordings] = useState<SavedRecording[]>([])

  // Recorder state
  const [micMsg, setMicMsg] = useState<string>("Status: checking microphone…")
  const [recording, setRecording] = useState<boolean>(false)
  const [elapsed, setElapsed] = useState<number>(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<number | null>(null)
  const autoResetGuardRef = useRef(false)
  const elapsedRef = useRef(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const pcmProcessorRef = useRef<ScriptProcessorNode | null>(null)
  const pcmSourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const pcmGainNodeRef = useRef<GainNode | null>(null)
  const pcmChunksRef = useRef<Float32Array[]>([])
  const pcmSampleRateRef = useRef(44100)

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
        if (Array.isArray(s.recordings)) {
          const normalized: SavedRecording[] = s.recordings
            .map((rec) => {
              if (!rec || typeof rec !== "object") return null
              const dataUrl = (rec as { dataUrl?: unknown }).dataUrl
              if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) return null
              const createdAtRaw = (rec as { createdAt?: unknown }).createdAt
              const durationRaw = (rec as { duration?: unknown }).duration
              const mimeTypeRaw = (rec as { mimeType?: unknown }).mimeType
              const idRaw = (rec as { id?: unknown }).id
              return {
                id: typeof idRaw === "string" && idRaw ? idRaw : `rec-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                createdAt: typeof createdAtRaw === "number" ? createdAtRaw : Date.now(),
                dataUrl,
                mimeType: typeof mimeTypeRaw === "string" ? mimeTypeRaw : "audio/webm",
                duration: typeof durationRaw === "number" ? durationRaw : 0,
              } as SavedRecording
            })
            .filter((rec): rec is SavedRecording => !!rec)
          if (normalized.length) setRecordings(normalized)
        } else if (s.recordingUrl && typeof s.recordingUrl === "string") {
          setRecordings([
            {
              id: `legacy-${Date.now()}`,
              createdAt: Date.now(),
              dataUrl: s.recordingUrl,
              mimeType: "audio/webm",
              duration: 0,
            },
          ])
        }
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
    const s = { answer, selfRate, recSkipped, recordings }
    try {
      localStorage.setItem(STORAGE_EP, JSON.stringify(s))
    } catch {}
  }, [STORAGE_EP, answer, selfRate, recSkipped, recordings])

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
  function makeRecordingId() {
    try {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID()
      }
    } catch {}
    return `rec-${Date.now()}-${Math.random().toString(16).slice(2)}`
  }
  const cleanupPcmTap = useCallback(() => {
    try {
      pcmProcessorRef.current?.disconnect()
    } catch {}
    try {
      pcmSourceRef.current?.disconnect()
    } catch {}
    try {
      pcmGainNodeRef.current?.disconnect()
    } catch {}
    try {
      const ctx = audioContextRef.current
      if (ctx) {
        ctx.close().catch?.(() => undefined)
      }
    } catch {}
    audioContextRef.current = null
    pcmProcessorRef.current = null
    pcmSourceRef.current = null
    pcmGainNodeRef.current = null
  }, [])
  const clearPcmTap = useCallback(() => {
    pcmChunksRef.current = []
    cleanupPcmTap()
  }, [cleanupPcmTap])
  function setupPcmTap(stream: MediaStream) {
    const AudioContextCtor = getAudioContextCtor()
    if (!AudioContextCtor) return false
    try {
      const audioCtx = new AudioContextCtor()
      if (
        typeof audioCtx.createMediaStreamSource !== "function" ||
        typeof audioCtx.createScriptProcessor !== "function" ||
        typeof audioCtx.createGain !== "function"
      ) {
        audioCtx.close().catch?.(() => undefined)
        return false
      }
      const source = audioCtx.createMediaStreamSource(stream)
      const processor = audioCtx.createScriptProcessor(4096, 1, 1)
      pcmChunksRef.current = []
      pcmSampleRateRef.current = audioCtx.sampleRate || 44100
      processor.onaudioprocess = (event) => {
        // Clone the buffer because browsers reuse the underlying memory
        pcmChunksRef.current.push(new Float32Array(event.inputBuffer.getChannelData(0)))
      }
      source.connect(processor)
      const gain = audioCtx.createGain()
      gain.gain.value = 0
      processor.connect(gain)
      gain.connect(audioCtx.destination)
      if (audioCtx.state === "suspended") {
        audioCtx.resume().catch(() => undefined)
      }
      audioContextRef.current = audioCtx
      pcmProcessorRef.current = processor
      pcmSourceRef.current = source
      pcmGainNodeRef.current = gain
      return true
    } catch (err) {
      console.warn("Failed to initialize PCM tap:", err)
      clearPcmTap()
      return false
    }
  }
  function harvestPcmMp3() {
    const chunks = pcmChunksRef.current
    pcmChunksRef.current = []
    const sampleRate = pcmSampleRateRef.current || 44100
    cleanupPcmTap()
    if (!chunks.length) return null
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
    const merged = new Float32Array(totalLength)
    let offset = 0
    chunks.forEach((chunk) => {
      merged.set(chunk, offset)
      offset += chunk.length
    })
    try {
      return encodeFloat32SamplesToMp3(merged, sampleRate)
    } catch (err) {
      console.warn("PCM-to-MP3 encoding failed:", err)
      return null
    }
  }
  const convertBlobToMp3 = useCallback(async (blob: Blob) => {
    if (blob.type === "audio/mpeg") {
      return {
        dataUrl: await blobToDataUrl(blob),
        mimeType: "audio/mpeg",
      }
    }
    if (typeof window === "undefined") {
      return {
        dataUrl: await blobToDataUrl(blob),
        mimeType: blob.type || "audio/webm",
      }
    }
    const AudioContextCtor = getAudioContextCtor()
    if (!AudioContextCtor) {
      return {
        dataUrl: await blobToDataUrl(blob),
        mimeType: blob.type || "audio/webm",
      }
    }
    try {
      const arrayBuffer = await blob.arrayBuffer()
      const audioCtx = new AudioContextCtor()
      const decoded = await new Promise<AudioBuffer>((resolve, reject) => {
        audioCtx.decodeAudioData(arrayBuffer.slice(0), resolve, reject)
      })
      const samples = audioBufferToMonoSamples(decoded)
      const mp3Blob = encodeFloat32SamplesToMp3(samples, decoded.sampleRate || 44100)
      try {
        await audioCtx.close()
      } catch {}
      return {
        dataUrl: await blobToDataUrl(mp3Blob),
        mimeType: "audio/mpeg",
      }
    } catch (err) {
      console.warn("MP3 conversion failed:", err)
      return {
        dataUrl: await blobToDataUrl(blob),
        mimeType: blob.type || "audio/webm",
      }
    }
  }, [])
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
    if (MediaRecorderCtor.isTypeSupported("audio/mpeg")) return { mimeType: "audio/mpeg" }
    if (MediaRecorderCtor.isTypeSupported("audio/webm;codecs=opus")) return { mimeType: "audio/webm;codecs=opus" }
    if (MediaRecorderCtor.isTypeSupported("audio/webm")) return { mimeType: "audio/webm" }
    if (MediaRecorderCtor.isTypeSupported("audio/ogg;codecs=opus")) return { mimeType: "audio/ogg;codecs=opus" }
    if (MediaRecorderCtor.isTypeSupported("audio/mp4")) return { mimeType: "audio/mp4" }
    return undefined
  }
  function mimeToExtension(type: string) {
    if (!type) return "webm"
    if (type.includes("mpeg")) return "mp3"
    if (type.includes("ogg")) return "ogg"
    if (type.includes("mp4")) return "m4a"
    if (type.includes("webm")) return "webm"
    return "webm"
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
      clearPcmTap()
      setupPcmTap(stream)
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
        const type = mr.mimeType || opts?.mimeType || "audio/webm"
        const blob = new Blob(chunksRef.current, { type })
        const pcmBlob = harvestPcmMp3()
        stopActiveStream()
        const duration = Math.max(0, elapsedRef.current)
        const conversionPromise = pcmBlob
          ? blobToDataUrl(pcmBlob).then((dataUrl) => ({ dataUrl, mimeType: "audio/mpeg" as const }))
          : convertBlobToMp3(blob)
        conversionPromise
          .then(({ dataUrl, mimeType }) => {
            setRecordings((prev) => [
              { id: makeRecordingId(), createdAt: Date.now(), dataUrl, mimeType, duration },
              ...prev,
            ])
            setMicMsg(mimeType === "audio/mpeg" ? "Recording saved locally as MP3." : "Recording saved locally.")
          })
          .catch(() => {
            setMicMsg("Recording saved, but couldn’t prepare playback.")
          })
          .finally(() => {
            elapsedRef.current = 0
          })
      }
      mr.start()
      setRecording(true)
      setElapsed(0)
      elapsedRef.current = 0
      if (timerRef.current) window.clearInterval(timerRef.current)
      const start = Date.now()
      timerRef.current = window.setInterval(() => {
        const seconds = (Date.now() - start) / 1000
        setElapsed(seconds)
        elapsedRef.current = seconds
      }, 200)
    } catch (err) {
      setMicMsg(formatGetUserMediaError(err))
    }
  }

  const stopRec = useCallback(() => {
    try {
      const recorder = mediaRecorderRef.current
      if (recorder && recorder.state !== "inactive") {
        recorder.stop()
      } else {
        clearPcmTap()
      }
    } finally {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
      setRecording(false)
      setElapsed(0)
    }
  }, [clearPcmTap])

  function skipRecording() {
    setRecSkipped(true)
    stopActiveStream()
    clearPcmTap()
    setRecording(false)
    elapsedRef.current = 0
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
      clearPcmTap()
      chunksRef.current = []
      setMicMsg("Session reset. Enable the microphone to start again.")
      setRecSkipped(false)
      setAnswer("")
      setSelfRate(0)
      setRecordings([])
      setElapsed(0)
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
      setAutoResetNotice(null)
      try {
        localStorage.removeItem(STORAGE_EP)
        if (shouldClearEpisodeExtras && episodeId) {
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
      if (shouldBroadcastReset && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("episode:reset", {
            detail: { episodeId, reason },
          }),
        )
      }
    },
    [STORAGE_EP, clearPcmTap, episodeId, shouldBroadcastReset, shouldClearEpisodeExtras, stopRec],
  )

  useEffect(() => {
    if (!shouldAutoReset) return
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
  }, [resetEpisodeState, shouldAutoReset])

  useEffect(() => {
    if (!shouldAutoReset) return
    return () => {
      autoResetGuardRef.current = true
      resetEpisodeState("auto")
    }
  }, [resetEpisodeState, shouldAutoReset])

  useEffect(() => {
    if (typeof window === "undefined") return
    let cancelled = false
    async function upgradeLegacyRecordings() {
      const needsUpgrade = recordings.filter((rec) => rec.mimeType !== "audio/mpeg" && rec.dataUrl?.startsWith("data:"))
      if (!needsUpgrade.length) return
      try {
        const upgrades = await Promise.all(
          needsUpgrade.map(async (rec) => {
            try {
              const converted = await convertBlobToMp3(dataUrlToBlob(rec.dataUrl))
              if (converted.mimeType !== "audio/mpeg") return null
              return { id: rec.id, ...converted }
            } catch (err) {
              console.warn("Failed to upgrade legacy recording to MP3:", err)
              return null
            }
          }),
        )
        if (cancelled) return
        const upgradeMap = new Map(
          upgrades.filter((u): u is { id: string; dataUrl: string; mimeType: string } => !!u).map((u) => [u.id, u]),
        )
        if (!upgradeMap.size) return
        setRecordings((prev) =>
          prev.map((rec) => {
            const upgrade = upgradeMap.get(rec.id)
            return upgrade ? { ...rec, dataUrl: upgrade.dataUrl, mimeType: upgrade.mimeType } : rec
          }),
        )
      } catch (err) {
        console.warn("Legacy recording upgrade failed:", err)
      }
    }
    upgradeLegacyRecordings()
    return () => {
      cancelled = true
    }
  }, [convertBlobToMp3, recordings])

  useEffect(() => {
    return () => {
      try {
        const recorder = mediaRecorderRef.current
        if (recorder && recorder.state !== "inactive") {
          recorder.stop()
        }
      } catch {}
      stopActiveStream()
    }
  }, [])

  useEffect(() => {
    if (!autoResetNotice) return
    if (answer || recordings.length > 0 || selfRate > 0) {
      setAutoResetNotice(null)
    }
  }, [autoResetNotice, answer, recordings, selfRate])

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
    
    // Initialize y position based on whether there's a rating or not
    let y = brandY + 110
    
    // Add self-rating if available
    if (selfRate > 0) {
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(12)
      pdf.setTextColor(0, 0, 0) // Black text
      pdf.text("Self-Rating:", margin, brandY + 100)
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(14)
      addStarsToPdf(pdf, margin + 80, brandY + 100, 5, 14, selfRate)
      // Update y position to add more space after the rating
      y = brandY + 130
    }
    
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

  const recorderContent = (
    <>
      {autoResetNotice && (
        <div className="mb-3 rounded-lg border border-brand-300 bg-brand-50 px-3 py-2 text-sm text-brand-900">
          {autoResetNotice}
        </div>
      )}
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
              className={`inline-flex items-center gap-1 btn ${recording ? "btn-danger bg-red-600 hover:bg-red-700 border-red-700" : "btn-light-green"}`}
              title={recording ? "Stop recording" : "Start recording"}
            >
              <span aria-hidden>{recording ? "⏹" : "⏺"}</span>
              <span>{recording ? "Stop" : "Record"}</span>
            </button>
            <span className="text-sm text-gray-600 tabular-nums">{fmtTime(elapsed)}</span>
          </div>
          <p className="mt-2 text-sm">{micMsg}</p>
          {recordings.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-sm font-semibold text-brand-900">Your recordings ({recordings.length})</p>
              <div className="space-y-3">
                {recordings.map((rec, index) => {
                  const takeNumber = recordings.length - index
                  return (
                    <div key={rec.id} className="rounded-lg border p-3 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                        <span>
                          Take {takeNumber} • {fmtTime(rec.duration || 0)}
                        </span>
                        <div className="flex gap-2">
                          <a
                            className="btn btn-muted px-3 py-1 text-sm"
                            download={`${downloadBaseName}-take-${takeNumber}.${mimeToExtension(rec.mimeType)}`}
                            href={rec.dataUrl}
                          >
                            Download
                          </a>
                          <button
                            type="button"
                            className="btn btn-ghost px-3 py-1 text-sm"
                            onClick={() => setRecordings((prev) => prev.filter((r) => r.id !== rec.id))}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <audio controls className="w-full" src={rec.dataUrl} />
                    </div>
                  )
                })}
              </div>
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
      {showTaskCheckbox && <EpisodeTaskCheckbox episodeId={episodeId} task="recorded" />}
    </>
  )

  if (!renderStandaloneCard) {
    return <div>{recorderContent}</div>
  }

  return (
    <div className="mt-8 space-y-8">
      <div>
        <section id="record" className="card scroll-mt-20">
          <div className="card-body">{recorderContent}</div>
        </section>
      </div>

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
