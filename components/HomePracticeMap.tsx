"use client"

import Link from "next/link"
import { useState } from "react"

const episode = "/episodes/i-finally-did-my-laundry-29"

const steps = [
  {
    name: "Notice",
    cue: "What did I actually say?",
    why: "You can’t change what you don’t hear. Listening back lets you hear yourself the way a listener does.",
    action: "Listen to I Finally Did My Laundry, then record a short answer about a chore you keep putting off. Play it back and notice one thing: a long pause, a word you were missing, or an ending that trailed off.",
    links: [{ href: episode, label: "Listen to the story" }],
  },
  {
    name: "Choose",
    cue: "What’s the one thing I’ll change?",
    why: "One change is easy to hold in your head while you speak. Five changes aren’t.",
    action: "Pick one change only. If your answer wandered, plan it with PREP. If you were missing a word, practice “put off” in the Practice Lab and start with “I put off folding my laundry because…”",
    links: [
      { href: "/conversation-frameworks/prep", label: "Plan with PREP" },
      { href: "/practice-lab", label: "Open Practice Lab" },
    ],
  },
  {
    name: "Check",
    cue: "Did it work?",
    why: "Hearing the difference yourself is what builds confidence. You don’t need anyone else to tell you it got better.",
    action: "Record the same answer again and listen. Ask two questions: did the one thing I chose get better, and could a friend understand me? Then rate yourself and move on.",
    links: [{ href: episode, label: "Record your next take" }],
  },
] as const

export default function HomePracticeMap() {
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const current = hovered ?? selected
  const step = steps[current]

  return (
    <section aria-labelledby="method-title" className="border-t border-slate-200 py-10 sm:py-14">
      <h2 id="method-title" className="scroll-mt-28 text-4xl font-semibold tracking-[-0.05em]">How to coach yourself</h2>
      <p className="mt-2 text-slate-600">One short answer. Three steps. No teacher needed.</p>
      <div className="mx-auto my-6 flex max-w-3xl flex-col" role="group" aria-label="Explore the three coaching steps">
        {steps.map((item, i) => (
          <div key={item.name} className="flex w-[72%] flex-col" style={{ marginLeft: (i * 14) + "%" }}>
            {i > 0 && (
              <div className="-ml-8 flex items-center gap-2 text-xs text-slate-600 sm:-ml-12">
                <svg aria-hidden="true" viewBox="0 0 50 32" className="h-8 w-12 shrink-0 text-[#2852d6]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 2 C3 24 21 25 44 25 M39 20 L45 25 L39 30" />
                </svg>
                {i === 1 ? "Pick one thing" : "Try it again"}
              </div>
            )}
          <button type="button" aria-pressed={current === i} aria-controls="practice-step"
            onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(i) }}
            onFocus={() => { setHovered(null); setSelected(i) }}
            onClick={() => { setSelected(i); setHovered(null) }}
            className="group flex w-full items-center gap-3 self-start border-b border-slate-200 py-3 text-left font-semibold text-[#182021] aria-pressed:border-[#2852d6] aria-pressed:text-[#2852d6] focus-visible:outline-2 focus-visible:outline-[#2852d6]">
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-blue-200 font-mono text-sm text-[#2852d6] group-aria-pressed:border-[#2852d6] group-aria-pressed:bg-[#2852d6] group-aria-pressed:text-white">0{i + 1}</span>
            <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
              {item.name}
              <span className="text-sm font-normal text-slate-600">{item.cue}</span>
            </span>
          </button>
          </div>
        ))}
      </div>
      <div id="practice-step" className="grid gap-5 rounded-2xl bg-[#eff3ff] p-5 text-[#162852] sm:grid-cols-2 sm:p-7">
        <div><h3 className="font-mono text-xs tracking-wider text-[#2852d6]">WHY IT HELPS</h3><p className="mt-2">{step.why}</p></div>
        <div>
          <h3 className="font-mono text-xs tracking-wider text-[#2852d6]">TRY IT</h3>
          <p className="mt-2">{step.action}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
            {step.links.map(link => (
              <Link key={link.label} className="font-medium text-[#2852d6] hover:underline" href={link.href}>{link.label} ↗</Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
