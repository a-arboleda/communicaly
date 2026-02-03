"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

const STORAGE_KEY = "communicaly-daily-think-start"
const DAY_MS = 1000 * 60 * 60 * 24
const MIN_DAYS = 7

const readStart = () => {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isNaN(parsed) ? null : parsed
}

const ensureStart = () => {
  if (typeof window === "undefined") return null
  const existing = readStart()
  if (existing) return existing
  const now = Date.now()
  window.localStorage.setItem(STORAGE_KEY, String(now))
  return now
}

const getDaysSince = (start: number | null) => {
  if (!start) return null
  return Math.floor((Date.now() - start) / DAY_MS)
}

export function DailyThinkProgressMarker() {
  useEffect(() => {
    ensureStart()
  }, [])

  return null
}

export function DailyThinkReadyPrompt() {
  const [daysSince, setDaysSince] = useState<number | null>(null)

  useEffect(() => {
    const start = readStart()
    setDaysSince(getDaysSince(start))
  }, [])

  const isReady = useMemo(() => (daysSince ?? 0) >= MIN_DAYS, [daysSince])

  if (!isReady) {
    return null
  }

  return (
    <section className="rounded-3xl border border-emerald-200/70 bg-emerald-50/80 p-6 text-center sm:p-8">
      <h3 className="font-serif text-2xl font-semibold text-brand-900">Ready to build your thoughts into clear sentences?</h3>
      <p className="mt-2 text-sm text-gray-700">
        You’ve given your thinking space. Now you can turn it into clear, confident sentences.
      </p>
      <div className="mt-4 flex justify-center">
        <Link href="/practice-lab" className="btn btn-primary">
          Continue in Practice Lab →
        </Link>
      </div>
    </section>
  )
}

export function BuildEntryNotice() {
  const [daysSince, setDaysSince] = useState<number | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const start = readStart()
    setDaysSince(getDaysSince(start))
  }, [])

  const shouldShow = (daysSince ?? 0) < MIN_DAYS

  if (dismissed || !shouldShow) {
    return null
  }

  return (
    <section className="rounded-3xl border border-emerald-100/70 bg-emerald-50/70 p-6 text-center text-gray-700 sm:p-8">
      <p className="text-sm font-semibold text-emerald-900">
        Before jumping into drills, we recommend spending a few days listening first.
      </p>
      <p className="mt-2 text-sm text-emerald-900/80">Clear listening makes practice feel easier.</p>
      <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row">
        <Link href="/episodes" className="btn btn-muted">
          Start with an episode
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-xs font-semibold text-emerald-900/70 transition hover:text-emerald-900"
        >
          Continue anyway
        </button>
      </div>
    </section>
  )
}
