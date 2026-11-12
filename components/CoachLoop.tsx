"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { practiceDrafts } from "@/utils/practiceDrafts"
import EpisodeInteractive from "@/components/EpisodeInteractive"

/** What a learner can notice in a first take, and the one change that answers it. */
export const COACH_OPTIONS = [
  {
    id: "pauses",
    label: "I paused a lot or lost my thread",
    change: "Plan before you speak",
    tip: "Decide your point, one reason and one example before you press record. If you lose your thread, pause on purpose, then go back to your point.",
    link: { href: "/conversation-frameworks/prep", label: "Plan with PREP" },
  },
  {
    id: "word",
    label: "I was missing a word",
    change: "Describe it and keep going",
    tip: "When a word won’t come, describe it in simple words instead of stopping. Before your second take, look the word up so it’s ready.",
  },
  {
    id: "short",
    label: "My answer was very short",
    change: "Add one reason and one example",
    tip: "Answer the question first, then add “because…” and “for example…”. Two extra sentences are enough.",
  },
  {
    id: "rushed",
    label: "I rushed",
    change: "Speak in chunks",
    tip: "Say one phrase, pause briefly, then say the next. A pause after a key idea gives you control and sounds confident.",
  },
  {
    id: "corrections",
    label: "I kept correcting myself",
    change: "Finish the idea first",
    tip: "Let small mistakes go and keep moving. Listen for “could a friend understand me?”, not “was it correct?”",
  },
  {
    id: "ending",
    label: "My ending trailed off",
    change: "Land the ending",
    tip: "Finish with a thought, a feeling or an opinion, then stop. Try “So that’s why…” or “Anyway, that’s how I…”",
  },
] as const

type OptionId = (typeof COACH_OPTIONS)[number]["id"]
type Verdict = "yes" | "partly" | "no"
export type CoachState = { noticed: OptionId[]; focus: OptionId | null; improved: Verdict | null; understood: Verdict | null }

const EMPTY: CoachState = { noticed: [], focus: null, improved: null, understood: null }
const chip = "rounded-full border border-slate-300 px-3 py-2 text-left text-sm aria-pressed:border-[#2852d6] aria-pressed:bg-[#2852d6] aria-pressed:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2852d6]"
const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

const RESULT: Record<Verdict, string> = {
  yes: "You heard it, changed it and checked it. That’s coaching. Next time, notice something different.",
  partly: "A little better counts. Keep the same focus for one more take, or come back to it tomorrow.",
  no: "Good to know. Try a smaller change, or do one more take with the same focus.",
}

/** The focus in effect: the learner's pick, or the only thing they noticed. */
export function coachFocus(state: CoachState) {
  const id = state.focus && state.noticed.includes(state.focus) ? state.focus : state.noticed.length === 1 ? state.noticed[0] : null
  return COACH_OPTIONS.find(option => option.id === id) ?? null
}

export function readCoachState(storageBase: string): CoachState {
  try {
    const raw = practiceDrafts.get(`${storageBase}:coach`)
    if (raw) return { ...EMPTY, ...JSON.parse(raw) }
  } catch {}
  return EMPTY
}

function StepHeading({ number, title, cue }: { number?: string; title: string; cue: string }) {
  return (
    <div className="flex items-center gap-3">
      {number && <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#2852d6] font-mono text-xs text-white">{number}</span>}
      <h3 className="flex flex-col font-semibold sm:flex-row sm:items-baseline sm:gap-3">
        {title}
        <span className="text-sm font-normal text-stone-600">{cue}</span>
      </h3>
    </div>
  )
}

function VerdictButtons({ label, value, onChange }: { label: string; value: Verdict | null; onChange: (value: Verdict) => void }) {
  const options: [Verdict, string][] = [["yes", "Yes"], ["partly", "A little"], ["no", "Not yet"]]
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <div role="group" aria-label={label} className="mt-2 flex flex-wrap gap-2">
        {options.map(([key, text]) => (
          <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)} className={chip}>{text}</button>
        ))}
      </div>
    </div>
  )
}

