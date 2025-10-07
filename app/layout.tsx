// app/layout.tsx
import type { Metadata } from "next"
import "@/app/globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"


const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })
const journeyScript = Dancing_Script({ subsets: ["latin"], variable: "--font-journey-script" })

export const metadata: Metadata = {
  title: {
    default: "Communicaly | Daily English speaking practice you'll actually use",
    template: "%s | Communicaly",
  },
  description:
    "Communicaly helps English learners sound like themselves with short audio stories, interactive prompts, and daily speaking drills that build a confident voice.",
  keywords: [
    "Communicaly",
    "daily English practice",
    "English speaking exercises",
    "listening and shadowing",
    "ESL conversation prompts",
  ],
  openGraph: {
    type: "website",
    title: "Communicaly | Daily English speaking practice you'll actually use",
    description:
      "Daily English audio stories, reflection prompts, and speaking drills to help you sound like yourself in every conversation.",
  },
  twitter: {
    card: "summary",
    title: "Communicaly | Daily English speaking practice you'll actually use",
    description:
      "Daily audio reflections and interactive prompts designed to help English learners build a confident, natural voice.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${journeyScript.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.jpg" />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        <Navbar />
        {/* Print-only brand header (repeats on each page) */}
        <div className="hidden print:flex print:fixed print:top-0 print:left-0 print:right-0 print:z-50 print:bg-brand-200 items-center gap-3 px-6 py-3 border-b">
          <strong className="text-base">Communicaly — My Phrasebook</strong>
        </div>
        <main className="container py-8 print:mt-28">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  )
}
