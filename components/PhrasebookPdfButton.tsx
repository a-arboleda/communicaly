"use client"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { useRef } from "react"

export default function PhrasebookPdfButton() {
  const ref = useRef<HTMLDivElement>(null)

  async function handleExport() {
    const el = ref.current
    if (!el) return
    const canvas = await html2canvas(el)
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = (canvas.height * pageWidth) / canvas.width
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight)
    pdf.save("phrasebook.pdf")
  }

  return (
    <div className="space-y-4">
      <div ref={ref} className="border rounded-xl p-4">
        <h3 className="font-semibold mb-2">My Phrasebook</h3>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>“Could you say that again, a bit slower?”</li>
          <li>“Let me make sure I understood…”</li>
          <li>“Here’s how I’d say it…”</li>
        </ul>
      </div>
      <button onClick={handleExport} className="px-3 py-2 rounded-xl border">
        Export PDF
      </button>
    </div>
  )
}
