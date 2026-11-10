import Link from "next/link"
import HomePracticeMap from "@/components/HomePracticeMap"
import AudioPlayer from "@/components/AudioPlayer"

const practices = [
  { title: "I Finally Did My Laundry", topic: "Everyday life", href: "/episodes/i-finally-did-my-laundry-29" },
  { title: "When Meetings Run Long", topic: "Work & career", href: "/episodes/when-meetings-run-long-10" },
  { title: "Trust Takes Time", topic: "Relationships", href: "/episodes/trust-takes-time-9" },
  { title: "The Voice Message", topic: "Communication", href: "/episodes/the-voice-message-26" },
  { title: "Forgot What I Was Saying", topic: "Self-expression", href: "/episodes/forgot-what-i-was-saying-18" },
] as const

const featured = practices[0]
const bars = Array.from({ length: 51 }, (_, i) => Math.round(8 + 87 * Math.abs(Math.sin(i * 1.84) * Math.cos(i * .23))))

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl bg-white px-5 pt-[88px] font-sans text-[#182021] sm:px-9">
      <section className="grid items-center gap-10 border-t border-[#d9dfdf] py-14 md:grid-cols-[1.1fr_1fr] md:gap-14 md:py-24" aria-labelledby="home-title">
        <div>
          <h1 id="home-title" className="text-[clamp(3.2rem,6.8vw,5.6rem)] font-semibold leading-[0.98] tracking-[-0.065em]">Find your voice<br />in English.</h1>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-slate-600">Listen to an everyday story. Then tell your side of it.</p>
          <Link className="mt-7 inline-flex items-center gap-4 rounded-lg bg-[#2852d6] px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-800" href={featured.href}>Try the featured story <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="min-w-0 rounded-3xl bg-[#eff3ff] p-6 text-[#162852] sm:p-8">
          <div className="flex justify-between font-mono text-xs tracking-widest"><span>FEATURED STORY</span><span>EP. 29</span></div>
          <div className="my-5 flex h-24 items-center gap-[3px]" aria-hidden="true">
            {bars.map((height, i) => <span key={i} className="flex-1 rounded-full bg-[#2852d6]" style={{ height: height + "%" }} />)}
          </div>
          <h2 className="text-3xl font-semibold tracking-tight">{featured.title}</h2>
          <p className="mt-1 text-sm">Everyday life · Listening &amp; speaking</p>
          <AudioPlayer src="/audio/i-finally-did-my-laundry-29.mp3" pendingMessage="Open the episode to read along." />
        </div>
      </section>
      <HomePracticeMap />
      <section aria-labelledby="topics-title" className="border-t border-[#d9dfdf] py-9 sm:py-12">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="topics-title" className="text-3xl font-semibold tracking-tight">Five free practices</h2>
          <Link className="text-sm font-medium text-[#2852d6] hover:underline" href="/episodes">Browse the story library →</Link>
        </div>
        {practices.map(practice => (
          <Link key={practice.href} href={practice.href} className="group flex items-center justify-between gap-4 border-b border-[#e3e7ea] py-4 hover:text-[#2852d6]">
            <span className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-5"><strong className="text-lg font-medium">{practice.title}</strong><span className="text-sm text-slate-600">{practice.topic}</span></span>
            <span aria-hidden="true" className="text-[#2852d6]">↗</span>
          </Link>
        ))}
      </section>
    </div>
  )
}
