import type { ReactNode } from "react"

function defaultIdFromTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

export default function EpisodeSectionCard({
  title,
  id,
  children,
}: {
  title: string
  id?: string
  children: ReactNode
}) {
  const sectionId = id ?? defaultIdFromTitle(title)

  return (
    <section id={sectionId} className="not-prose card scroll-mt-20">
      <div className="card-body space-y-4">
        <h2 className="font-semibold text-lg text-gray-900">{title}</h2>
        <div className="prose max-w-none text-gray-800">{children}</div>
      </div>
    </section>
  )
}
