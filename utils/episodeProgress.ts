"use client"

import { setEpisodeCompletion } from "@/utils/statsModel"

const STORAGE_KEY = "communicaly.episodeProgress.v1"
const PROGRESS_EVENT = "communicaly:episode-progress-updated"

export type EpisodeTaskKey = "responded" | "recorded"

export type EpisodeProgressEntry = {
  responded: boolean
  recorded: boolean
  updatedAt: string | null
}

const DEFAULT_ENTRY: EpisodeProgressEntry = {
  responded: false,
  recorded: false,
  updatedAt: null,
}

type ProgressMap = Record<string, EpisodeProgressEntry>

function isBrowser() {
  return typeof window !== "undefined"
}

function loadProgressMap(): ProgressMap {
  if (!isBrowser()) return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as ProgressMap
    if (!parsed || typeof parsed !== "object") return {}
    return parsed
  } catch (error) {
    console.error("Failed to load episode progress", error)
    return {}
  }
}

function saveProgressMap(map: ProgressMap) {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

function dispatchProgressEvent(episodeId: string, progress: EpisodeProgressEntry) {
  if (!isBrowser()) return
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: { episodeId, progress } }))
}

export function getEpisodeProgress(episodeId: string): EpisodeProgressEntry {
  const map = loadProgressMap()
  return {
    ...DEFAULT_ENTRY,
    ...(map[episodeId] ?? {}),
  }
}

export function isEpisodeComplete(entry: EpisodeProgressEntry) {
  return entry.responded && entry.recorded
}

type ProgressPatch = Partial<Record<EpisodeTaskKey, boolean>>

export function updateEpisodeProgress(episodeId: string, patch: ProgressPatch) {
  const map = loadProgressMap()
  const current = {
    ...DEFAULT_ENTRY,
    ...(map[episodeId] ?? {}),
  }
  const next: EpisodeProgressEntry = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  map[episodeId] = next
  saveProgressMap(map)
  dispatchProgressEvent(episodeId, next)
  setEpisodeCompletion(episodeId, isEpisodeComplete(next))
  return next
}

export function subscribeToEpisodeProgress(
  listener: (episodeId: string, progress: EpisodeProgressEntry) => void
) {
  if (!isBrowser()) return () => {}
  const handler = (event: Event) => {
    const custom = event as CustomEvent<{ episodeId: string; progress: EpisodeProgressEntry }>
    if (custom.detail) {
      listener(custom.detail.episodeId, custom.detail.progress)
    }
  }
  window.addEventListener(PROGRESS_EVENT, handler as EventListener)
  return () => window.removeEventListener(PROGRESS_EVENT, handler as EventListener)
}
