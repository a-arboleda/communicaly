"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import jsPDF from "jspdf"
import addStarsToPdf from "@/utils/pdfStars"
import EpisodeInteractive from "@/components/EpisodeInteractive"

type PracticeQuizItem = {
  prompt: string
  expected?: string
  function?: string
}

type PracticeMode = "audio" | "text"

const MAX_PRACTICE_QUESTIONS = 6

function isBrowser() {
  return typeof window !== "undefined"
}

export default function EpisodePracticeQuestions({
  episodeId,
  episodeTitle,
  practiceQuiz,
}: {
  episodeId: string
  episodeTitle?: string
  practiceQuiz?: PracticeQuizItem[]
}) {
  const questions = useMemo(() => {
    if (!Array.isArray(practiceQuiz)) return []
    return practiceQuiz.filter((item) => !!item?.prompt?.trim()).slice(0, MAX_PRACTICE_QUESTIONS)
  }, [practiceQuiz])
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const collectTextResponses = useCallback(() => {
    if (!isBrowser()) return []
    return questions
      .map((question, index) => {
        const text = window.localStorage.getItem(`ep:${episodeId}:practice:${index + 1}:text`)?.trim()
        // Also collect audio rating if present (from the EpisodeInteractive storage key)
        let rating = 0
        try {
          const raw = window.localStorage.getItem(`ep:${episodeId}:practice:${index + 1}:audio`)
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
  }, [episodeId, questions])

  const handleDownloadPdf = useCallback(() => {
    if (!isBrowser()) return
    const entries = collectTextResponses()
    if (entries.length === 0) {
      setDownloadNotice("Add at least one text or audio response to export.")
      return
    }
    setExporting(true)
    setDownloadNotice(null)
    try {
      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" })
      let pageWidth = pdf.internal.pageSize.getWidth()
      let pageHeight = pdf.internal.pageSize.getHeight()
      const marginX = 56
      const marginY = 64
      const contentWidth = pageWidth - marginX * 2
      const title = episodeTitle ? `Practice responses — ${episodeTitle}` : "Practice responses"

      const safeName = (episodeTitle || episodeId || "episode")
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      let y = marginY

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(16)
      pdf.text(title, marginX, y)
      y += 26

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(11)
      pdf.setTextColor(75, 85, 99)
      pdf.text("Saved text responses from Practice Prompts.", marginX, y)
      pdf.setTextColor(17, 24, 39)
      y += 22

      const ensureSpace = (needed: number) => {
        if (y + needed <= pageHeight - marginY) return
        pdf.addPage()
        pageWidth = pdf.internal.pageSize.getWidth()
        pageHeight = pdf.internal.pageSize.getHeight()
        y = marginY
      }

      entries.forEach(({ question, response, number, rating }) => {
        const questionLines = pdf.splitTextToSize(question.prompt, contentWidth)
        const responseLines = pdf.splitTextToSize(response, contentWidth)
        const header = `Prompt ${number}${question.function ? ` • ${question.function}` : ""}`
        const ratingHeight = rating && rating > 0 ? 18 : 0
        const blockHeight = 18 + questionLines.length * 14 + 20 + responseLines.length * 14 + ratingHeight

        ensureSpace(blockHeight + 12)

        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(12)
        pdf.text(header, marginX, y)
        y += 16

        pdf.setFont("helvetica", "italic")
        pdf.setFontSize(11)
        questionLines.forEach((line) => {
          pdf.text(line, marginX, y)
          y += 14
        })

        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(11)
        pdf.text("Your response:", marginX, y)
        y += 14
        responseLines.forEach((line) => {
          pdf.text(line, marginX, y)
          y += 14
        })
        if (rating && rating > 0) {
          y += 8
          pdf.setFont("helvetica", "normal")
          pdf.setFontSize(12)
          pdf.setTextColor(75, 85, 99)
          pdf.text("Self Rating:", marginX, y + 4)
          addStarsToPdf(pdf, marginX + 80, y, 5, 12, rating)
          y += 20
          pdf.setTextColor(17, 24, 39)
        }
        y += 12
      })

      pdf.save(`practice-prompts-${safeName || episodeId}.pdf`)
      setDownloadNotice("Downloaded your text responses.")
    } catch (error) {
      console.error("Failed to export practice responses", error)
      setDownloadNotice("Could not create the PDF. Try again.")
    } finally {
      setExporting(false)
    }
  }, [collectTextResponses, episodeId, episodeTitle])

  if (questions.length === 0) return null

  return (
    <section id="practice-questions" className="card scroll-mt-20">
      <div className="card-body space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-brand-700">Practice prompts</h2>
          <p className="text-sm text-gray-600">
            Pick text or audio for each prompt. Stay in one mode or mix them—whatever keeps you practicing out loud and on paper.
          </p>
        </div>
        <div className="space-y-6">
          {questions.map((question, index) => (
            <PracticeQuestionCard
              key={`practice-${index}-${question.prompt.slice(0, 12)}`}
              question={question}
              index={index}
              episodeId={episodeId}
              episodeTitle={episodeTitle}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2 border-t border-brand-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            {downloadNotice ?? "Exports text responses; audio responses (with rating) are included if present."}
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
      </div>
    </section>
  )
}

function PracticeQuestionCard({
  question,
  index,
  episodeId,
  episodeTitle,
}: {
  question: PracticeQuizItem
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
      const storedMode = window.localStorage.getItem(modeKey)
      if (storedMode === "audio" || storedMode === "text") {
        setMode(storedMode)
      }
      const storedText = window.localStorage.getItem(textKey)
      if (typeof storedText === "string") {
        setText(storedText)
      }
    } catch {}
    setLoaded(true)
  }, [modeKey, textKey])

  useEffect(() => {
    if (!loaded || !isBrowser()) return
    try {
      window.localStorage.setItem(modeKey, mode)
    } catch {}
  }, [loaded, mode, modeKey])

  useEffect(() => {
    if (!loaded || !isBrowser()) return
    try {
      if (text.trim()) {
        window.localStorage.setItem(textKey, text)
      } else {
        window.localStorage.removeItem(textKey)
      }
    } catch {}
  }, [loaded, text, textKey])

  const questionNumber = index + 1

  return (
    <div className="rounded-3xl border border-brand-100 bg-white/70 p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          {question.function && <p className="text-sm font-medium text-brand-900">{question.function}</p>}
          <p className="text-base text-stone-900">{question.prompt}</p>
          {question.expected && <p className="text-sm italic text-gray-500">Hint: {question.expected}</p>}
        </div>
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
        {mode === "text" ? (
          <div className="space-y-2">
            <label htmlFor={`practice-text-${episodeId}-${questionNumber}`} className="text-sm text-gray-600">
              Type your response
            </label>
            <textarea
              id={`practice-text-${episodeId}-${questionNumber}`}
              className="w-full rounded-2xl border border-brand-100 bg-white p-3 text-base shadow-inner focus:border-brand-500 focus:outline-none"
              placeholder="Write what you’d say here..."
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
            <p className="text-xs text-gray-500">Saved locally on this device.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-brand-900">Record how you’d answer this prompt.</p>
            <EpisodeInteractive
              episodeId={episodeId}
              audioTitle={episodeTitle}
              showPhrasebook={false}
              showResetControls={false}
              renderStandaloneCard={false}
              storageKey={`${storageBase}:audio`}
              showTaskCheckbox={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}
