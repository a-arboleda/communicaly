"use client"
import { useState } from "react"
import EpisodeTextAnswer, { type TextResponseCat } from "@/components/EpisodeTextAnswer"
import PracticeJournal from "@/components/PracticeJournal"
import EpisodeInteractive from "@/components/EpisodeInteractive"
import EpisodeTaskCheckbox from "@/components/EpisodeTaskCheckbox"
import type { AudioPrompt } from "@/data/audioPrompts"

type Mode = "text" | "audio"

export default function RespondCard({
  episodeId,
  audioTitle,
  textAnswerQuestionsOverride,
  textHelperOverrides,
  audioPrompt,
}: {
  episodeId: string
  audioTitle?: string
  textAnswerQuestionsOverride?: Partial<Record<TextResponseCat, string>>
  textHelperOverrides?: Partial<Record<TextResponseCat, string[]>>
  audioPrompt?: AudioPrompt
}) {
  const [mode, setMode] = useState<Mode>("audio")

  return (
    <section id="answer" className="card scroll-mt-20">
      <div className="card-body space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base text-brand-900">Pick how you want to answer right now.</p>
          </div>
          <div className="inline-flex rounded-full border border-brand-300 bg-brand-50 p-0.5" role="group" aria-label="Response mode">
            {[
              { key: "audio", label: "Audio Response" },
              { key: "text", label: "Text Response" },
            ].map(({ key, label }) => {
              const active = mode === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMode(key as Mode)}
                  aria-pressed={active}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    active ? "bg-white text-brand-900 shadow" : "text-brand-700 hover:text-brand-900"
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {mode === "text" ? (
          <div className="space-y-4">
            <EpisodeTextAnswer
              episodeId={episodeId}
              overrideQuestions={textAnswerQuestionsOverride}
              overrideHelpers={textHelperOverrides}
            />
            <PracticeJournal
              inline
              episodeId={episodeId}
              audioTitle={audioTitle}
              textAnswerQuestionsOverride={textAnswerQuestionsOverride}
            />
            <EpisodeTaskCheckbox episodeId={episodeId} task="responded" />
          </div>
        ) : (
          <div className="space-y-4">
            {audioPrompt ? (
              <div className="rounded-2xl border border-brand-100 bg-white/80 p-4 space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-brand-800">Read the speaker’s question</p>
                <p className="text-base text-brand-900">{audioPrompt.question}</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-brand-200 p-4 text-sm text-gray-600">
                Add an audio prompt (.mp3) for this episode to enable playback.
              </div>
            )}
            <EpisodeInteractive
              episodeId={episodeId}
              audioTitle={audioTitle}
              showPhrasebook={false}
              showResetControls={false}
              renderStandaloneCard={false}
              storageKey={`ep:${episodeId}:audio`}
              showTaskCheckbox={false}
            />
            <EpisodeTaskCheckbox episodeId={episodeId} task="recorded" />
          </div>
        )}
      </div>
    </section>
  )
}
