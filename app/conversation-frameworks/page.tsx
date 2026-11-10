import Link from "next/link"
import { frameworks } from "@/components/conversation-frameworks/frameworkData"

export default function ConversationFrameworksPage() {
  const recommended = frameworks[0]
  return (
    <div className="signal-page space-y-10 pb-10">
      <header className="space-y-3">
        <h1>Conversation frameworks</h1>
        <p className="max-w-xl text-lg text-slate-600">Choose a situation and practice building a clear response in English.</p>
        {recommended && <a href="#recommendation" className="inline-block py-2 font-medium text-[#2852d6] hover:underline">See recommended framework ↓</a>}
      </header>
      <section id="frameworks" className="scroll-mt-28 space-y-4 border-t border-slate-200 pt-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#182021]">
            Choose a situation
          </h2>
          <p className="text-sm text-gray-600">
            Choose the moment you are in, and we will suggest a framework.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {frameworks.map(framework => (
            <Link
              key={framework.id}
              href={`/conversation-frameworks/${framework.slug}`}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition-[border-color,box-shadow] duration-200 hover:border-blue-300 hover:bg-[#f6f8ff]"
            >
              <div className="flex w-full items-center justify-between gap-4">
                <div>
                  <p className="text-base font-medium text-[#182021]">{framework.situationLabel}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#2852d6]">
                    {framework.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {framework.summary}
                  </p>
                </div>
                <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-gray-500">
                  Open
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {recommended ? (
        <section id="recommendation" className="scroll-mt-28 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[#182021]">Recommended framework</h2>
            <p className="text-sm text-gray-600">
              A framework we suggest based on the most common situations.
            </p>
          </div>
          <div className="rounded-2xl bg-[#eff3ff]">
            <div className="card-body space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Framework</p>
                <h3 className="text-xl font-semibold text-[#182021]">
                  {recommended.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {recommended.summary}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Example</p>
                <div className="space-y-1 text-sm text-gray-700">
                  {recommended.exampleAnswer.map(line => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <Link
                href={`/conversation-frameworks/${recommended.slug}`}
                className="signal-action"
              >
                Practice this framework
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
