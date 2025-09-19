// components/EpisodeQuickNav.tsx
"use client"

export default function EpisodeQuickNav() {
  const items = [
    { href: "#listen", label: "Listen", icon: "🎧" },
    { href: "#answer", label: "Respond", icon: "📝" },
    { href: "#record", label: "Record", icon: "🎙️" },
    { href: "#phrasebook", label: "Save Phrases", icon: "💾" },
  ]

  return (
    <div className="not-prose mt-[1em] mb-[1em]">
      <nav className="flex flex-wrap items-center gap-1 p-0.5 rounded-xl bg-white/80">
        {items.map((it, idx) => (
          <span key={it.href} className="inline-flex items-center">
            {idx > 0 && (
              <span className="mx-1 text-gray-400 select-none" aria-hidden>
                →
              </span>
            )}
            <a
              href={it.href}
              className="no-tap-highlight no-underline hover:no-underline focus:no-underline active:no-underline visited:no-underline decoration-transparent hover:decoration-transparent focus:decoration-transparent active:decoration-transparent visited:decoration-transparent group inline-flex items-center gap-2 px-1.5 py-0.5 rounded-lg border border-transparent bg-white text-gray-700 hover:bg-brand-200/60 hover:text-brand-900 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
              aria-label={it.label}
            >
              <span aria-hidden className="transition-transform duration-200 ease-out transform-gpu group-hover:-translate-y-0.5">{it.icon}</span>
              <span className="transition-transform duration-200 ease-out transform-gpu group-hover:-translate-y-0.5">{it.label}</span>
            </a>
          </span>
        ))}
      </nav>
    </div>
  )
}
