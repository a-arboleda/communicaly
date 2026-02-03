// app/page.tsx
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans text-[#1F1F1F]">
      <section className="relative flex min-h-screen items-center">
        <div className="absolute inset-0 z-0">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bg-image.jpg')" }}
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={{ background: "color-mix(in oklab, var(--color-black) 45%, transparent)" }}
            aria-hidden
          />
        </div>
        <div className="container relative z-10 flex items-center justify-center">
          <div className="w-full max-w-[640px] text-center">
          <h1 className="text-[48px] font-semibold tracking-[-0.02em] text-white sm:text-[64px]">
            Speak with clarity.
          </h1>
          <p className="mt-4 inline-block text-[20px] leading-[1.7] text-white sm:text-[20px] font-serif">
            Find the right words and sound like yourself.
          </p>
          <div className="mt-8">
            <Link
              href="/conversation-frameworks"
              className="inline-flex items-center justify-center rounded-lg bg-[#C24A0D] px-8 py-3 text-[15px] font-bold text-white shadow-sm transition hover:translate-y-[-1px] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C24A0D] focus-visible:ring-offset-2"
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
