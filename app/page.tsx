// app/page.tsx
import Link from "next/link"
import VoiceWaves from "@/components/VoiceWaves"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans text-[#1F1F1F]">
      <section
        className="relative isolate flex min-h-[600px] items-center overflow-hidden bg-[#F8F3EA] px-[clamp(24px,6vw,100px)] pb-14 pt-[112px] sm:min-h-[620px] sm:pb-16 sm:pt-[118px] lg:min-h-[min(620px,41.45vw)]"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, #fffdf8 0%, #f8f3ea 55%, #f1e8dc 100%)",
        }}
      >
        <VoiceWaves />
        <div className="relative z-10 mx-auto flex w-full max-w-[620px] items-center justify-center -translate-y-4 sm:-translate-y-5">
          <div className="relative w-full text-center">
            <h1 className="font-serif text-[clamp(2.9rem,5vw,4.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-[#1E1D1A]">
              Speak with clarity.
            </h1>
            <p className="mx-auto mt-5 max-w-[380px] text-[1.05rem] leading-[1.55] text-[#35332F] sm:text-[1.12rem]">
              Find the right words and
              <br className="hidden sm:block" /> sound like yourself.
            </p>
            <div className="mt-7">
              <Link
                href="/conversation-frameworks"
                className="inline-flex items-center justify-center rounded-md bg-[#C94E16] px-6 py-3.5 text-[13px] font-semibold text-white shadow-[0_7px_20px_rgba(117,48,19,0.12)] transition-[transform,background-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#A93F11] hover:shadow-[0_10px_24px_rgba(117,48,19,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48675C] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8F3EA] motion-reduce:transform-none motion-reduce:transition-none"
              >
                Start practicing
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="container relative z-10 py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex h-full flex-col items-center rounded-2xl border border-neutral-200/70 bg-white p-8 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-neutral-300 hover:shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E7F2F0] text-[#2F7B75]">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 3h6a2 2 0 0 1 2 2v3h-2a2 2 0 0 0-2 2v2h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-3h2a2 2 0 0 0 2-2v-2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
              </svg>
            </div>
            <p className="mt-5 text-lg font-semibold text-neutral-800">Frameworks</p>
            <div className="mx-auto mt-4 h-px w-16 bg-neutral-200/80" />
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              Learn simple conversation frameworks that help you know what to say and how to
              say it—depending on the situation.
            </p>
            <Link
              href="/conversation-frameworks"
              className="mt-auto inline-flex items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-[#2F7B75] transition hover:border-neutral-300 hover:shadow-sm"
            >
              Explore frameworks →
            </Link>
          </div>
          <div className="flex h-full flex-col items-center rounded-2xl border border-neutral-200/70 bg-white p-8 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-neutral-300 hover:shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF1F6] text-[#4A6F8F]">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12V9a8 8 0 0 1 16 0v3" />
                <rect x="2" y="12" width="4" height="7" rx="2" />
                <rect x="18" y="12" width="4" height="7" rx="2" />
                <path d="M8 19a4 4 0 0 0 8 0" />
              </svg>
            </div>
            <p className="mt-5 text-lg font-semibold text-neutral-800">Episodes</p>
            <div className="mx-auto mt-4 h-px w-16 bg-neutral-200/80" />
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              Listen to short, real-life stories and observe how ideas, emotions, and answers
              flow naturally in English.
            </p>
            <Link
              href="/episodes"
              className="mt-auto inline-flex items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-[#4A6F8F] transition hover:border-neutral-300 hover:shadow-sm"
            >
              Listen to episodes →
            </Link>
          </div>
          <div className="flex h-full flex-col items-center rounded-2xl border border-neutral-200/70 bg-white p-8 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-neutral-300 hover:shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1EEE6] text-[#7C6A4B]">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 7h16" />
                <path d="M6 7v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" />
              </svg>
            </div>
            <p className="mt-5 text-lg font-semibold text-neutral-800">Practice Lab</p>
            <div className="mx-auto mt-4 h-px w-16 bg-neutral-200/80" />
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              Practice daily-life phrasal verbs through quizzes.
            </p>
            <Link
              href="/practice-lab"
              className="mt-auto inline-flex items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-[#7C6A4B] transition hover:border-neutral-300 hover:shadow-sm"
            >
              Start practicing →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
