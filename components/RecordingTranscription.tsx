"use client"

import { useEffect, useRef, useState } from "react"

export default function RecordingTranscription({ dataUrl, transcript, onTranscribed }: {
  dataUrl: string
  transcript?: string
  onTranscribed: (text: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState("")
  const worker = useRef<Worker | null>(null)
  const run = useRef(0)
  useEffect(() => () => { run.current++; worker.current?.terminate() }, [])

  function cancel() {
    run.current++
    worker.current?.terminate()
    worker.current = null
    setBusy(false)
    setStatus("Transcription cancelled. Your recording is still saved.")
  }

  async function transcribe() {
    const currentRun = ++run.current
    setBusy(true)
    setStatus("Preparing your recording…")
    try {
      const bytes = await (await fetch(dataUrl)).arrayBuffer()
      const decoder = new AudioContext()
      let decoded: AudioBuffer
      try { decoded = await decoder.decodeAudioData(bytes) } finally { await decoder.close() }
      if (currentRun !== run.current) return
      if (decoded.duration > 600) throw new Error("Please use a recording shorter than 10 minutes.")
      const renderer = new OfflineAudioContext(1, Math.ceil(decoded.duration * 16000), 16000)
      const source = renderer.createBufferSource()
      source.buffer = decoded
      source.connect(renderer.destination)
      source.start()
      const audio = (await renderer.startRendering()).getChannelData(0)
      if (currentRun !== run.current) return
      const rms = Math.sqrt(audio.reduce((total, sample) => total + sample * sample, 0) / audio.length)
      if (rms < 0.0001) throw new Error("This recording seems silent. Please record your answer again.")
      setStatus("Loading the speech model. The first download may take a few minutes…")
      const instance = new Worker(new URL("../utils/transcription.worker.ts", import.meta.url), { type: "module" })
      worker.current = instance
      const finish = () => { instance.terminate(); worker.current = null; setBusy(false) }
      instance.onmessage = (event: MessageEvent<{ type: string; message?: string; text?: string }>) => {
        if (currentRun !== run.current) return
        const { type, message, text } = event.data
        if (type === "status") { setStatus(message || "Transcribing…"); return }
        if (type === "result" && text?.trim()) {
          onTranscribed(text.trim())
          setStatus("Text added below.")
        } else setStatus(message || "No words were detected. Try another recording.")
        finish()
      }
      instance.onerror = () => {
        if (currentRun !== run.current) return
        setStatus("Transcription could not start in this browser. Try again in an updated browser, or type your response below.")
        finish()
      }
      instance.postMessage({ audio }, [audio.buffer])
    } catch (error) {
      if (currentRun !== run.current) return
      setStatus(error instanceof Error ? error.message : "Could not read this recording. You can type your response below.")
      setBusy(false)
    }
  }

  return <div className="space-y-1">
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {transcript ? <span className="text-xs font-medium text-sky-800">✓ Transcribed</span> :
        <button type="button" className="recording-action font-medium" disabled={busy} onClick={transcribe}>
          {busy ? "Transcribing…" : "Transcribe to text"}
        </button>}
      {transcript && <button type="button" className="recording-action" onClick={() => onTranscribed(transcript)}>Restore text</button>}
      {busy && <button type="button" className="recording-action" onClick={cancel}>Cancel</button>}
      <details className="text-xs text-gray-500">
        <summary className="cursor-pointer">About transcription</summary>
        <p className="mt-1 max-w-md">English transcription stays on your device. The first use downloads a speech model; your audio is not uploaded.</p>
      </details>
    </div>
    <p role="status" aria-live="polite" className="text-xs text-stone-600">{status === "Text added below." && transcript ? "" : status}</p>
  </div>
}
