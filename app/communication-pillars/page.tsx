import { Suspense } from "react"
import { notFound } from "next/navigation"
import CommunicationPillarsClient from "./CommunicationPillarsClient"

const pillarsEnabled = false

function PillarsFallback() {
  return (
    <div className="space-y-6">
      <header className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">Communication Pillars</p>
        <h1 className="font-serif text-4xl font-semibold text-brand-900 sm:text-5xl">Communication Pillars</h1>
        <p className="text-base text-gray-700">7 foundations for confident, natural English.</p>
        <p className="text-sm text-gray-500">Choose one pillar. Practice it today.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 7 }).map((_, idx) => (
          <div
            key={`pillar-skeleton-${idx}`}
            className="h-28 rounded-3xl border border-emerald-100/60 bg-white/80 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
          />
        ))}
      </div>
    </div>
  )
}

export default function CommunicationPillarsPage() {
  if (!pillarsEnabled) {
    notFound()
  }
  return (
    <Suspense fallback={<PillarsFallback />}>
      <CommunicationPillarsClient />
    </Suspense>
  )
}
