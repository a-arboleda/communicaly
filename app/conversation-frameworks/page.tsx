"use client"

import Link from "next/link"
import { useMemo } from "react"
import { frameworks, frameworkById } from "@/components/conversation-frameworks/frameworkData"

export default function ConversationFrameworksPage() {
  const frameworkByIdMemo = useMemo(() => frameworkById, [])
  const recommendedId = frameworks[0]?.id

  function handleScrollTo(targetId: string) {
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="space-y-16 pb-10 text-gray-800">
      <section className="relative overflow-hidden rounded-[32px] border border-brand-200/70 bg-gradient-to-br from-[#F2F7F4] via-white to-[#E9F1F6] p-8 sm:p-12">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#DDEBE3] opacity-60 blur-3xl" />
        <div className="absolute -bottom-16 right-0 h-48 w-48 rounded-full bg-[#DCE8F2] opacity-50 blur-3xl" />
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Conversation frameworks</p>
            <h1 className="text-3xl font-semibold text-brand-900 sm:text-4xl">
              Speak with confidence
            </h1>
            <p className="max-w-xl text-sm text-gray-600 sm:text-base">
              Simple frameworks to help you respond clearly in everyday English conversations.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-brand-200/70 bg-brand-100/40 px-3 py-1.5 text-xs font-medium text-brand-900 transition-[border-color,box-shadow] duration-200 hover:ring-1 hover:ring-brand-700/30 cursor-pointer"
              onClick={() => handleScrollTo("recommendation")}
            >
              See recommended framework
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-brand-200/70 bg-brand-100/40 px-3 py-1.5 text-xs font-medium text-brand-900 transition-[border-color,box-shadow] duration-200 hover:ring-1 hover:ring-brand-700/30 cursor-pointer"
              onClick={() => handleScrollTo("frameworks")}
            >
              Explore framework
            </button>
          </div>
        </div>
      </section>

      <section id="frameworks" className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-brand-900">
            What is your situation right now?
          </h2>
          <p className="text-sm text-gray-600">
            Choose the moment you are in, and we will suggest a framework.
          </p>
        </div>
        <div className="space-y-3">
          {frameworks.map(framework => (
            <Link
              key={framework.id}
              href={`/conversation-frameworks/${framework.slug}`}
              className="flex w-full items-center justify-between rounded-2xl border border-brand-200/60 bg-white px-4 py-4 text-left transition-[border-color,box-shadow] duration-200 hover:border-brand-700/40 hover:ring-1 hover:ring-brand-700/30"
            >
              <div className="flex w-full items-center justify-between gap-4">
                <div>
                  <p className="text-base font-medium text-brand-900">{framework.situationLabel}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.24em] text-green-900">
                    {framework.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {framework.summary}
                  </p>
                </div>
                <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-gray-500">
                  Open
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {recommendedId ? (
        <section id="recommendation" className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-brand-900">Recommended framework</h2>
            <p className="text-sm text-gray-600">
              A framework we suggest based on the most common situations.
            </p>
          </div>
          <div className="card bg-[#F6F3EE]">
            <div className="card-body space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Framework</p>
                <h3 className="text-xl font-semibold text-brand-900">
                  {frameworkByIdMemo[recommendedId].name}
                </h3>
                <p className="text-sm text-gray-600">
                  {frameworkByIdMemo[recommendedId].summary}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Example</p>
                <div className="space-y-1 text-sm text-gray-700">
                  {frameworkByIdMemo[recommendedId].exampleAnswer.map(line => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <Link
                href={`/conversation-frameworks/${frameworkByIdMemo[recommendedId].slug}`}
                className="inline-flex items-center justify-center rounded-[7px] bg-[#2E2E2E] px-7 py-3.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E2E2E] focus-visible:ring-offset-2"
              >
                Practice this framework
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
