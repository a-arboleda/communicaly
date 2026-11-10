"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { practiceDrafts } from "@/utils/practiceDrafts"
import { createPracticePdf } from "@/utils/practicePdf"
import EpisodeInteractive from "@/components/EpisodeInteractive"

type PracticeQuizItem = {
  prompt: string
  starter?: string
  support?: string
  followUp?: string
  expected?: string
  function?: string
}

type PracticeMode = "audio" | "text"

const MAX_PRACTICE_QUESTIONS = 1

function isBrowser() {
  return typeof window !== "undefined"
}

export default function EpisodePracticeQuestions({
  episodeId,
  slug,
  additional,
  episodeTitle,
  practiceQuiz,
  conversational = false,
  storyLayout = false,
}: {
  episodeId: string
  slug: string
  additional: { skill: string; prompt: string; slot: number; followUp?: string }[]
  episodeTitle?: string
  storyLayout?: boolean
  conversational?: boolean
  practiceQuiz?: PracticeQuizItem[]
}) {
  const questions = useMemo(() => {
    if (!Array.isArray(practiceQuiz)) return []
    return practiceQuiz.filter((item) => !!item?.prompt?.trim()).slice(0, MAX_PRACTICE_QUESTIONS)
  }, [practiceQuiz])
  const [selected, setSelected] = useState(0)
  const [visited, setVisited] = useState<number[]>([])
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    // Discard drafts saved by versions that kept practice in local storage.
    const prefixes = [`ep:${slug}:practice:`, `ep:${episodeId}:practice:`]
    try {
      for (const key of Object.keys(window.localStorage)) {
        if (prefixes.some(prefix => key.startsWith(prefix))) window.localStorage.removeItem(key)
      }
    } catch {}
  }, [episodeId, slug])

  const collectTextResponses = useCallback(() => {
    if (!isBrowser()) return []
    const entries = [
      ...questions.map(question => ({ question, base: `ep:${episodeId}:practice:1` })),
      ...additional.map(question => ({ question, base: `ep:${slug}:practice:${question.slot}` })),
    ]
    return entries
      .map(({ question, base }, index) => {
        const text = practiceDrafts.get(`${base}:text`)?.trim()
        // Also collect audio rating if present (from the EpisodeInteractive storage key)
        let rating = 0
        try {
          const raw = practiceDrafts.get(`${base}:audio`)
          if (raw) {
            const parsed = JSON.parse(raw)
            if (typeof parsed?.selfRate === "number") rating = Math.min(5, Math.max(0, parsed.selfRate))
          }
        } catch {}
        // If there is no typed text and no rating, skip
        if (!text && !rating) return null
        const responseText = text || "(audio response)"
        return { question, response: responseText, number: index + 1, rating }
      })
      .filter((entry): entry is { question: PracticeQuizItem; response: string; number: number; rating: number } => !!entry)
  }, [episodeId, questions, slug, additional])

  const handleDownloadPdf = useCallback(() => {
    if (!isBrowser()) return
    const entries = collectTextResponses()
    if (entries.length === 0) {
      setDownloadNotice("Write a response or transcribe a recording before downloading your PDF.")
      return
    }
    setExporting(true)
    setDownloadNotice(null)
    try {
      const pdf = createPracticePdf(episodeTitle || "Your practice responses", entries, !conversational && !storyLayout)
      const safeName = (episodeTitle || episodeId || "episode")
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      pdf.save(`practice-prompts-${safeName || episodeId}.pdf`)
      setDownloadNotice("Downloaded your text responses.")
    } catch (error) {
      console.error("Failed to export practice responses", error)
      setDownloadNotice("Could not create the PDF. Try again.")
    } finally {
      setExporting(false)
    }
  }, [collectTextResponses, episodeId, episodeTitle, conversational, storyLayout])

  if (questions.length === 0) return null

  return (
    <section id="practice-questions" className={storyLayout ? "scroll-mt-28 border-t border-stone-200 pt-6" : "card scroll-mt-20"}>
      <div className={storyLayout ? "space-y-4" : "card-body space-y-6"}>
        <p className="text-xs font-medium uppercase tracking-widest text-stone-600">Your turn to share</p>
        <h2 className="text-2xl font-semibold tracking-tight">{questions[0].prompt}</h2>
        {questions[0].starter && (
          <details className="text-sm text-stone-600">
            <summary className="w-fit cursor-pointer underline underline-offset-4">Need a little help getting started?</summary>
            <p className="mt-2">{questions[0].starter}</p>
          </details>
        )}
        <p className="text-sm text-stone-600">Write or record your answer. When you stop recording, your words appear here automatically. The first transcription downloads an English speech model.</p>
        <PracticeQuestionCard key={episodeId} episodeId={episodeId} episodeTitle={episodeTitle} index={0} conversational={conversational || storyLayout} />
        {additional.length > 0 && (
          <details className="border-t border-slate-200 pt-4" onToggle={event => {
            if (event.currentTarget.open) setVisited(previous => previous.length ? previous : [0])
          }}>
            <summary className="w-fit cursor-pointer py-2 font-semibold text-[#2852d6]">Explore more questions</summary>
            <div role="group" aria-label="Choose a speaking skill" className="my-3 flex flex-wrap gap-2">
              {additional.map((question, i) => (
                <button key={question.skill} type="button" aria-pressed={selected === i}
                  onClick={() => {
                    setSelected(i)
                    setVisited(previous => previous.includes(i) ? previous : [...previous, i])
                  }}
                  className="rounded-full border border-slate-300 px-3 py-2 text-sm aria-pressed:border-[#2852d6] aria-pressed:bg-[#2852d6] aria-pressed:text-white">
                  {question.skill}
                </button>
              ))}
            </div>
            {visited.map(i => {
              const question = additional[i]
              return (
                <div key={question.skill} hidden={selected !== i} className="rounded-xl bg-[#eff3ff] p-4">
                  <p className="font-medium text-[#162852]">{question.prompt}</p>
                  {question.followUp && <p className="mt-1 text-sm">{question.followUp}</p>}
                  <PracticeQuestionCard episodeId={slug} index={question.slot - 1} episodeTitle={episodeTitle} conversational />
                </div>
              )
            })}
          </details>
        )}
        <div className="flex flex-col gap-2 border-t border-brand-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            {downloadNotice ?? (conversational ? "Your PDF includes your written responses and any transcriptions added to them." : "You can edit your response before downloading it.")}
          </p>
          <button
            type="button"
            className="btn btn-light-green w-full sm:w-auto"
            onClick={handleDownloadPdf}
            disabled={exporting}
          >
            {exporting ? "Preparing..." : "Download PDF"}
          </button>
        </div>
        {conversational && <p className="text-sm text-gray-600">Try saying your answer again. Keep the idea, but let the words change.</p>}
      </div>
    </section>
  )
}

