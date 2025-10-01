#!/usr/bin/env bash
set -euo pipefail

# make folders
mkdir -p components utils content/episodes app/about app/episodes/[slug]

# utils
cat > utils/episodes.ts <<'EOF'
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const EP_DIR = path.join(process.cwd(), "content/episodes");

export type EpisodeMeta = {
  title: string;
  date: string;
  audioUrl?: string;
  tags?: string[];
  excerpt?: string;
};

export function getAllEpisodes() {
  if (!fs.existsSync(EP_DIR)) return [] as any[];
  const files = fs.readdirSync(EP_DIR).filter((f) => f.endsWith(".mdx"));
  const items = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(EP_DIR, filename), "utf8");
    const { data } = matter(raw);
    return { slug, ...(data as EpisodeMeta) };
  });
  return items.sort(
    (a: any, b: any) =>
      new Date(b.date).valueOf() - new Date(a.date).valueOf()
  );
}

export function getEpisode(slug: string) {
  const full = path.join(EP_DIR, slug + ".mdx");
  if (!fs.existsSync(full)) return null;
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as EpisodeMeta, content };
}
EOF

# components
cat > components/Navbar.tsx <<'EOF'
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
    <header className="border-b bg-white sticky top-0 z-40">
      <nav className="max-w-4xl mx-auto px-4 flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          Communicaly
        </Link>
        <ul className="flex gap-6 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`hover:underline ${
                  pathname === l.href ? "font-semibold" : ""
                }`}
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
EOF

cat > components/Footer.tsx <<'EOF'
export default function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Communicaly — Active listening & shadowing.</p>
      </div>
    </footer>
  )
}
EOF

cat > components/AudioPlayer.tsx <<'EOF'
"use client"

export default function AudioPlayer({ src }: { src?: string }) {
  if (!src) return null
  return (
    <audio controls className="w-full mt-4">
      <source src={src} />
      Your browser does not support the audio element.
    </audio>
  )
}
EOF

# app pages
cat > app/layout.tsx <<'EOF'
import type { Metadata } from "next"
import "@/app/globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "Communicaly",
  description: "Daily reflections for English learners — active listening & shadowing.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
EOF

cat > app/page.tsx <<'EOF'
import Link from "next/link"

export default function Home() {
  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">
          Your everyday English — short audios, real conversations
        </h1>
        <p className="text-gray-700 max-w-2xl">
          Listen to a quick story, then answer a simple question about <em>your</em> life.
          Each episode links to an interactive page where you build sentences you’d actually use.
        </p>
      </header>

      <div className="flex gap-3">
        <Link href="/episodes" className="px-4 py-2 rounded-xl border">Browse Episodes</Link>
        <Link href="/about" className="px-4 py-2 rounded-xl border">About</Link>
      </div>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">What is this?</h2>
        <p className="text-gray-700 max-w-3xl">
          Short, natural audios about everyday life. Each episode ends with a question for you.
          Click an episode to open its <strong>interactive practice page</strong> where you answer, add personal details,
          and write what you would actually say in a real conversation.
          No random vocabulary — only phrases that fit your life.
        </p>
      </section>
    </section>
  )
}
EOF

cat > app/about/page.tsx <<'EOF'
export default function About() {
  return (
    <article className="prose max-w-none">
      <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm text-gray-600">
        About this project
      </p>
      <h1>Everyday English you’ll actually use</h1>
      <p className="text-gray-700">
        Short, natural audios about daily life. Each episode ends with a simple question so you write what
        <em>you</em> would say in a real conversation—no random vocabulary, only words that fit your life.
      </p>

      <h2>What this is</h2>
      <p>
        A growing library of short audios about ordinary moments: coffee, commuting, cooking, cleaning, chatting with a friend, and more.
        Each episode links to an interactive page where you answer a question and build sentences that match your reality.
      </p>

      <h2>Why it works</h2>
      <ul>
        <li><strong>Personalized language:</strong> you practice phrases you’ll actually say.</li>
        <li><strong>Short + consistent:</strong> small daily practice beats long sessions.</li>
        <li><strong>Low mental load:</strong> familiar topics make speaking easier.</li>
      </ul>

      <h2>How to use the episodes</h2>
      <ol>
        <li>Listen to the short audio.</li>
        <li>Answer the question at the end (in your own words).</li>
        <li>On the interactive page, fill the <em>Your context</em> boxes to personalize details.</li>
        <li>Click sentence starters to draft natural phrases. Edit them to sound like you.</li>
        <li>(Optional) Print or download your page to keep a practice log.</li>
      </ol>

      <h2>Who it’s for</h2>
      <p>Busy learners, professionals, and anyone who wants to sound natural in everyday conversations without memorizing textbook phrases.</p>

      <h2>What’s next</h2>
      <ul>
        <li>New episodes weekly across themes (Routines, Errands, Home, Social, Media, Weather).</li>
        <li>Optional email updates with new posts and printables.</li>
        <li>Future: tags, favorites, and downloadable packs.</li>
      </ul>

      <h2>FAQ</h2>
      <p><strong>Do I need an account?</strong> No. Your inputs save locally in your browser.</p>
      <p><strong>Can I use this on my phone?</strong> Yes, pages are mobile-friendly.</p>
      <p><strong>Where can I listen?</strong> Right on each episode page, or on YouTube/Spotify if you publish them.</p>

      <h2>Contact</h2>
      <p>Questions or ideas? <a href="mailto:hello@speakbetterdaily.example">Email me</a></p>
    </article>
  )
}
EOF

cat > app/episodes/page.tsx <<'EOF'
import Link from "next/link"
import { getAllEpisodes } from "@/utils/episodes"

export const dynamic = 'force-static'
export const runtime = 'nodejs'

export default function Episodes() {
  const episodes = getAllEpisodes()
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm text-gray-600">Home • Episodes</p>
        <h1 className="text-3xl font-bold">All Episodes</h1>
        <p className="text-gray-700">
          Short, everyday audios. Click any episode to open its interactive practice page.
        </p>
      </div>

      <ul className="space-y-4">
        {episodes.length === 0 && (
          <li className="text-gray-600">
            No episodes yet. Add an <code>.mdx</code> file to <code>content/episodes</code>.
          </li>
        )}
        {episodes.map(ep => (
          <li key={ep.slug} className="border rounded-2xl p-5 bg-white">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                  <Link href={`/episodes/${ep.slug}`}>{ep.title}</Link>
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(ep.date).toLocaleDateString()}
                </p>
                {ep.excerpt && <p className="text-gray-700 mt-1">{ep.excerpt}</p>}
              </div>
              <Link href={`/episodes/${ep.slug}`} className="px-3 py-2 rounded-xl border shrink-0">
                Open
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
EOF

cat > app/episodes/[slug]/page.tsx <<'EOF'
import { notFound } from "next/navigation"
import { getAllEpisodes, getEpisode } from "@/utils/episodes"
import { MDXRemote } from "next-mdx-remote/rsc"
import AudioPlayer from "@/components/AudioPlayer"
import remarkGfm from "remark-gfm"

export const dynamic = 'force-static'
export const runtime = 'nodejs'

export async function generateStaticParams(){
  return getAllEpisodes().map(e=>({ slug: e.slug }))
}

export default function EpisodePage({ params }: { params: { slug: string } }){
  const ep = getEpisode(params.slug)
  if(!ep) return notFound()
  const { frontmatter, content } = ep

  return (
    <article className="prose max-w-none">
      <h1>{frontmatter.title}</h1>
      <p className="text-sm text-gray-600">{new Date(frontmatter.date).toLocaleDateString()}</p>
      <AudioPlayer src={frontmatter.audioUrl} />
      <div className="mt-6">
        <MDXRemote source={content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>
      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-xl font-semibold">Record yourself</h2>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Save to My Phrasebook</h2>
        </section>
      </div>
    </article>
  )
}
EOF

# content example
mkdir -p public/audio
  cat > content/episodes/morning-coffee-1.mdx <<'EOF'
---
title: "Episode 1 — Morning Coffee"
date: "2025-08-20"
audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav"
excerpt: "Interactive practice: listen, answer, record yourself (with self-rating), and save your personal phrasebook (PDF export)."
tags: ["routines","coffee"]
question: "How about you? Do you usually make your coffee at home, or buy it outside?"
---

<span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm text-gray-600">Episode 1</span>

# Morning Coffee

Listen • Answer • **Record yourself** (with self-rating) • Save your phrases (PDF export)

<details>
  <summary><strong>Transcript (optional)</strong></summary>
  Hey… so, I always start my day with coffee. Sometimes I brew it at home… other days I just grab one on my way to work. That first sip—mm—it always feels like the real beginning of my day.
</details>

---

###
EOF

echo "✅ Files added."
