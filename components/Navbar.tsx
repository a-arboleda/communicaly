// components/Navbar.tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/", label: "Home" },
  { href: "/episodes", label: "Episodes" },
  { href: "/about", label: "About" },
]

export default function Navbar() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <nav className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="inline-flex items-center gap-2">
            <span className="inline-grid place-items-center w-7 h-7 rounded-lg shadow-card"
                  style={{ background: "linear-gradient(135deg,#E0AFA0,#f7e7df)" }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12c4-8 12-8 16 0-4 8-12 8-16 0Z"/><path d="M9 12h6"/>
              </svg>
            </span>
            Communicaly
          </span>
        </Link>
        <ul className="flex gap-6 text-sm">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`hover:underline ${pathname === l.href ? "font-semibold" : ""}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
