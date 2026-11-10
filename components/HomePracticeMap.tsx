"use client"

import Link from "next/link"
import { useState } from "react"

const steps = [
  { name: "Frameworks", action: "Use PREP to plan your answer. Make your point, give a reason, share an example, then return to your point.", why: "A framework helps you decide what to say first and how to build on it.", href: "/conversation-frameworks/prep", link: "Explore PREP" },
  { name: "Episodes", action: "Listen to I Finally Did My Laundry. Use PREP to sketch your answer about a chore you often leave until later.", why: "A familiar situation gives you a specific moment from your own life to talk about.", href: "/episodes/i-finally-did-my-laundry-29", link: "Listen to the story" },
  { name: "Practice Lab", action: "Practice “put off” in the Off category. Then record your answer in the episode. Try starting with “I put off folding my laundry because…”", why: "Practicing a phrasal verb in a sentence helps you see when it fits in your own conversations.", href: "/practice-lab", link: "Open Practice Lab" },
] as const

export default function HomePracticeMap() {
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const current = hovered ?? selected
  const step = steps[current]

  return (
    <section aria-labelledby="why-title" className="border-t border-slate-200 py-10 sm:py-14">
      <h2 id="why-title" className="text-4xl font-semibold tracking-[-0.05em]">Why it works</h2>
      <p className="mt-2 text-slate-600">Build one spoken answer, step by step.</p>
      <div className="mx-auto my-6 flex max-w-3xl flex-col" role="group" aria-label="Explore the practice steps">
        {steps.map((item, i) => (
          <div key={item.name} className="flex w-[72%] flex-col" style={{ marginLeft: (i * 14) + "%" }}>
            {i > 0 && (
              <div className="-ml-8 flex items-center gap-2 text-xs text-slate-600 sm:-ml-12">
                <svg aria-hidden="true" viewBox="0 0 50 32" className="h-8 w-12 shrink-0 text-[#2852d6]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 2 C3 24 21 25 44 25 M39 20 L45 25 L39 30" />
                </svg>
                {i === 1 ? "Use the structure" : "Find the words"}
              </div>
            )}
          <button type="button" aria-pressed={current === i} aria-controls="practice-step"
            onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(i) }}
            onFocus={() => { setHovered(null); setSelected(i) }}
            onClick={() => { setSelected(i); setHovered(null) }}
            className="group flex w-full items-center gap-3 self-start border-b border-slate-200 py-3 text-left font-semibold text-[#182021] aria-pressed:border-[#2852d6] aria-pressed:text-[#2852d6] focus-visible:outline-2 focus-visible:outline-[#2852d6]">
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-blue-200 font-mono text-sm text-[#2852d6] group-aria-pressed:border-[#2852d6] group-aria-pressed:bg-[#2852d6] group-aria-pressed:text-white">0{i + 1}</span>
            {item.name}
          </button>
          </div>
        ))}
      </div>
      <div id="practice-step" className="grid gap-5 rounded-2xl bg-[#eff3ff] p-5 text-[#162852] sm:grid-cols-2 sm:p-7">
        <div><h3 className="font-mono text-xs tracking-wider text-[#2852d6]">WHY IT HELPS</h3><p className="mt-2">{step.why}</p></div>
        <div>
          <h3 className="font-mono text-xs tracking-wider text-[#2852d6]">TRY IT</h3>
          <p className="mt-2">{step.action}</p>
          <Link className="mt-3 inline-block font-medium text-[#2852d6] hover:underline" href={step.href}>{step.link} ↗</Link>
        </div>
      </div>
    </section>
  )
}
