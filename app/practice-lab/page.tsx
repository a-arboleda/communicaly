// app/practice-lab/page.tsx
import EpisodeDrills from "@/components/EpisodeDrills"

export const dynamic = "force-static"
export const runtime = "nodejs"

export default function PracticePhrasesPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm text-gray-600">Home • Practice Lab</p>
        <h1 className="font-serif text-3xl font-bold">Practice Lab — Keep your English moving ✨</h1>
        <p className="text-gray-700 max-w-2xl">
          Play “Pick One” — a fast, fun multiple‑choice game with phrases from each episode. Choose an episode and beat your streak over 10 speedy rounds. 🎯
        </p>
      </header>

      <section className="card">
        <div className="card-body">
          <EpisodeDrills />
        </div>
      </section>
    </article>
  )
}