export default function CoachLoop({ storageBase, episodeId, episodeTitle, firstTake }: {
  storageBase: string
  episodeId: string
  episodeTitle?: string
  firstTake: string
}) {
  const [state, setState] = useState<CoachState>(() => readCoachState(storageBase))
  const [secondTake, setSecondTake] = useState(() => practiceDrafts.get(`${storageBase}:text2`) ?? "")

  useEffect(() => { practiceDrafts.set(`${storageBase}:coach`, JSON.stringify(state)) }, [state, storageBase])
  useEffect(() => {
    if (secondTake.trim()) practiceDrafts.set(`${storageBase}:text2`, secondTake)
    else practiceDrafts.delete(`${storageBase}:text2`)
  }, [secondTake, storageBase])

  const focus = coachFocus(state)
  const noticedOptions = COACH_OPTIONS.filter(option => state.noticed.includes(option.id))
  const toggleNoticed = (id: OptionId) => setState(previous => ({
    ...previous,
    noticed: previous.noticed.includes(id) ? previous.noticed.filter(item => item !== id) : [...previous.noticed, id],
  }))

  return (
    <div className="mt-6 space-y-6 border-t border-stone-200 pt-6">
      <section aria-label="Notice" className="space-y-3">
        <StepHeading number="01" title="Notice" cue="What did I actually say?" />
        <p className="text-sm text-stone-600">Play your first take back, or reread your words. Listen the way a friend would, then mark what you notice.</p>
        <div role="group" aria-label="What I noticed" className="flex flex-wrap gap-2">
          {COACH_OPTIONS.map(option => (
            <button key={option.id} type="button" aria-pressed={state.noticed.includes(option.id)} onClick={() => toggleNoticed(option.id)} className={chip}>{option.label}</button>
          ))}
        </div>
      </section>

      {noticedOptions.length > 0 && (
        <section aria-label="Choose" className="space-y-3">
          <StepHeading number="02" title="Choose" cue="What’s the one thing I’ll change?" />
          {noticedOptions.length > 1 && (
            <>
              <p className="text-sm text-stone-600">Pick one only. One change is easy to hold in your head while you speak.</p>
              <div role="group" aria-label="My one change" className="flex flex-wrap gap-2">
                {noticedOptions.map(option => (
                  <button key={option.id} type="button" aria-pressed={focus?.id === option.id} onClick={() => setState(previous => ({ ...previous, focus: option.id }))} className={chip}>{option.change}</button>
                ))}
              </div>
            </>
          )}
          {focus && (
            <div className="rounded-xl bg-[#eff3ff] p-4 text-[#162852]">
              <p className="font-mono text-xs tracking-wider text-[#2852d6]">MY ONE CHANGE</p>
              <p className="mt-1 font-semibold">{focus.change}</p>
              <p className="mt-1 text-sm">{focus.tip}</p>
              {"link" in focus && <Link className="mt-2 inline-block text-sm font-medium text-[#2852d6] hover:underline" href={focus.link.href} target="_blank">{focus.link.label} ↗</Link>}
            </div>
          )}
        </section>
      )}

      {focus && (
        <>
          <section aria-label="Second take" className="space-y-3">
            <StepHeading title="Second take" cue={`Same question. One change: ${focus.change.toLowerCase()}.`} />
            <EpisodeInteractive
                episodeId={episodeId}
                audioTitle={episodeTitle}
                showReflectionMetrics={false}
                showPhrasebook={false}
                showResetControls={false}
                renderStandaloneCard={false}
                storageKey={`${storageBase}:audio2`}
                showTaskCheckbox={false}
                takeOffset={1}
                onDeleteTake={() => setSecondTake("")}
                onTranscribed={setSecondTake}
              />
            <label htmlFor={`${storageBase}-take2`} className="block text-sm text-gray-600">Your second take</label>
            <textarea
              id={`${storageBase}-take2`}
              rows={3}
              className="w-full rounded-2xl border border-brand-100 bg-white p-3 text-sm focus:border-sky-400 focus:outline-none"
              placeholder="Record your second take and your words appear here..."
              value={secondTake}
              onChange={event => setSecondTake(event.target.value)}
            />
            <p className="text-xs text-gray-500">Your transcript appears after you stop recording. You can edit it.</p>
          </section>

          <section aria-label="Check" className="space-y-4">
            <StepHeading number="03" title="Check" cue="Did it work?" />
            {firstTake.trim() && secondTake.trim() && (
              <div className="grid gap-3 sm:grid-cols-2">
                {[["Take 1", firstTake], ["Take 2", secondTake]].map(([name, text]) => (
                  <div key={name} className="rounded-xl border border-stone-200 p-3">
                    <p className="font-mono text-xs tracking-wider text-stone-600">{name.toUpperCase()} · {words(text)} WORDS</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm">{text}</p>
                  </div>
                ))}
              </div>
            )}
            <VerdictButtons label={`Did “${focus.change.toLowerCase()}” get better?`} value={state.improved} onChange={improved => setState(previous => ({ ...previous, improved }))} />
            <VerdictButtons label="Could a friend understand you?" value={state.understood} onChange={understood => setState(previous => ({ ...previous, understood }))} />
            {state.improved && state.understood && <p role="status" className="rounded-xl bg-[#eff3ff] p-4 text-sm text-[#162852]">{RESULT[state.improved]}</p>}
          </section>
        </>
      )}
    </div>
  )
}
