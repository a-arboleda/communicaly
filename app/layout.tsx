// app/layout.tsx
import type { Metadata } from "next"
import "@/app/globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Inter, Playfair_Display } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: "Communicaly",
  description: "Daily reflections for English learners — active listening & shadowing.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
