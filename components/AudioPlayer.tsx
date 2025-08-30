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
