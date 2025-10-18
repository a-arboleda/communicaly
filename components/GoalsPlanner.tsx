'use client'

import { useEffect, useMemo, useState } from "react"
import jsPDF from "jspdf"
import {
  DEFAULT_STATS,
  type StoredStats,
  loadStats,
  mutateStats,
  resetStats,
  subscribeToStats,
} from "@/utils/statsModel"

type GoalsPlannerProps = {
  totalEpisodes: number
}

type WeekSnapshot = {
  isoWeek: number
  isoYear: number
  rangeLabel: string
}

function getIsoWeek(date: Date): { isoWeek: number; isoYear: number } {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = tmp.getUTCDay() || 7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum)
  const isoYear = tmp.getUTCFullYear()
  const yearStart = new Date(Date.UTC(isoYear, 0, 1))
  const isoWeek = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return { isoWeek, isoYear }
}

function getWeekRange(date: Date): { start: Date; end: Date } {
  const current = new Date(date)
  const day = current.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  const start = new Date(current)
  start.setDate(current.getDate() + diff)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

function formatWeekRange(start: Date, end: Date): string {
  const sameMonth = start.getMonth() === end.getMonth()
  const sameYear = start.getFullYear() === end.getFullYear()
  const formatterMonth = new Intl.DateTimeFormat("en", { month: "long" })
  const startMonth = formatterMonth.format(start)
  const endMonth = formatterMonth.format(end)

  if (sameMonth && sameYear) {
    return `${startMonth} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`
  }

  if (sameYear) {
    return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${start.getFullYear()}`
  }

  return `${startMonth} ${start.getDate()}, ${start.getFullYear()} – ${endMonth} ${end.getDate()}, ${end.getFullYear()}`
}

function getWeekSnapshot(): WeekSnapshot {
  const now = new Date()
  const { isoWeek, isoYear } = getIsoWeek(now)
  const { start, end } = getWeekRange(now)
  return {
    isoWeek,
    isoYear,
    rangeLabel: formatWeekRange(start, end),
  }
}

export default function GoalsPlanner({ totalEpisodes }: GoalsPlannerProps) {
  const [state, setState] = useState<StoredStats>(DEFAULT_STATS)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const initial = loadStats()
    setState(initial)
    setHydrated(true)
    const unsubscribe = subscribeToStats((next) => setState(next))
    return unsubscribe
  }, [])

  const weekSnapshot = useMemo(() => getWeekSnapshot(), [])

  const weeklyProgress = useMemo(() => {
    if (state.weeklyEpisodesGoal <= 0) return 0
    return Math.min(state.episodesCompletedThisWeek / state.weeklyEpisodesGoal, 1)
  }, [state.weeklyEpisodesGoal, state.episodesCompletedThisWeek])

  const weeklyProgressPercent = Math.round(weeklyProgress * 100)

  function updateField<Key extends keyof StoredStats>(key: Key, value: StoredStats[Key]) {
    const next = mutateStats((prev) => ({
      ...prev,
      [key]: value,
    }))
    setState(next)
  }

  function handleReset() {
    const next = resetStats()
    setState(next)
  }

  function handleExportPdf() {
    const doc = new jsPDF()
    const margin = 20
    let y = margin

    doc.setFont("helvetica", "bold")
    doc.setFontSize(18)
    doc.text("Weekly goals blueprint", margin, y)
    y += 10
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Week ${weekSnapshot.isoWeek} · ${weekSnapshot.rangeLabel}`, margin, y)
    y += 6
    doc.text(`ISO year ${weekSnapshot.isoYear}`, margin, y)
    y += 12

    const sections: Array<{ title: string; value: string }> = [
      { title: "Preferred name", value: state.displayName || "—" },
      { title: "Voice identity (How do I want to sound?)", value: state.voiceIdentity || "—" },
      { title: "Signature words, gestures, or phrases", value: state.focusAreas || "—" },
      { title: "Episodes planned this week", value: state.weeklyEpisodesGoal ? `${state.weeklyEpisodesGoal}` : "—" },
      { title: "Estimated progress", value: `${state.episodesCompletedThisWeek} completed (${weeklyProgressPercent}%)` },
      { title: "Weekly spotlight", value: state.weeklyFocus || "—" },
      { title: "Notes and reflections", value: state.notes || "—" },
    ]

    sections.forEach(({ title, value }) => {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.text(title, margin, y)
      y += 6
      doc.setFont("helvetica", "normal")
      doc.setFontSize(11)
      const lines = doc.splitTextToSize(value, 170)
      doc.text(lines, margin, y)
      y += lines.length * 5 + 6
    })

    doc.setFont("helvetica", "italic")
    doc.setFontSize(10)
    doc.text("Generated in Communicaly · Stored locally on this device.", margin, y)

    doc.save(`communicaly-weekly-goals-${weekSnapshot.isoWeek}.pdf`)
  }

  const lastUpdatedDisplay = useMemo(() => {
    if (!state.lastUpdated) return "Not saved yet"
    try {
      return new Date(state.lastUpdated).toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })
    } catch {
      return "Not saved yet"
    }
  }, [state.lastUpdated])

  if (!hydrated) {
    return (
      <section className="card">
        <div className="card-body">
          <p className="text-sm text-gray-600">Loading your saved goals…</p>
        </div>
      </section>
    )
  }

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <header className="space-y-3">
          <p className="tag tag-accent w-fit">Build your voice</p>
          <h2 className="text-3xl font-serif font-semibold text-gray-900">Shape the English identity you want</h2>
          <p className="max-w-2xl text-gray-700">
            Use this space to pick how you want to sound, set weekly intentions, and celebrate every small win.
            When you mark each episode checkpoint as completed, your weekly counter updates automatically.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="card md:col-span-1">
            <div className="card-body space-y-2">
              <p className="text-xs uppercase tracking-wide text-gray-500">Current week</p>
              <p className="text-3xl font-semibold text-brand-900">Week {weekSnapshot.isoWeek}</p>
              <p className="text-sm text-gray-600">{weekSnapshot.rangeLabel}</p>
              <p className="text-xs text-gray-500">ISO year {weekSnapshot.isoYear}</p>
            </div>
          </div>
          <div className="card md:col-span-1">
            <div className="card-body space-y-2">
              <p className="text-xs uppercase tracking-wide text-gray-500">Episodes available</p>
              <p className="text-3xl font-semibold text-brand-900">{totalEpisodes}</p>
              <p className="text-sm text-gray-600">Pick the stories that align with this week’s identity work.</p>
            </div>
          </div>
          <div className="card md:col-span-1">
            <div className="card-body space-y-2">
              <p className="text-xs uppercase tracking-wide text-gray-500">Quick reminder</p>
              <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
                <li>Decide how you want to sound.</li>
                <li>Practice at least {state.weeklyEpisodesGoal || 3} episodes.</li>
                <li>Reflect and capture what worked.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <form className="card" onSubmit={(event) => event.preventDefault()}>
          <div className="card-body space-y-4">
            <header className="space-y-1">
              <p className="tag tag-accent">Voice identity</p>
              <h3 className="text-xl font-semibold text-gray-900">Who are you when you speak English?</h3>
              <p className="text-sm text-gray-600">Consider tone, gestures, energy, and the language that feels like you.</p>
            </header>

            <label className="space-y-1 block">
              <span className="text-sm font-medium text-gray-800">Preferred name</span>
              <input
                type="text"
                value={state.displayName}
                onChange={(event) => updateField("displayName", event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                placeholder="e.g. Dani"
              />
            </label>

            <label className="space-y-1 block">
              <span className="text-sm font-medium text-gray-800">Describe your voice identity</span>
              <textarea
                value={state.voiceIdentity}
                onChange={(event) => updateField("voiceIdentity", event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                rows={4}
                placeholder="Warm, direct, curious… I want to sound like myself but with smoother transitions."
              />
            </label>

            <label className="space-y-1 block">
              <span className="text-sm font-medium text-gray-800">Signature words or phrases</span>
              <textarea
                value={state.focusAreas}
                onChange={(event) => updateField("focusAreas", event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                rows={3}
                placeholder="Energetic hellos, using more connectors, asking follow-up questions…"
              />
            </label>
          </div>
        </form>

        <form className="card" onSubmit={(event) => event.preventDefault()}>
          <div className="card-body space-y-4">
            <header className="space-y-1">
              <p className="tag tag-accent">Weekly rhythm</p>
              <h3 className="text-xl font-semibold text-gray-900">Set your goals and review progress</h3>
              <p className="text-sm text-gray-600">Tune this week’s targets and watch your checklist progress update automatically.</p>
            </header>

            <label className="space-y-1 block">
              <span className="text-sm font-medium text-gray-800">Episode target</span>
              <input
                type="number"
                min={0}
                value={state.weeklyEpisodesGoal}
                onChange={(event) => updateField("weeklyEpisodesGoal", Math.max(0, Number(event.target.value)))}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>

            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-800">Episodes completed this week</span>
              <div className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm">
                <span className="text-lg font-semibold text-brand-900">{state.episodesCompletedThisWeek}</span>
                <span className="text-xs text-gray-500">Updates automatically when you mark “Completed” on an episode.</span>
              </div>
              <div className="mt-2">
                <div className="h-2 rounded-full bg-brand-200/80">
                  <div className="h-2 rounded-full bg-brand-700 transition-all" style={{ width: `${weeklyProgressPercent}%` }} />
                </div>
                <p className="mt-1 text-xs text-gray-600">{weeklyProgressPercent}% of your weekly target.</p>
              </div>
            </div>

            <label className="space-y-1 block">
              <span className="text-sm font-medium text-gray-800">Weekly spotlight</span>
              <textarea
                value={state.weeklyFocus}
                onChange={(event) => updateField("weeklyFocus", event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                rows={3}
                placeholder="Example: intentional pauses, use comparisons, practice showing gratitude."
              />
            </label>

            <label className="space-y-1 block">
              <span className="text-sm font-medium text-gray-800">Notes or reflections</span>
              <textarea
                value={state.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                rows={4}
                placeholder="Which episode helped most? What would you repeat or adjust?"
              />
            </label>
          </div>
        </form>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={handleExportPdf} className="btn btn-primary">
          Download plan (PDF)
        </button>
        <button type="button" onClick={handleReset} className="btn btn-muted">
          Reset plan
        </button>
        <span className="text-xs text-gray-500">Last updated: {lastUpdatedDisplay}</span>
      </section>

      <aside className="border border-dashed border-brand-200 rounded-2xl bg-brand-200/30 p-4 text-sm text-gray-700 space-y-2">
        <p>Your data stays in this browser. When accounts go live, you’ll be able to sync it with the cloud.</p>
        <p>Until then, download the PDF to share with a tutor or stick it in your practice journal.</p>
      </aside>
    </div>
  )
}
