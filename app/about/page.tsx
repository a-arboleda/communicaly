import Link from "next/link"

export default function About() {
  return (
    <article className="space-y-10 max-w-3xl">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl text-brand-900">Everyday English you’ll actually use</h1>
        <p className="text-sm sm:text-base text-gray-700">
          Communicaly was created for people who don’t want to just study English — but live in it.
        </p>
        <p className="text-sm sm:text-base text-gray-700">
          I noticed that many learners understand English well, yet still hesitate when it’s time to speak or express something personal.
          Not because they don’t know the rules, but because real-life English feels different from what we’re taught.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-serif text-3xl sm:text-4xl text-brand-900">What this is</h2>
        <p className="text-sm sm:text-base text-gray-700">
          Communicaly is a calm, practical space to build real-life English at your own pace.
        </p>
        <p className="text-sm sm:text-base text-gray-700">
          The stories and prompts are simple and familiar, pulled from everyday moments, so you can reflect, practice, and sound more like yourself.
        </p>
      </section>

      <section className="card bg-[#E6E1DE] text-[#0F0C13]">
        <div className="card-body space-y-4">
          <p className="text-sm sm:text-base text-gray-700">My English journey</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-brand-900">From first book to confident voice</h2>
          <div className="space-y-4">
            <p className="text-sm sm:text-base text-gray-700">
              I’ve been learning English since I was 15. My first introduction was an old English book I found at home.
              That book gave me a foundation, but I didn’t have chances to practice pronunciation or watch movies and shows in English, so speaking stayed difficult.
            </p>
            <p className="text-sm sm:text-base text-gray-700">
              I kept going—taking lessons and even spending a couple years in Australia—and still felt something was missing.
              I was usually translating in my head instead of speaking with real fluency.
            </p>
            <p className="text-sm sm:text-base text-gray-700">
              As a Spanish tutor and an English learner, I realized how little attention we give to building an identity in the new language.
              Yet that’s the difference-maker: shaping how you sound, the words you choose, and how you show your personality.
              When your English reflects you, confidence grows and speaking feels natural instead of stressful.
            </p>
            <p className="text-sm sm:text-base text-gray-700">
              That’s why I created Communicaly—a space focused on small, everyday activities and on practicing the vocabulary you’ll actually use.
              Building your identity in English isn’t just practice; it’s the path to speaking with confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-3xl sm:text-4xl text-brand-900">Why it works</h2>
        <ul className="space-y-2 text-sm sm:text-base text-gray-700 list-disc list-inside">
          <li><strong>Personalized language:</strong> you practice phrases you’ll actually say.</li>
          <li><strong>Short + consistent:</strong> small daily practice beats long sessions.</li>
          <li><strong>Low mental load:</strong> familiar topics make speaking easier.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-3xl sm:text-4xl text-brand-900">How to use the episodes</h2>
        <ol className="space-y-2 text-sm sm:text-base text-gray-700 list-decimal list-inside">
          <li>Listen once through to catch the story’s main idea and feeling.</li>
          <li>Shadow short segments—pause, repeat, and match the speaker’s rhythm.</li>
          <li>Respond to the question using your own examples.</li>
          <li>Flip the communication cards to practice prompts you’d use with a tutor or partner.</li>
          <li>Use the tutor and student drills to roleplay, then jot quick notes for next time.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-3xl sm:text-4xl text-brand-900">Who it’s for</h2>
        <p className="text-sm sm:text-base text-gray-700">
          Communicaly is for adult English learners who already understand English but want to feel more confident using it in real life.
        </p>
        <p className="text-sm sm:text-base text-gray-700">
          It’s especially helpful if you’re tired of textbooks and want to sound more natural, thoughtful, and yourself in English.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-brand-200/60 bg-white/80 p-6">
        <p className="text-sm sm:text-base text-gray-700">
          If you’re looking for a calmer, more human way to practice English, you’re in the right place.
        </p>
        <div className="flex justify-center">
          <Link href="/episodes" className="btn btn-primary">
            Start listening
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-3xl sm:text-4xl text-brand-900">FAQ</h2>
        <div className="space-y-2 text-sm sm:text-base text-gray-700">
          <p><strong>Do I need an account?</strong> No. Your inputs save locally in your browser.</p>
          <p><strong>Can I use this on my phone?</strong> Yes, pages are mobile-friendly.</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-3xl sm:text-4xl text-brand-900">Contact</h2>
        <p className="text-sm sm:text-base text-gray-700">
          Questions or ideas? Email me at <a href="mailto:hello@communicaly.com" className="text-brand-900">hello@communicaly.com</a>.
        </p>
      </section>
    </article>
  )
}