function PracticeQuestionCard({
  conversational,
  index,
  episodeId,
  episodeTitle,
}: {
  conversational: boolean
  index: number
  episodeId: string
  episodeTitle?: string
}) {
  const [mode, setMode] = useState<PracticeMode>("text")
  const [text, setText] = useState("")
  const [loaded, setLoaded] = useState(false)

  const storageBase = useMemo(() => `ep:${episodeId}:practice:${index + 1}`, [episodeId, index])
  const modeKey = `${storageBase}:mode`
  const textKey = `${storageBase}:text`

  useEffect(() => {
    if (!isBrowser()) return
    try {
      const storedMode = practiceDrafts.get(modeKey)
      if (storedMode === "audio" || storedMode === "text") {
        setMode(storedMode)
      }
      const storedText = practiceDrafts.get(textKey)
      if (typeof storedText === "string") {
        setText(storedText)
      }
    } catch {}
    setLoaded(true)
  }, [modeKey, textKey])

  useEffect(() => {
    if (!loaded || !isBrowser()) return
    try {
      practiceDrafts.set(modeKey, mode)
    } catch {}
  }, [loaded, mode, modeKey])

  useEffect(() => {
    if (!loaded || !isBrowser()) return
    try {
      if (text.trim()) {
        practiceDrafts.set(textKey, text)
      } else {
        practiceDrafts.delete(textKey)
      }
    } catch {}
  }, [loaded, text, textKey])

  const questionNumber = index + 1

  return (
    <div className="mt-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="inline-flex gap-1" role="group" aria-label={`Response mode for prompt ${questionNumber}`}>
          {(["audio", "text"] as PracticeMode[]).map((key) => {
            const isAudio = key === "audio"
            const label = isAudio ? "Audio" : "Text"
            const active = mode === key
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setMode(key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out flex items-center gap-2 ${
                  active 
                    ? 'text-brand-700' 
                    : 'text-brand-400 hover:text-brand-600'
                }`}
              >
                <span className={`transition-colors duration-300 ease-in-out ${
                  active ? 'text-brand-600' : 'text-brand-300'
                }`}>
                  {isAudio ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  )}
                </span>
                <span className="whitespace-nowrap">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4">
        {mode === "audio" && (
          <div className="space-y-3 mb-4">

            <EpisodeInteractive
              episodeId={episodeId}
              audioTitle={episodeTitle}
              showReflectionMetrics={!conversational}
              showPhrasebook={false}
              showResetControls={false}
              renderStandaloneCard={false}
              storageKey={`${storageBase}:audio`}
              showTaskCheckbox={false}
              onDeleteTake={() => setText("")}
              onTranscribed={setText}
            />
          </div>
        )}
        {(
          <div className="space-y-2">
            <label htmlFor={`practice-text-${episodeId}-${questionNumber}`} className="text-sm text-gray-600">
              {mode === "audio" ? "Your response" : "Type your response"}
            </label>
            <textarea
              id={`practice-text-${episodeId}-${questionNumber}`}
              rows={3}
              className="w-full rounded-2xl border border-brand-100 bg-white p-3 text-sm focus:border-sky-400 focus:outline-none"
              placeholder="Write what you’d say here..."
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
            <p className="text-xs text-gray-500">{mode === "audio" ? "Your transcript appears after you stop recording." : "Refreshing the page clears your practice."}</p>
          </div>

        )}
      </div>
    </div>
  )
}
