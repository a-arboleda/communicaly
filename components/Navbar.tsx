// components/Navbar.tsx
"use client"
import Link from "next/link"
import type { Route } from "next"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const links = [
  { href: "/", label: "Home" },
  { href: "/episodes", label: "Episodes" },
  { href: "/practice-lab", label: "Practice Lab" },
  { href: "/about", label: "About" },
] as const satisfies ReadonlyArray<{ href: Route; label: string }>

export default function Navbar() {
  const pathname = usePathname()
  // No pre-selected item on load; set after user clicks or path change
  const [selectedHref, setSelectedHref] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setSelectedHref(pathname || null)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    function handleResize() {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [menuOpen])

  function handleNavClick(href: Route) {
    setSelectedHref(href)
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b print:hidden">
      <nav className="container">
        <div className="relative flex h-14 items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            Communicaly
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-sm text-gray-600 transition hover:bg-brand-200/60 hover:text-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(open => !open)}
          >
            <span className="sr-only">Menu</span>
            <svg
              aria-hidden
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? (
                <path d="M6 6L18 18M6 18L18 6" />
              ) : (
                <g>
                  <path d="M4 6H20" />
                  <path d="M4 12H20" />
                  <path d="M4 18H20" />
                </g>
              )}
            </svg>
          </button>
          <ul className="hidden gap-2 text-sm md:flex">
            {links.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={selectedHref === l.href ? "page" : undefined}
                  onClick={() => handleNavClick(l.href)}
                  className={`px-3 py-1.5 rounded-lg border transition transform-gpu duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 active:translate-y-0 motion-reduce:transition-none no-tap-highlight ${
                    selectedHref === l.href
                      ? "bg-brand-700 text-white border-brand-700 shadow-card"
                      : "border-transparent hover:bg-brand-200/60 hover:text-brand-900 hover:shadow-card hover:-translate-y-0.5"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={`md:hidden transition-[max-height,opacity] duration-200 ease-out overflow-hidden ${
            menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="space-y-1 pb-3 pt-2 text-sm">
            {links.map(l => (
              <li key={`${l.href}-mobile`}>
                <Link
                  href={l.href}
                  aria-current={selectedHref === l.href ? "page" : undefined}
                  onClick={() => handleNavClick(l.href)}
                  className={`block rounded-lg border px-3 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 no-tap-highlight ${
                    selectedHref === l.href
                      ? "bg-brand-700 text-white border-brand-700 shadow-card"
                      : "border-gray-100 bg-white/80 text-gray-700 hover:bg-brand-200/60 hover:text-brand-900"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
