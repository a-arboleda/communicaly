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

const MAX_FLIPCARD_COUNT = 8

export default function EpisodeHighlights({
  slug,
  practiceQuiz,
}: EpisodeHighlightsProps) {
  const quizItems = Array.isArray(practiceQuiz)
    ? practiceQuiz
        .filter((item) => item?.prompt && (item?.function || item?.expected))
        .slice(0, MAX_FLIPCARD_COUNT)
    : []
  const hasQuiz = quizItems.length > 0

  const showHighlights = hasQuiz

  if (!showHighlights) return null

  return (
    <>
      {hasQuiz && (
        <section id="practice-quiz" className="not-prose card scroll-mt-20">
          <div className="card-body space-y-4">
            <h2 className="text-xl font-semibold text-brand-700">Communication Function Flipcards</h2>
            <p className="text-sm text-gray-600">
              Tap a card to reveal the prompt. Start with the function goal, then flip to guide the conversation or practice response.
            </p>
            <p className="text-xs text-gray-500">
              Need a nudge? Toss a die and respond to whichever card matches the number—no second guessing, just jump in.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
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
      className={`group relative aspect-[2/3] w-full overflow-hidden rounded-3xl border text-left shadow-lg transition-transform transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 hover:-translate-y-1 hover:border-brand-500 hover:shadow-xl sm:aspect-[3/4] ${
        showAnswer ? "border-brand-500" : "border-gray-200"
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
            className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl border border-transparent bg-white p-3 text-stone-900 transition-colors sm:gap-4 sm:p-6"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="sr-only">Card {index + 1} function</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-xs font-semibold text-brand-700 shadow-sm transition-colors group-hover:text-brand-500 sm:h-9 sm:w-9 sm:text-sm">
              {index + 1}
            </span>
            <p className="text-center text-base font-semibold leading-tight text-brand-700 transition-colors group-hover:text-brand-500 sm:text-xl">
              {functionLabel}
            </p>
            <span className="sr-only">Flip to read the prompt</span>
          </div>

          <div
            className="absolute inset-0 flex h-full w-full items-center justify-center rounded-3xl border border-brand-200 bg-white p-3 text-stone-900 shadow-card transition-colors group-hover:border-brand-500 sm:p-6"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            id={`quiz-answer-${index}`}
            aria-hidden={!showAnswer}
          >
            <p className="text-center text-xs leading-relaxed text-stone-700 transition-colors group-hover:text-brand-700 sm:text-sm">
              {promptText}
            </p>
          </div>
        </div>
      </div>
    </button>
  )
}
