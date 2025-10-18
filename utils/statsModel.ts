const STATS_STORAGE_KEY = "communicaly.stats.v1"
const STATS_EVENT = "communicaly:stats-updated"

export const STATS_STORAGE_EVENT = STATS_EVENT

export type StoredStats = {
  displayName: string
  voiceIdentity: string
  weeklyEpisodesGoal: number
  episodesCompletedThisWeek: number
  streak: number
  focusAreas: string
  weeklyFocus: string
  notes: string
  lastUpdated: string | null
  episodeCompletions: Record<string, string>
}

export const DEFAULT_STATS: StoredStats = {
  displayName: "",
  voiceIdentity: "",
  weeklyEpisodesGoal: 3,
  episodesCompletedThisWeek: 0,
  streak: 0,
  focusAreas: "",
  weeklyFocus: "",
  notes: "",
  lastUpdated: null,
  episodeCompletions: {},
}

function isBrowser() {
  return typeof window !== "undefined"
}

function saveStats(stats: StoredStats) {
  if (!isBrowser()) return
  window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats))
}

function dispatchStatsEvent(stats: StoredStats) {
  if (!isBrowser()) return
  window.dispatchEvent(new CustomEvent<StoredStats>(STATS_EVENT, { detail: stats }))
}

export function countEpisodesCompletedThisWeek(completions: Record<string, string>): number {
  const now = new Date()
  const startOfWeek = new Date(now)
  const day = startOfWeek.getDay()
  const diffToMonday = (day === 0 ? -6 : 1) - day
  startOfWeek.setHours(0, 0, 0, 0)
  startOfWeek.setDate(startOfWeek.getDate() + diffToMonday)

  return Object.values(completions).reduce((count, iso) => {
    if (!iso) return count
    const date = new Date(iso)
    if (Number.isNaN(date.valueOf())) return count
    if (date >= startOfWeek && date <= now) {
      return count + 1
    }
    return count
  }, 0)
}

function withDerivedCounts(stats: StoredStats): StoredStats {
  const autoCount = countEpisodesCompletedThisWeek(stats.episodeCompletions)
  return {
    ...stats,
    episodesCompletedThisWeek: autoCount,
  }
}

export function loadStats(): StoredStats {
  if (!isBrowser()) return { ...DEFAULT_STATS }
  try {
    const raw = window.localStorage.getItem(STATS_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATS }
    const parsed = JSON.parse(raw) as Partial<StoredStats>
    return withDerivedCounts({
      ...DEFAULT_STATS,
      ...parsed,
      episodeCompletions: parsed?.episodeCompletions ?? {},
    })
  } catch (error) {
    console.error("Failed to load stats", error)
    return { ...DEFAULT_STATS }
  }
}

type MutateOptions = {
  recomputeEpisodesCompleted?: boolean
  suppressTimestamp?: boolean
}

export function mutateStats(updater: (prev: StoredStats) => StoredStats, options?: MutateOptions): StoredStats {
  const previous = loadStats()
  let next = updater(previous)

  if (options?.recomputeEpisodesCompleted) {
    next = withDerivedCounts(next)
  }

  if (!options?.suppressTimestamp) {
    next = {
      ...next,
      lastUpdated: new Date().toISOString(),
    }
  }

  saveStats(next)
  dispatchStatsEvent(next)
  return next
}

export function resetStats(): StoredStats {
  const next = {
    ...DEFAULT_STATS,
    lastUpdated: new Date().toISOString(),
  }
  saveStats(next)
  dispatchStatsEvent(next)
  return next
}

export function subscribeToStats(listener: (stats: StoredStats) => void) {
  if (!isBrowser()) return () => {}
  const handler = (event: Event) => {
    const custom = event as CustomEvent<StoredStats>
    if (custom.detail) {
      listener(withDerivedCounts(custom.detail))
    } else {
      listener(loadStats())
    }
  }
  window.addEventListener(STATS_EVENT, handler as EventListener)
  return () => window.removeEventListener(STATS_EVENT, handler as EventListener)
}

export function setEpisodeCompletion(episodeId: string, complete: boolean): StoredStats {
  return mutateStats(
    (prev) => {
      const episodeCompletions = { ...prev.episodeCompletions }
      if (complete) {
        episodeCompletions[episodeId] = new Date().toISOString()
      } else {
        delete episodeCompletions[episodeId]
      }
      return { ...prev, episodeCompletions }
    },
    { recomputeEpisodesCompleted: true }
  )
}
