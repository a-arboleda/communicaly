"use client"
import { useRef, useState } from "react"

export default function RecordYourself() {
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [recording, setRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      chunksRef.current = []
      mr.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data)
      }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setAudioURL(URL.createObjectURL(blob))
      }
      mr.start()
      setRecording(true)
    } catch {
      setPermissionDenied(true)
    }
  }

  function stop() {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  if (permissionDenied) {
    return (
      <div className="rounded-lg border p-4 bg-gray-100">
        <p className="text-sm">
          Recording is optional. You can continue with shadowing and self-rating
          even without microphone access.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {!recording ? (
          <button onClick={start} className="px-3 py-2 rounded-xl border">
            Start recording
          </button>
        ) : (
          <button onClick={stop} className="px-3 py-2 rounded-xl border">
            Stop
          </button>
        )}
      </div>
      {audioURL && <audio className="w-full" controls src={audioURL} />}
      <div>
        <label className="text-sm">Self-rating (1–5): </label>
        <input
          type="number"
          min={1}
          max={5}
          defaultValue={3}
          className="border rounded px-2 py-1 w-20 ml-2"
        />
      </div>
    </div>
  )
}
