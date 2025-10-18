'use client'

import { useState } from "react"
import EpisodeTaskCheckbox from "@/components/EpisodeTaskCheckbox"

type TutorStudentQuizItem = {
  prompt: string
  expected?: string
  function?: string
}

type EpisodeHighlightsProps = {
  slug: string
  story?: string[]
  keyDetails?: string[]
  tryThis?: string[]
  practiceQuiz?: TutorStudentQuizItem[]
}

export default function EpisodeHighlights({
  slug,
  practiceQuiz,
}: EpisodeHighlightsProps) {
  const quizItems = Array.isArray(practiceQuiz)
    ? practiceQuiz.filter((item) => item?.prompt && (item?.function || item?.expected))
    : []
  const hasQuiz = quizItems.length > 0

  const showHighlights = hasQuiz

  if (!showHighlights) return null

  return (
    <>
      {hasQuiz && (
        <section id="practice-quiz" className="not-prose card scroll-mt-20">
          <div className="card-body space-y-4">
            <h2 className="text-xl font-semibold text-blue-600">Communication Function Flipcards</h2>
            <p className="text-sm text-gray-600">
              Tap a card to reveal the prompt. Start with the function goal, then flip to guide the conversation or practice response.
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {quizItems.map((item, idx) => (
                <QuizCard key={`quiz-${idx}`} item={item} index={idx} />
              ))}
            </div>
            <EpisodeTaskCheckbox episodeId={slug} task="flipcards" />
          </div>
        </section>
      )}
    </>
  )
}

function QuizCard({ item, index }: { item: TutorStudentQuizItem; index: number }) {
  const [showAnswer, setShowAnswer] = useState(false)
  const functionLabel = (item.function ?? "").trim() || "Communication function"
  const promptText = item.prompt.replace(/^\s*Tutor prompt:\s*/i, "").trim()

  return (
    <button
      type="button"
      onClick={() => setShowAnswer((prev) => !prev)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && showAnswer) {
          event.stopPropagation()
          event.preventDefault()
          setShowAnswer(false)
        }
      }}
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-3xl border text-left shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 ${
        showAnswer ? "border-brand-300" : "border-gray-200"
      }`}
      aria-expanded={showAnswer}
      aria-controls={`quiz-answer-${index}`}
    >
      <span className="sr-only">Toggle prompt card {index + 1}</span>
      <div className="absolute inset-0" style={{ perspective: "1000px" }}>
        <div
          className="h-full w-full transform-gpu transition-transform duration-500 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: showAnswer ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-4 rounded-3xl border border-transparent bg-gradient-to-br from-white via-sky-50 to-emerald-50 p-6 text-gray-900"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="sr-only">Card {index + 1} function</span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-sm font-semibold text-brand-900 shadow-sm">
              {index + 1}
            </span>
            <p className="text-center text-xl font-semibold leading-tight text-brand-900">{functionLabel}</p>
            <span className="sr-only">Flip to read the prompt</span>
          </div>

          <div
            className="absolute inset-0 flex h-full w-full items-center justify-center rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6 text-gray-900 shadow-card"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            id={`quiz-answer-${index}`}
            aria-hidden={!showAnswer}
          >
            <p className="text-center text-sm leading-relaxed text-gray-700">{promptText}</p>
          </div>
        </div>
      </div>
    </button>
  )
}
