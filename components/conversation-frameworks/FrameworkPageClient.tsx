"use client"

import Link from "next/link"
import { useState } from "react"
import type { Framework } from "@/components/conversation-frameworks/frameworkData"

type FrameworkPageClientProps = {
  framework: Framework
}

export default function FrameworkPageClient({ framework }: FrameworkPageClientProps) {
  const steps = framework.practiceSteps
  const [stepIndex, setStepIndex] = useState(0)
  const [responses, setResponses] = useState<string[]>(() => steps.map(() => ""))
  const [reflection, setReflection] = useState("")
  const [practiceQuestion, setPracticeQuestion] = useState(() => {
    const questions = framework.practiceQuestions ?? []
    if (questions.length === 0) return ""
    return questions[Math.floor(Math.random() * questions.length)]
  })

  const isReflection = stepIndex === steps.length
  const isComplete = stepIndex === steps.length + 1

  function handleNext() {
    setStepIndex(prev => Math.min(prev + 1, steps.length + 1))
  }

  function handleBack() {
    setStepIndex(prev => Math.max(prev - 1, 0))
  }

  function handleReset() {
    setResponses(steps.map(() => ""))
    setReflection("")
    setStepIndex(0)
  }

  function handleRandomQuestion() {
    const questions = framework.practiceQuestions ?? []
    if (questions.length === 0) return
    const next = questions[Math.floor(Math.random() * questions.length)]
    setPracticeQuestion(next)
  }

  return (
    <div className="space-y-12 pb-10 text-gray-800">
      <section className="relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Conversation framework</p>
          <h1 className="text-3xl font-semibold text-brand-900 sm:text-4xl">
            {framework.name}
          </h1>
          <p className="text-sm text-gray-600 sm:text-base">{framework.subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/conversation-frameworks" className="btn btn-ghost">
              Back to frameworks
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card bg-white/90">
            <div className="card-body space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Best for</p>
              <p className="text-sm text-gray-700">{framework.bestFor}</p>
            </div>
          </div>
          <div className="card bg-white/90">
            <div className="card-body space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">When to use it</p>
              <p className="text-sm text-gray-700">{framework.whenToUse}</p>
            </div>
          </div>
          <div className="card bg-white/90">
            <div className="card-body space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Why it helps</p>
              <p className="text-sm text-gray-700">{framework.whyItHelps}</p>
            </div>
          </div>
        </div>

        <div className="card bg-[#F6F3EE]">
          <div className="card-body space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Example</p>
              <p className="text-sm text-gray-700">{framework.examplePrompt}</p>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              {framework.exampleAnswer.map((line, index) => {
                const label = framework.practiceSteps[index]?.label ?? `Step ${index + 1}`
                return (
                  <p key={`${label}-${line}`}>
                    <span className="font-semibold text-brand-900">{label}:</span> {line}
                  </p>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="space-y-1">
          <p className="text-lg font-semibold uppercase tracking-[0.24em] text-blue-700 font-serif">
            Interactive practice
          </p>
          <p className="text-sm text-gray-600">
            One step at a time. No scoring, no corrections. Use a question you choose or try
            one from our list.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <p className="text-sm text-gray-700">
              Practice question:{" "}
              <span className="font-medium text-brand-900">{practiceQuestion}</span>
            </p>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-[7px] bg-[#2E2E2E] px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E2E2E] focus-visible:ring-offset-2"
              onClick={handleRandomQuestion}
            >
              Try another question
            </button>
          </div>
        </div>
        <div className="card bg-white/90">
          <div className="card-body space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="tag">Guided response</span>
              <span className="tag">3-5 minutes</span>
            </div>

            {isComplete ? (
              <div className="space-y-4">
                <p className="text-base text-gray-700">Good communication starts with awareness.</p>
                <div className="flex flex-wrap gap-3">
                  <button type="button" className="btn btn-ghost" onClick={handleReset}>
                    Try another framework
                  </button>
                  <Link href="/conversation-frameworks#situations" className="btn btn-primary">
                    Choose a new situation
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-gray-500">
                    Step {Math.min(stepIndex + 1, steps.length + 1)} of {steps.length + 1}
                  </p>
                  <p className="text-sm font-medium text-brand-900">
                    {isReflection ? "Reflection" : steps[stepIndex].label}
                  </p>
                </div>

                <div className="rounded-2xl border border-brand-200/70 bg-gradient-to-br from-[#F2F7F4] via-white to-[#E9F1F6] p-4">
                  <p className="text-base font-semibold text-gray-700">
                    {isReflection ? "Full combined answer" : steps[stepIndex].prompt}
                  </p>
                  {isReflection ? (
                    <p className="mt-3 text-sm text-gray-700">
                      {responses.filter(Boolean).join(", ")}
                    </p>
                  ) : null}
                </div>
                {isReflection ? (
                  <p className="text-sm font-semibold text-gray-700">{framework.reflection}</p>
                ) : null}

                <textarea
                  rows={4}
                  className="w-full rounded-2xl border border-brand-200/70 bg-white p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  placeholder={isReflection ? "Write a quick reflection" : "Write your response"}
                  value={isReflection ? reflection : responses[stepIndex] ?? ""}
                  onChange={event => {
                    const value = event.target.value
                    if (isReflection) {
                      setReflection(value)
                    } else {
                      setResponses(prev => {
                        const next = [...prev]
                        next[stepIndex] = value
                        return next
                      })
                    }
                  }}
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="btn btn-muted"
                    onClick={handleBack}
                    disabled={stepIndex === 0}
                  >
                    Back
                  </button>
                  <button type="button" className="btn btn-muted" onClick={handleNext}>
                    {isReflection ? "Finish" : "Next"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
