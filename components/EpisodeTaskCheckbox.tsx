'use client'

import { useEffect, useState } from "react"
import { EpisodeTaskKey, getEpisodeProgress, subscribeToEpisodeProgress, updateEpisodeProgress } from "@/utils/episodeProgress"

type EpisodeTaskToggleProps = {
  episodeId: string
  task: EpisodeTaskKey
  className?: string
}

export default function EpisodeTaskCheckbox({ episodeId, task, className }: EpisodeTaskToggleProps) {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!episodeId) return
    const state = getEpisodeProgress(episodeId)
    setChecked(state[task])
    const unsubscribe = subscribeToEpisodeProgress((changedEpisodeId, progress) => {
      if (changedEpisodeId !== episodeId) return
      setChecked(progress[task])
    })
    return unsubscribe
  }, [episodeId, task])

  function handleToggle() {
    const next = !checked
    setChecked(next)
    updateEpisodeProgress(episodeId, { [task]: next })
  }

  const icon = (
    <span
      aria-hidden
      className={`flex h-5 w-5 items-center justify-center rounded-md border text-xs font-semibold ${
        checked ? "border-white bg-white/10 text-white" : "border-gray-300 text-gray-500"
      }`}
    >
      {checked ? (
        <svg
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 8.5L6.5 12l6.5-8" />
        </svg>
      ) : (
        <span className="sr-only">Not completed</span>
      )}
    </span>
  )

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={checked}
      className={`mt-4 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
        checked
          ? "border-brand-700 bg-brand-700 text-white shadow-card"
          : "border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-brand-50/70"
      } ${className ?? ""}`}
    >
      {icon}
      <span>Completed</span>
    </button>
  )
}
