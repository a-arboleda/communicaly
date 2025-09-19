type Props = { title: string; children: React.ReactNode; open?: boolean }

export default function Details({ title, children, open = false }: Props) {
  return (
    <details className="my-4 group" open={open}>
      <summary
        className="no-tap-highlight cursor-pointer list-none group inline-flex items-center gap-2 px-1.5 py-0.5 rounded-lg border border-transparent bg-white text-gray-700 hover:bg-brand-200/60 hover:text-brand-900 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 active:scale-[0.99]"
      >
        <svg
          className="h-4 w-4 shrink-0 text-gray-600 transition-transform duration-200 ease-out transform-gpu group-open:rotate-180 group-hover:-translate-y-0.5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
        <span className="transition-transform duration-200 ease-out transform-gpu group-hover:-translate-y-0.5">{title}</span>
      </summary>
      <div className="mt-2 grid overflow-hidden transition-all duration-300 ease-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
        <div className="min-h-0 rounded-xl border bg-white/60 p-3 opacity-0 group-open:opacity-100 transition-opacity duration-300 ease-out">
          {children}
        </div>
      </div>
    </details>
  )
}
