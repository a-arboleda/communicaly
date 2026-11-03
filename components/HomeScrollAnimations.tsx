"use client"

import { useEffect } from "react"

/**
 * Progressive enhancement: content stays visible when JavaScript is unavailable.
 * Reveal animation is activated only when IntersectionObserver is supported and
 * the user has not requested reduced motion.
 */
export default function HomeScrollAnimations() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (media.matches || !("IntersectionObserver" in window)) return

    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-home-reveal]"))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add("home-revealed")
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -28px 0px" }
    )

    nodes.forEach((node) => {
      if (node.getBoundingClientRect().top < window.innerHeight * 0.94) return
      node.classList.add("home-reveal-pending")
      observer.observe(node)
    })

    return () => {
      observer.disconnect()
      nodes.forEach((node) => node.classList.remove("home-reveal-pending", "home-revealed"))
    }
  }, [])

  return null
}
