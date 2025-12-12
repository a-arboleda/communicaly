// components/PracticeJournal.tsx
"use client"
import { useEffect, useMemo, useState } from "react"
import jsPDF from "jspdf"

type Cat = "short" | "reflective" | "personal" | "conversation" | "summary"
type RgbColor = [number, number, number]

const QUESTION_TEMPLATES: Record<Cat, string> = {
  short: "What do you think of what you just heard?",
  reflective: "What stood out to you in this audio?",
  personal: "Have you experienced something similar? Describe it.",
  conversation: "How would you respond in a real conversation?",
  summary: "In 1–2 sentences, what’s your take?",
}

export default function PracticeJournal({
  episodeId,
  audioTitle,
  textAnswerQuestionsOverride,
  inline = false,
}: {
  episodeId: string
  audioTitle?: string
  textAnswerQuestionsOverride?: Partial<Record<Cat, string>>
  inline?: boolean
}) {
  const STORAGE_EP = useMemo(() => `ep:${episodeId}`, [episodeId])
  const [answer, setAnswer] = useState("")

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_EP)
      if (raw) {
        const s = JSON.parse(raw)
        if (s.answer) setAnswer(String(s.answer))
      }
    } catch {}
  }, [STORAGE_EP, episodeId])

  // Read per-question text answers on demand (new UI stores them separately)
  function readTextAnswers(): Array<{ key: Cat; label: string; question: string; text: string }> {
    try {
      const base = `ep:${episodeId}:textAnswer`
      const defs: Array<{ key: string; label: string }> = [
        { key: "short", label: "Short/neutral" },
        { key: "reflective", label: "Reflective" },
        { key: "personal", label: "Personal" },
        { key: "conversation", label: "Conversation style" },
        { key: "summary", label: "Summary" },
      ]
      const items: Array<{ key: Cat; label: string; question: string; text: string }> = []
      for (const d of defs) {
        const v = localStorage.getItem(`${base}:${d.key}:value`)
        if (v && v.trim()) {
          const k = d.key as Cat
          const q = (textAnswerQuestionsOverride && textAnswerQuestionsOverride[k]) || QUESTION_TEMPLATES[k]
          items.push({ key: k, label: d.label, question: q, text: String(v).trim() })
        }
      }
      // Back‑compat: old single key or EpisodeInteractive answer
      if (items.length === 0) {
        const legacy1 = localStorage.getItem(`${base}:value`)
        if (legacy1 && legacy1.trim()) items.push({ key: "short", label: "Short/neutral", question: QUESTION_TEMPLATES.short, text: legacy1.trim() })
        else if (answer && answer.trim()) items.push({ key: "short", label: "Short/neutral", question: QUESTION_TEMPLATES.short, text: answer.trim() })
      }
      return items
    } catch {
      return []
    }
  }

  async function exportJournal() {
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" })
    let pageWidth = pdf.internal.pageSize.getWidth()
    let pageHeight = pdf.internal.pageSize.getHeight()
    const marginX = 56
    const contentWidth = pageWidth - marginX * 2
    const footerHeight = 56
    const makeSafe = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    const epSafe = makeSafe((audioTitle || episodeId || "episode").toString())

    const textPrimary: RgbColor = [58, 47, 37]
    const textSecondary: RgbColor = [104, 95, 85]
    const accentLine: RgbColor = [189, 166, 136]
    const cardBorder: RgbColor = [217, 209, 199]
    const cardFill: RgbColor = [253, 251, 247]
    const headerBand: RgbColor = [236, 231, 222]
    const pageBackground: RgbColor = [249, 246, 240]
    let pageNumber = 1

    const setTextColor = ([r, g, b]: RgbColor) => pdf.setTextColor(r, g, b)
    const setFillColor = ([r, g, b]: RgbColor) => pdf.setFillColor(r, g, b)
    const setDrawColor = ([r, g, b]: RgbColor) => pdf.setDrawColor(r, g, b)
    const fillPageBackground = () => {
      setFillColor(pageBackground)
      pdf.rect(0, 0, pageWidth, pageHeight, "F")
    }

    const drawFooter = () => {
      setDrawColor(accentLine)
      pdf.setLineWidth(0.6)
      pdf.line(marginX, pageHeight - footerHeight, pageWidth - marginX, pageHeight - footerHeight)
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(9)
      setTextColor(textSecondary)
      pdf.text(`Communicaly Practice Journal • Page ${pageNumber}`, marginX, pageHeight - footerHeight + 28)
    }

    const drawHeader = (firstPage: boolean) => {
      fillPageBackground()
      setFillColor(headerBand)
      pdf.rect(0, 0, pageWidth, 88, "F")
      if (firstPage) {
        setTextColor(textPrimary)
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(18)
        pdf.text("Communicaly Practice Journal", marginX, 52)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(11)
        pdf.text("Captured reflections to guide your next session.", marginX, 70)
        if (audioTitle) {
          const normalizedTitle = audioTitle.trim()
          const label = normalizedTitle.toLowerCase().startsWith("episode")
            ? normalizedTitle
            : `Episode • ${normalizedTitle}`
          pdf.setFont("helvetica", "bold")
          pdf.setFontSize(11)
          const textWidth = pdf.getTextWidth(label)
          const padX = 16
          const badgeWidth = textWidth + padX * 2
          const badgeHeight = 22
          const badgeY = 24
          const badgeX = pageWidth - marginX - badgeWidth
          setFillColor(cardFill)
          setDrawColor(cardBorder)
          pdf.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 11, 11, "FD")
          setTextColor(textPrimary)
          pdf.text(label, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2 + 3.5, { align: "center" })
        }
        return 140
      }

      setTextColor(textPrimary)
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(12)
      pdf.text("Communicaly Practice Journal", marginX, 44)
      return 120
    }

    let y = drawHeader(true)

    const ensureSpace = (required: number) => {
      if (y + required <= pageHeight - footerHeight) return
      drawFooter()
      pdf.addPage()
      pageNumber += 1
      pageWidth = pdf.internal.pageSize.getWidth()
      pageHeight = pdf.internal.pageSize.getHeight()
      y = drawHeader(false)
    }

    const addSectionTitle = (title: string, helper?: string) => {
      const helperLines = helper ? pdf.splitTextToSize(helper, contentWidth) : []
      const helperHeight = helperLines.length > 0 ? helperLines.length * 14 + 6 : 0
      ensureSpace(34 + helperHeight)
      setTextColor(textPrimary)
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(13)
      pdf.text(title, marginX, y)
      setDrawColor(accentLine)
      pdf.setLineWidth(0.8)
      pdf.line(marginX, y + 6, pageWidth - marginX, y + 6)
      y += 18
      if (helperLines.length > 0) {
        setTextColor(textSecondary)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(11)
        pdf.text(helperLines, marginX, y)
        y += helperHeight + 8
      }
    }

    const addAnswerCard = (heading: string, body: string) => {
      const headingLines = pdf.splitTextToSize(heading, contentWidth - 32)
      const bodyLines = pdf.splitTextToSize(body, contentWidth - 32)
      const cardHeight = headingLines.length * 14 + bodyLines.length * 16 + 40
      ensureSpace(cardHeight + 20)
      setFillColor(cardFill)
      setDrawColor(cardBorder)
      pdf.roundedRect(marginX, y, contentWidth, cardHeight, 14, 14, "FD")
      setTextColor(textPrimary)
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(11)
      pdf.text(headingLines, marginX + 20, y + 24)
      const textYOffset = headingLines.length * 14 + 24
      setTextColor(textSecondary)
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(11)
      pdf.text(bodyLines, marginX + 20, y + textYOffset)
      y += cardHeight + 20
    }

    // Your thoughts (supports per-question answers)
    addSectionTitle("Your Thoughts", "Keep these notes handy for review before your next speaking session.")
    const perQs = readTextAnswers()
    if (perQs.length === 0) {
      const a = (answer || "(no answer recorded)").trim()
      addAnswerCard("Journal Entry", a)
    } else {
      for (const item of perQs) {
        const heading = `${item.label} • ${item.question}`
        addAnswerCard(heading, item.text)
      }
    }

    ensureSpace(24)
    setTextColor(textSecondary)
    pdf.setFont("helvetica", "italic")
    pdf.setFontSize(10)
    pdf.text("Tip: Revisit this journal before your next session to reconnect with your strongest insights.", marginX, y)

    drawFooter()
    pdf.save(`practice-journal-${epSafe}.pdf`)
  }

  if (inline) {
    return (
      <div className="mt-6">
        <h3 className="font-semibold">Practice Journal</h3>
        <p className="text-sm text-gray-600 mt-1">Download a PDF with your thoughts, phrases, and reflection questions.</p>
        <div className="mt-3">
          <button onClick={exportJournal} className="btn btn-light-green">Download PDF</button>
        </div>
      </div>
    )
  }

  return (
    <section className="card scroll-mt-20">
      <div className="card-body">
        <h3 className="font-semibold">Practice Journal</h3>
        <p className="text-sm text-gray-600 mt-1">Download a PDF with your thoughts, phrases, and reflection questions.</p>
        <div className="mt-3">
          <button onClick={exportJournal} className="btn btn-light-green">Download PDF</button>
        </div>
      </div>
    </section>
  )
}
