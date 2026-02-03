// components/AppShell.tsx
"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <>
      <Navbar />
      {isHome ? (
        <main className="pb-8 pt-[120px] print:mt-28">{children}</main>
      ) : (
        <>
          <main className="container pb-8 pt-[120px] print:mt-28">{children}</main>
          <Footer />
        </>
      )}
    </>
  )
}
