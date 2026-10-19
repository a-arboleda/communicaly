import jsPDF from "jspdf"

export type PracticePdfEntry = {
  number: number
  question: { prompt: string; support?: string; followUp?: string; function?: string }
  response: string
  rating?: number
}

const SLOGAN = "English doesn’t have to feel rushed to be real."
const printable = (text: string) => text.replace(/[\u2010-\u2015]/g, "-")

/** Shared by the download button and PDF layout checks. */
export function createPracticePdf(episodeTitle: string, entries: PracticePdfEntry[], showRatings = true) {
  const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" })
  pdf.setProperties({ title: `Practice responses - ${episodeTitle}`, author: "Communicaly", subject: SLOGAN })
  const width = pdf.internal.pageSize.getWidth()
  const height = pdf.internal.pageSize.getHeight()
  const margin = 48
  const bottom = height - 66
  const contentWidth = width - margin * 2
  let y = 0

  function font(size: number, style = "normal", color = "#34404b") {
    pdf.setFont("helvetica", style)
    pdf.setFontSize(size)
    pdf.setTextColor(color)
  }
  function newPage(first = false) {
    if (!first) pdf.addPage()
    pdf.setFont("times", "bolditalic")
    pdf.setFontSize(first ? 27 : 20)
    pdf.setTextColor("#294b38")
    pdf.text("Communicaly", margin, 52)
    font(10, "italic", "#647365")
    pdf.text(SLOGAN, margin, 71)
    pdf.setDrawColor("#d7e8f5")
    pdf.line(margin, 86, width - margin, 86)
    y = 111
    if (first) {
      font(9, "bold", "#477caa")
      pdf.text("PRACTICE PROMPTS", margin, y)
      y += 25
      font(21, "bold", "#214e70")
      const titleLines: string[] = pdf.splitTextToSize(printable(episodeTitle || "Your practice responses"), contentWidth)
      for (const line of titleLines) {
        if (y + 26 > bottom) { newPage(); font(21, "bold", "#214e70") }
        pdf.text(line, margin, y)
        y += 26
      }
      y += 13
    }
  }
  function ensureSpace(space: number) {
    if (y + space > bottom) newPage()
  }
  newPage(true)

  for (const { question, response, number, rating } of entries) {
    const lines: Array<{ text: string; style: string; size: number; color: string; leading: number }> = []
    const addLines = (text: string | undefined, style: string, size: number, color: string, leading: number) => {
      if (!text) return
      font(size, style, color)
      const wrapped: string[] = pdf.splitTextToSize(printable(text), contentWidth - 32)
      wrapped.forEach((line) => lines.push({ text: line, style, size, color, leading }))
    }
    addLines(`PROMPT ${number}${question.function ? `  /  ${question.function}` : ""}`, "bold", 9, "#477caa", 18)
    addLines(question.prompt, "bold", 13, "#214e70", 19)
    addLines(question.support, "normal", 10.5, "#4b657a", 16)
    addLines(question.followUp, "italic", 10.5, "#4b657a", 16)
    const fullHeight = lines.reduce((total, line) => total + line.leading, 0) + 24
    // Keep ordinary question cards with the opening of their response.
    ensureSpace(Math.min(fullHeight + 54, bottom - 111))
    while (lines.length) {
      ensureSpace(60)
      let used = 24
      let count = 0
      while (count < lines.length && y + used + lines[count].leading <= bottom - 32) {
        used += lines[count].leading
        count++
      }
      if (!count) { newPage(); continue }
      pdf.setFillColor("#eaf4fc")
      pdf.roundedRect(margin, y, contentWidth, used, 9, 9, "F")
      let baseline = y + 23
      for (const line of lines.splice(0, count)) {
        font(line.size, line.style, line.color)
        pdf.text(line.text, margin + 16, baseline)
        baseline += line.leading
      }
      y += used + 19
      if (lines.length) newPage()
    }
    const responseLabel = (continued = false) => {
      font(9, "bold", "#647365")
      pdf.text(continued ? `YOUR RESPONSE / PROMPT ${number} / CONTINUED` : "YOUR RESPONSE", margin + 4, y)
      y += 21
    }
    ensureSpace(42)
    responseLabel()
    font(11)
    const responseLines: string[] = pdf.splitTextToSize(printable(response), contentWidth - 8)
    for (const line of responseLines) {
      if (y + 17 > bottom) { newPage(); responseLabel(true) }
      font(11)
      pdf.text(line, margin + 4, y)
      y += 17
    }
    if (showRatings && rating && rating > 0) {
      ensureSpace(24)
      font(9, "normal", "#647365")
      pdf.text(`Self-reflection: ${Math.min(5, Math.max(0, rating))}/5`, margin + 4, y + 4)
      y += 24
    }
    y += 24
  }

  const pages = pdf.getNumberOfPages()
  for (let page = 1; page <= pages; page++) {
    pdf.setPage(page)
    pdf.setDrawColor("#d7e8f5")
    pdf.line(margin, height - 46, width - margin, height - 46)
    font(9, "normal", "#647365")
    pdf.text("Communicaly  /  Practice prompts", margin, height - 29)
    pdf.text(`${page} / ${pages}`, width - margin, height - 29, { align: "right" })
  }
  return pdf
}
