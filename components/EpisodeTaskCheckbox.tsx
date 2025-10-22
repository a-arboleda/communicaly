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

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={checked}
      aria-label={checked ? "Mark task as not completed" : "Mark task as completed"}
      className={`mt-4 inline-flex w-full items-center justify-between gap-4 rounded-2xl bg-transparent px-4 py-3 text-base font-medium text-gray-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 sm:w-auto sm:justify-start sm:px-2 sm:py-2 sm:text-sm ${className ?? ""}`}
    >
      <span
        aria-hidden
        className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors duration-200 ease-out ${
          checked ? "border-brand-700 bg-brand-700" : "border-gray-300 bg-gray-200"
        }`}
      >
        <span
          className={`absolute left-0.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition-transform duration-200 ease-out transform ${
            checked ? "translate-x-[18px]" : "translate-x-0"
          }`}
        />
      </span>
      <span>{checked ? "Completed" : "Mark complete"}</span>
    </button>
  )
}
