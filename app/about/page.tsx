export default function About() {
  return (
    <article className="prose max-w-none prose-headings:text-black">
      <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm text-gray-600">
        About this project
      </p>
      <h1>Everyday English you’ll actually use</h1>
      <p className="text-gray-700">
        Short, natural audios about daily life. Each episode ends with a simple question so you write what
        <em>you</em> would say in a real conversation—no random vocabulary, only words that fit your life.
      </p>

      <h2>What this is</h2>
      <p>
        A growing library of short audios about ordinary moments: coffee, commuting, cooking, cleaning, chatting with a friend, and more.
        Each episode links to an interactive page where you answer a question and build sentences that match your reality.
      </p>

      <h2>Watch on YouTube</h2>
      <p className="inline-flex items-center gap-2 flex-wrap">
        Some episodes include short video segments hosted on our YouTube channel. If you prefer watching there or want to support the project,
        subscribe here:
        <a
          className="inline-flex items-center gap-1 rounded-full bg-red-600 text-white px-2 py-0.5 text-xs font-semibold hover:bg-red-500 transition-colors no-underline hover:no-underline"
          href="https://www.youtube.com/channel/UCB_cZrc77ZPV8ArS72sZpmg"
          target="_blank"
          rel="noreferrer"
          aria-label="Communicaly on YouTube (opens in a new tab)"
        >
          <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="text-white">YouTube</span>
        </a>
      </p>

      <h2>Why it works</h2>
      <ul>
        <li><strong>Personalized language:</strong> you practice phrases you’ll actually say.</li>
        <li><strong>Short + consistent:</strong> small daily practice beats long sessions.</li>
        <li><strong>Low mental load:</strong> familiar topics make speaking easier.</li>
      </ul>

      <h2>How to use the episodes</h2>
      <ol>
        <li>Listen to the short audio.</li>
        <li>Answer the question at the end (in your own words).</li>
        <li>On the interactive page, fill the <em>Your context</em> boxes to personalize details.</li>
        <li>Click sentence starters to draft natural phrases. Edit them to sound like you.</li>
        <li>(Optional) Print or download your page to keep a practice log.</li>
      </ol>

      <h2>Who it’s for</h2>
      <p>Busy learners, professionals, and anyone who wants to sound natural in everyday conversations without memorizing textbook phrases.</p>

      <h2>What’s next</h2>
      <ul>
        <li>New episodes weekly across themes (Routines, Errands, Home, Social, Media, Weather).</li>
        <li>Optional email updates with new posts and printables.</li>
        <li>Future: tags, favorites, and downloadable packs.</li>
      </ul>

      <h2>FAQ</h2>
      <p><strong>Do I need an account?</strong> No. Your inputs save locally in your browser.</p>
      <p><strong>Can I use this on my phone?</strong> Yes, pages are mobile-friendly.</p>

      <h2>Contact</h2>
      <p>
        Questions or ideas? Email me at
        {" "}
        <a href="mailto:communicaly@gmail.com">communicaly@gmail.com</a>
      </p>
    </article>
  )
}
