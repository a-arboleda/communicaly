"use client"

import Image from "next/image"

export default function EpisodeHero({
  slug,
  imageUrl,
  imageAlt,
}: {
  slug: string
  imageUrl?: string
  imageAlt?: string
}) {
  // Default per-episode imagery if not provided via frontmatter
  let fallbackUrl: string | undefined
  let fallbackAlt: string | undefined

  if (slug === "morning-coffee-1") {
    // Default to the common path you saved
    fallbackUrl = "/images/morning-coffee-1.png"
    fallbackAlt = "Animated woman drinking coffee"
  }
  if (slug === "cooking-dinner-2") {
    // Fallback path for Episode 2
    fallbackUrl = "/images/cooking-dinner-2.png"
    fallbackAlt = "Animated person cooking dinner"
  }
  if (slug === "a-budget-dilemma-5") {
    fallbackUrl = "/images/a-budget-dilemma-5.png"
    fallbackAlt = "Illustration of someone balancing decor choices with a budget"
  }

  const src = imageUrl || fallbackUrl
  const alt = imageAlt || fallbackAlt || "Episode illustration"

  return (
    <div className="mt-2">
      {src ? (
        <div className="relative w-full overflow-hidden rounded-2xl border">
          <div className="w-full h-[240px] sm:h-[300px] md:h-[340px] lg:h-[380px]">
            <Image
              src={src}
              alt={alt}
              fill
              priority={false}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        </div>
      ) : (
        // Graceful fallback: soft gradient with emoji hint
        <div className="rounded-2xl border bg-gradient-to-r from-brand-100 to-white p-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden>☕️</span>
            <p className="text-gray-700">
              A quick visual to set the vibe for this episode.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
