import Link from "next/link"
import VoiceWaves from "@/components/VoiceWaves"
import HomeScrollAnimations from "@/components/HomeScrollAnimations"

const topics = [
  { label: "01 / EVERYDAY LIFE", title: "The little things", description: "Ordinary moments, meaningful stories.", hue: "cream" },
  { label: "02 / WORK & CAREER", title: "The life you build", description: "Ambition, balance, changes and choices.", hue: "sage" },
  { label: "03 / RELATIONSHIPS", title: "People & connection", description: "Friendships, family and what matters to us.", hue: "clay" },
]

const steps = [
  { number: "01", title: "Listen", description: "Start with a short story or a conversation worth thinking about." },
  { number: "02", title: "Reflect", description: "Find your perspective. A memory, a feeling, or just a thought." },
  { number: "03", title: "Speak", description: "Say it in your words, at your pace. No perfect answers needed." },
  { number: "04", title: "Make it yours", description: "Keep the expressions that fit your life and revisit your voice." },
]

export default function Home() {
  return (
    <div className="communicaly-home">
      <HomeScrollAnimations />
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-waves" aria-hidden="true"><VoiceWaves /></div>
        <div className="home-hero-glow" aria-hidden="true" />
        <div className="home-shell home-hero-grid">
          <div className="home-hero-copy">
            <p className="home-eyebrow home-rise">ENGLISH, AT YOUR OWN PACE</p>
            <h1 id="home-title" className="home-display home-rise home-delay-1">
              Your thoughts.<br />
              <em>Your words.</em><br />
              Your voice.
            </h1>
            <p className="home-lead home-rise home-delay-2">
              More than English practice. A space to listen, reflect and express what matters to you — without the pressure to sound perfect.
            </p>
            <div className="home-actions home-rise home-delay-3">
              <Link className="home-button home-button-primary" href="/episodes">
                Explore audio stories <span aria-hidden="true">↗</span>
              </Link>
              <Link className="home-text-link" href="#how-it-works">
                See how it works <span aria-hidden="true">↓</span>
              </Link>
            </div>
            <p className="home-hero-note home-rise home-delay-3">Listen first. Speak when you&apos;re ready.</p>
          </div>

          <div className="home-preview-wrap home-rise home-delay-2">
            <div className="home-preview-orbit" aria-hidden="true" />
            <div className="home-preview">
              <div className="home-preview-top">
                <span className="home-preview-dot" aria-hidden="true" />
                <span>A MOMENT TO REFLECT</span>
                <span className="home-preview-mark" aria-hidden="true">✳</span>
              </div>
              <div className="home-preview-art" aria-hidden="true">
                <div className="home-preview-sun" />
                <div className="home-preview-hill home-preview-hill-back" />
                <div className="home-preview-hill home-preview-hill-front" />
                <div className="home-preview-waves"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
              </div>
              <div className="home-preview-body">
                <p className="home-preview-kicker">STORY / PERSONAL GROWTH</p>
                <h2>When did you last surprise yourself?</h2>
                <p>Sometimes the most interesting stories are our own.</p>
                <div className="home-preview-audio" aria-label="Illustration of an audio experience">
                  <span className="home-play-symbol" aria-hidden="true">▶</span>
                  <span className="home-audio-track" aria-hidden="true"><span /></span>
                  <span className="home-preview-audio-label">Listen · Reflect · Speak</span>
                </div>
                <Link className="home-preview-link" href="/episodes">
                  Find your next story <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
            <span className="home-floating-note">No grades. No pressure. Just you.</span>
          </div>
        </div>
        <div className="home-bottom-swoop" aria-hidden="true" />
      </section>

      <section data-home-reveal className="home-manifesto home-shell" aria-labelledby="manifesto-title">
        <p className="home-eyebrow">A DIFFERENT KIND OF PRACTICE</p>
        <h2 id="manifesto-title">
          You don&apos;t have to be fluent to have <em>something worth saying.</em>
        </h2>
        <p>
          You already have stories, opinions and experiences. Communicaly helps you find the English to share them — one conversation at a time.
        </p>
      </section>

      <section id="how-it-works" className="home-method" aria-labelledby="method-title">
        <div className="home-shell">
          <div data-home-reveal className="home-section-heading">
            <div>
              <p className="home-eyebrow">THE COMMUNICALY EXPERIENCE</p>
              <h2 id="method-title">Make space for <em>your voice.</em></h2>
            </div>
            <p>Simple, meaningful practice designed around what you want to say.</p>
          </div>
          <div data-home-reveal className="home-step-grid">
            {steps.map((step) => (
              <div className="home-step" key={step.number}>
                <span className="home-step-number">{step.number}</span>
                <div className="home-step-rule" aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-topics home-shell" aria-labelledby="topics-title">
        <div data-home-reveal className="home-section-heading">
          <div>
            <p className="home-eyebrow">WHAT'S ON YOUR MIND?</p>
            <h2 id="topics-title">Real life makes the <em>best conversations.</em></h2>
          </div>
          <Link className="home-text-link" href="/episodes">Browse all stories <span aria-hidden="true">↗</span></Link>
        </div>
        <div data-home-reveal className="home-topic-grid">
          {topics.map((topic) => (
            <Link href="/episodes" className={"home-topic-card home-topic-" + topic.hue} key={topic.label}>
              <span className="home-topic-caption">{topic.label}</span>
              <div className="home-topic-ornament" aria-hidden="true"><span /><span /><span /></div>
              <div className="home-topic-info">
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
              </div>
              <span className="home-topic-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-quiet-section">
        <div className="home-shell home-quiet-grid">
          <div data-home-reveal className="home-quiet-decor" aria-hidden="true">
            <span className="home-quiet-circle home-quiet-circle-one" />
            <span className="home-quiet-circle home-quiet-circle-two" />
            <span className="home-quiet-quote">“Your voice matters.”</span>
          </div>
          <div data-home-reveal className="home-quiet-copy">
            <p className="home-eyebrow">PRACTICE FOR EXPRESSION, NOT PERFECTION</p>
            <h2>Your story doesn&apos;t need <em>better words.</em> It needs room to breathe.</h2>
            <p>Try a story, think about your own experience, and speak naturally. You can start again, pause, or simply enjoy listening.</p>
            <Link className="home-button home-button-primary" href="/episodes">Start a reflection <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="home-resources home-shell" aria-labelledby="resources-title">
        <div data-home-reveal className="home-section-heading">
          <div>
            <p className="home-eyebrow">MORE WAYS TO EXPLORE</p>
            <h2 id="resources-title">Support for <em>your own way</em> of speaking.</h2>
          </div>
        </div>
        <div data-home-reveal className="home-resource-grid">
          <Link href="/conversation-frameworks" className="home-resource-link">
            <span className="home-resource-icon" aria-hidden="true">✳</span>
            <div><h3>Conversation frameworks</h3><p>Gentle structure for when you want help organizing your thoughts.</p></div>
            <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/practice-lab" className="home-resource-link">
            <span className="home-resource-icon" aria-hidden="true">◌</span>
            <div><h3>Practice Lab</h3><p>Explore everyday expressions and make them your own.</p></div>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="home-final-cta">
        <div data-home-reveal className="home-shell home-final-content">
          <p className="home-eyebrow">COME AS YOU ARE</p>
          <h2>The process is <em>the point.</em></h2>
          <p>A little curiosity is all you need to begin.</p>
          <Link className="home-button home-button-light" href="/episodes">Find something to talk about <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  )
}
