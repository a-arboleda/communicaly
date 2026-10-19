import { env, pipeline, type AutomaticSpeechRecognitionPipeline } from "@huggingface/transformers"

env.allowLocalModels = false
// One WASM thread works without cross-origin isolation on normal deployments.
env.backends.onnx.wasm.numThreads = 1
let transcriber: Promise<AutomaticSpeechRecognitionPipeline> | undefined

self.onmessage = async (event: MessageEvent<{ audio: Float32Array }>) => {
  try {
    transcriber ??= pipeline("automatic-speech-recognition", "Xenova/whisper-tiny.en", {
      device: "wasm",
      dtype: "q8",
      progress_callback: (progress) => {
        if (progress.status === "progress") self.postMessage({ type: "status", message: "Downloading the speech model…" })
      },
    })
    const model = await transcriber
    self.postMessage({ type: "status", message: "Transcribing on your device…" })
    const result = await model(event.data.audio, { chunk_length_s: 30, stride_length_s: 5, return_timestamps: false })
    const text = (Array.isArray(result) ? result.map((part) => part.text).join(" ") : result.text).trim()
    self.postMessage({ type: "result", text })
  } catch {
    transcriber = undefined
    self.postMessage({ type: "error", message: "Could not transcribe this recording. Check your connection for the model download and try again." })
  }
}
