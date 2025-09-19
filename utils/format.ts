export function displayTitle(title?: string) {
  if (!title) return ""
  // Remove leading "Episode {number} -/–/—/: " patterns
  return title.replace(/^\s*Episode\s*\d+\s*[-–—:]\s*/i, "").trim()
}

