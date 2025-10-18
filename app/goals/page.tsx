import type { Metadata } from "next"
import GoalsPlanner from "@/components/GoalsPlanner"
import { getAllEpisodes } from "@/utils/episodes"

export const metadata: Metadata = {
  title: "Goals",
  description: "Define your English identity, set weekly targets, and download your personalized plan.",
}

export default function GoalsPage() {
  const episodes = getAllEpisodes()

  return <GoalsPlanner totalEpisodes={episodes.length} />
}
