export default function About() {
  return (
    <article className="space-y-10 max-w-3xl mx-auto">
      <header className="space-y-2">
        <p className="text-sm text-gray-600 text-center">Home • About</p>
        <h1 className="font-serif text-3xl font-bold text-center">Everyday English you’ll actually use</h1>
        <p className="text-gray-700 mx-auto text-center">
          Short, natural audios about daily life. Each episode ends with a simple question so you write what{" "}
          <em>you</em> would say in a real conversation—no random vocabulary, only words that fit your life.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-semibold">What this is</h2>
        <p className="text-gray-700">
          Communicaly is a library of short, natural audios about everyday life—coffee chats, commute small talk, quiet evenings at home.
          Pick an episode, listen for a minute, then open its interactive page to answer the closing question and rewrite the story with
          details from your own life.
        </p>
      </section>

      <section className="card bg-[#E6E1DE] text-[#0F0C13]">
        <div className="card-body space-y-4">
          <p className="tag tag-accent w-fit">My English journey</p>
          <h2 className="font-journey-script text-4xl sm:text-5xl font-medium text-center tracking-tight">From first book to confident voice</h2>
          <div className="space-y-4 font-serif text-lg leading-relaxed">
            <p>
              I’ve been learning English since I was 15. My first introduction was an old English book I found at home.
              That book gave me a foundation, but I didn’t have chances to practice pronunciation or watch movies and shows in English, so speaking stayed difficult.
            </p>
            <p>
              I kept going—taking lessons and even spending a couple years in Australia—and still felt something was missing.
              I was usually translating in my head instead of speaking with real fluency.
            </p>
            <p>
              As a Spanish tutor and an English learner, I realized how little attention we give to building an identity in the new language.
              Yet that’s the difference-maker: shaping how you sound, the words you choose, and how you show your personality.
              When your English reflects you, confidence grows and speaking feels natural instead of stressful.
            </p>
            <p>
              That’s why I created Communicaly—a space focused on small, everyday activities and on practicing the vocabulary you’ll actually use.
              Building your identity in English isn’t just practice; it’s the path to speaking with confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-semibold">Why it works</h2>
        <ul className="space-y-2 text-gray-700 list-disc list-inside">
          <li><strong>Personalized language:</strong> you practice phrases you’ll actually say.</li>
          <li><strong>Short + consistent:</strong> small daily practice beats long sessions.</li>
          <li><strong>Low mental load:</strong> familiar topics make speaking easier.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-semibold">How to use the episodes</h2>
        <ol className="space-y-2 text-gray-700 list-decimal list-inside">
          <li>Listen once through to catch the story’s main idea and feeling.</li>
          <li>Shadow short segments—pause, repeat, and match the speaker’s rhythm.</li>
          <li>Respond to the question using your own examples.</li>
          <li>Flip the communication cards to practice prompts you’d use with a tutor or partner.</li>
          <li>Use the tutor and student drills to roleplay, then jot quick notes for next time.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-semibold">Who it’s for</h2>
        <p className="text-gray-700">
          Anyone learning English who wants to build their identity in the language, and tutors who need ready-to-go lessons to light up real conversations.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-semibold">What’s next</h2>
        <ul className="space-y-2 text-gray-700 list-disc list-inside">
          <li>New episodes weekly across themes (Routines, Errands, Home, Social, Media, Weather).</li>
          <li>Optional email updates with new posts and printables.</li>
          <li>Future: tags, favorites, and downloadable packs.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-semibold">FAQ</h2>
        <div className="space-y-2 text-gray-700">
          <p><strong>Do I need an account?</strong> No. Your inputs save locally in your browser.</p>
          <p><strong>Can I use this on my phone?</strong> Yes, pages are mobile-friendly.</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-semibold">Contact</h2>
        <p className="text-gray-700">
          Questions or ideas? Email me at <a href="mailto:communicaly@gmail.com" className="text-brand-900">communicaly@gmail.com</a>.
        </p>
      </section>
    </article>
  )
}
