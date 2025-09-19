// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t mt-16 print:hidden">
      <div className="container py-10 text-sm text-gray-600">
        <p>© {new Date().getFullYear()} <strong>Communicaly</strong> — built for active listening & shadowing.</p>
        <p className="mt-2 inline-flex items-center gap-2 flex-wrap">
          Also on YouTube:
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
            <span>YouTube</span>
          </a>
        </p>
      </div>
    </footer>
  )
}
