'use client'

import { useState } from "react"

type TutorStudentQuizItem = {
  prompt: string
  expected: string
}

type EpisodeHighlightsProps = {
  slug: string
  story?: string[]
  keyDetails?: string[]
  tryThis?: string[]
  practiceQuiz?: TutorStudentQuizItem[]
}

export default function EpisodeHighlights({
  story,
  keyDetails,
  tryThis,
  practiceQuiz,
}: EpisodeHighlightsProps) {
  const showStory = Array.isArray(story) && story.length > 0
  const showKeyDetails = Array.isArray(keyDetails) && keyDetails.length > 0
  const showTryThis = Array.isArray(tryThis) && tryThis.length > 0

  const storyItems = showStory ? story ?? [] : []
  const keyDetailItems = showKeyDetails ? keyDetails ?? [] : []
  const tryThisItems = showTryThis ? tryThis ?? [] : []

  const quizItems = Array.isArray(practiceQuiz) ? practiceQuiz.filter((item) => item?.prompt && item?.expected) : []
  const hasQuiz = quizItems.length > 0

  const showToolkit = showStory || showKeyDetails || showTryThis
  const showHighlights = showToolkit || hasQuiz

  if (!showHighlights) return null

  return (
    <>
      {showToolkit && (
        <section id="highlights" className="not-prose card scroll-mt-20">
          <div className="card-body space-y-6">
            <h2 className="text-xl font-semibold text-blue-600">Student&apos;s Story Practice Toolkit</h2>

            {showStory && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Story</h3>
                <div className="mt-3 space-y-3 text-gray-800">
                  {storyItems.map((paragraph, idx) => (
                    <p key={`story-${idx}`}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {showKeyDetails && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Key details</h3>
                <ul className="mt-3 list-disc list-inside space-y-2 text-gray-800">
                  {keyDetailItems.map((item, idx) => (
                    <li key={`key-${idx}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {showTryThis && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Try this</h3>
                <ul className="mt-3 list-disc list-inside space-y-2 text-gray-800">
                  {tryThisItems.map((item, idx) => (
                    <li key={`try-${idx}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {hasQuiz && (
        <section id="practice-quiz" className="not-prose card scroll-mt-20">
          <div className="card-body space-y-4">
            <h2 className="text-xl font-semibold text-blue-600">Tutor &amp; Student Practice Quiz</h2>
            <p className="text-sm text-gray-600">
              Click a card to flip it. Tutors read the prompt, students respond, then reveal the expected idea together.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {quizItems.map((item, idx) => (
                <QuizCard key={`quiz-${idx}`} item={item} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function QuizCard({ item, index }: { item: TutorStudentQuizItem; index: number }) {
  const [showAnswer, setShowAnswer] = useState(false)

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
      className={`relative h-full w-full rounded-2xl border p-0 text-left shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 ${
        showAnswer ? "border-brand-300" : "border-gray-200"
      }`}
      aria-expanded={showAnswer}
      aria-controls={`quiz-answer-${index}`}
    >
      <span className="sr-only">Toggle answer for prompt {index + 1}</span>
      <div className="relative h-full w-full overflow-hidden rounded-2xl" style={{ perspective: "1000px" }}>
        <div
          className="min-h-[210px] w-full transform-gpu transition-transform duration-500 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: showAnswer ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="absolute inset-0 flex h-full w-full flex-col justify-between rounded-2xl border border-transparent bg-gradient-to-br from-white via-sky-50 to-emerald-50 p-5 text-gray-900"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/70 text-[11px] font-semibold text-brand-900 shadow">
                  {index + 1}
                </span>
                Tutor prompt
              </p>
              <p className="mt-3 font-semibold leading-snug">{item.prompt}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-brand-900">
              <span className="inline-flex items-center gap-1 font-semibold">
                <svg aria-hidden className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm9-5h-2v6h5v-2h-3V5z" />
                </svg>
                Flip to see answer
              </span>
              <span className="text-gray-500">Tap / Enter</span>
            </div>
          </div>

          <div
            className="absolute inset-0 flex h-full w-full flex-col justify-between rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-brand-100 p-5 text-gray-900 shadow-card"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            id={`quiz-answer-${index}`}
            aria-hidden={!showAnswer}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-900 flex items-center gap-2">
                <svg aria-hidden className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                </svg>
                Expected idea
              </p>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">{item.expected}</p>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-brand-900">
              <span>Tap to go back</span>
              <span className="text-brand-700">Esc to reset</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}
