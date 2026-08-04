// components/Navbar.tsx
"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const links = [
  { href: "/", label: "Home" },
  { href: "/conversation-frameworks", label: "Frameworks" },
  { href: "/episodes", label: "Episodes" },
  { href: "/practice-lab", label: "Practice Lab" },
  { href: "/about", label: "About" },
] as const

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  // No pre-selected item on load; set after user clicks or path change
  const [selectedHref, setSelectedHref] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)

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
    function handleScroll() {
      setIsScrolled(window.scrollY > 8)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    function handleResize() {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    function handleMouseDown(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [menuOpen])

  function handleNavClick(href: string) {
    setSelectedHref(href)
    setMenuOpen(false)
  }
  const isActive = (href: string) => selectedHref === href

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 h-[88px] w-full overflow-visible print:hidden transition-colors duration-300 ease-out ${
        menuOpen
          ? isHome ? "bg-[#F8F3EA]" : "bg-white"
          : isHome
            ? isScrolled
              ? "bg-[#F8F3EA]/90 backdrop-blur-md"
              : "bg-transparent"
            : isScrolled
              ? "bg-white/70 backdrop-blur-md"
            : "bg-transparent"
      }`}
    >
      <nav className="h-full w-full" aria-label="Primary">
        <div className="mx-auto grid h-full w-full max-w-[1380px] grid-cols-[auto_1fr_auto] items-center px-4 text-[13px] text-[#1F1F1F] sm:px-8 md:grid-cols-[230px_1fr_230px] lg:px-10">
          <Link
            href="/"
            className="justify-self-start transition-opacity duration-150 ease-out opacity-100"
          >
            <Image
              src="/images/communicaly-logo.png"
              alt="Communicaly"
              width={240}
              height={70}
              className="h-[47px] w-[160px] origin-left scale-y-[0.78] md:h-[70px] md:w-[240px] md:scale-y-[0.72]"
              priority
            />
          </Link>
          <ul className="hidden items-center justify-center gap-8 text-sm md:flex md:translate-x-8 md:justify-self-center">
            {links.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  onClick={() => handleNavClick(l.href)}
                  className="hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E2E2E] focus-visible:ring-offset-2"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="justify-self-end md:w-[240px] md:flex md:justify-end">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[#1F1F1F] transition hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E2E2E] focus-visible:ring-offset-2 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
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
                <g>
                  <path d="M4 6H20" />
                  <path d="M4 12H20" />
                  <path d="M4 18H20" />
                </g>
              </svg>
            </button>
          </div>
        </div>
        <div
          className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ease-out md:hidden ${
            menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!menuOpen}
        />
        <div
          id="mobile-menu"
          ref={panelRef}
          className={`fixed right-0 top-0 z-50 flex h-full w-[82vw] max-w-[320px] flex-col px-6 pb-8 pt-6 shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none md:hidden ${
            isHome ? "bg-[#F8F3EA]" : "bg-white"
          } ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold tracking-tight">Communicaly</span>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-md text-[#1F1F1F] transition hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E2E2E] focus-visible:ring-offset-2"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
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
                <path d="M6 6L18 18" />
                <path d="M6 18L18 6" />
              </svg>
            </button>
          </div>
          <ul className="mt-10 space-y-3 text-base">
            {links.map(l => (
              <li key={`${l.href}-mobile`}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  onClick={() => handleNavClick(l.href)}
                  className="block rounded-md px-1 py-1 transition hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E2E2E] focus-visible:ring-offset-2"
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
