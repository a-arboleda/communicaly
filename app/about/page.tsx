import Link from "next/link"

export default function About() {
  return (
    <article className="signal-page mx-auto max-w-4xl space-y-8">
      <header className="max-w-2xl space-y-3">
        <h1>About Communicaly</h1>
        <p className="text-sm sm:text-base text-gray-700">
          Communicaly was created for people who don’t want to just study English — but live in it.
        </p>
        <p className="text-sm sm:text-base text-gray-700">
          I noticed that many learners understand English well, yet still hesitate when it’s time to speak or express something personal.
          Not because they don’t know the rules, but because real-life English feels different from what we’re taught.
        </p>
      </header>

      <section className="grid gap-x-8 gap-y-2 border-t border-slate-200 pt-6 sm:grid-cols-[1fr_2fr] sm:[&>:not(h2)]:col-start-2">
        <h2 className="text-2xl font-semibold">What this is</h2>
        <p className="text-sm sm:text-base text-gray-700">
          Communicaly is a calm, practical space to build real-life English at your own pace.
        </p>
        <p className="text-sm sm:text-base text-gray-700">
          The stories and prompts are simple and familiar, pulled from everyday moments, so you can reflect, practice, and sound more like yourself.
        </p>
      </section>

      <section className="grid gap-x-8 gap-y-2 border-t border-slate-200 pt-6 sm:grid-cols-[1fr_2fr] sm:[&>:not(h2)]:col-start-2">
        <h2 className="text-2xl font-semibold">Why it works</h2>
        <ul className="space-y-2 text-sm sm:text-base text-gray-700 list-disc list-inside">
          <li><strong>Personalized language:</strong> you practice phrases you’ll actually say.</li>
          <li><strong>Short + consistent:</strong> small daily practice beats long sessions.</li>
          <li><strong>Low mental load:</strong> familiar topics make speaking easier.</li>
        </ul>
      </section>

      <section className="grid gap-x-8 gap-y-2 border-t border-slate-200 pt-6 sm:grid-cols-[1fr_2fr] sm:[&>:not(h2)]:col-start-2">
        <h2 className="text-2xl font-semibold">How to use the episodes</h2>
        <ol className="space-y-2 text-sm sm:text-base text-gray-700 list-decimal list-inside">
          <li>Listen once through to catch the story’s main idea and feeling.</li>
          <li>Shadow short segments—pause, repeat, and match the speaker’s rhythm.</li>
          <li>Respond to the question using your own examples.</li>
          <li>Open “Explore more questions” and choose a speaking skill to practice.</li>
          <li>Record an answer and review the transcript in your own words.</li>
        </ol>
      </section>

      <section className="grid gap-x-8 gap-y-2 border-t border-slate-200 pt-6 sm:grid-cols-[1fr_2fr] sm:[&>:not(h2)]:col-start-2">
        <h2 className="text-2xl font-semibold">Who it’s for</h2>
        <p className="text-sm sm:text-base text-gray-700">
          Communicaly is for adult English learners who already understand English but want to feel more confident using it in real life.
        </p>
        <p className="text-sm sm:text-base text-gray-700">
          It’s especially helpful if you’re tired of textbooks and want to sound more natural, thoughtful, and yourself in English.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl bg-[#eff3ff] p-6">
        <p className="text-sm sm:text-base text-gray-700">
          If you’re looking for a calmer, more human way to practice English, you’re in the right place.
        </p>
        <div className="flex justify-center">
          <Link href="/episodes" className="signal-action">
            Start listening
          </Link>
        </div>
      </section>

      <section className="grid gap-x-8 gap-y-2 border-t border-slate-200 pt-6 sm:grid-cols-[1fr_2fr] sm:[&>:not(h2)]:col-start-2">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="space-y-2 text-sm sm:text-base text-gray-700">
          <p><strong>Do I need an account?</strong> No. Your inputs save locally in your browser.</p>
          <p><strong>Can I use this on my phone?</strong> Yes, pages are mobile-friendly.</p>
        </div>
      </section>

      <section className="grid gap-x-8 gap-y-2 border-t border-slate-200 pt-6 sm:grid-cols-[1fr_2fr] sm:[&>:not(h2)]:col-start-2">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p className="text-sm sm:text-base text-gray-700">
          Questions or ideas? Email me at <a href="mailto:hello@communicaly.com" className="text-[#2852d6] underline">hello@communicaly.com</a>.
        </p>
      </section>
    </article>
  )
}
