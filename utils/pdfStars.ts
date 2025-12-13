import type { jsPDF } from "jspdf"

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, fill: boolean) {
  let rot = Math.PI / 2 * 3
  let x = cx
  let y = cy
  const step = Math.PI / spikes
  ctx.beginPath()
  ctx.moveTo(cx, cy - outerRadius)
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius
    y = cy + Math.sin(rot) * outerRadius
    ctx.lineTo(x, y)
    rot += step
    x = cx + Math.cos(rot) * innerRadius
    y = cy + Math.sin(rot) * innerRadius
    ctx.lineTo(x, y)
    rot += step
  }
  ctx.closePath()
  if (fill) ctx.fill()
  else ctx.stroke()
}

export function addStarsToPdf(pdf: jsPDF, x: number, y: number, total: number, size: number, filled: number, spacing = 6, fillColor = "#FFB703", emptyColor = "#E5E7EB") {
  if (typeof document === "undefined") return
  const canvas = document.createElement("canvas")
  const width = Math.round(total * size + (total - 1) * spacing)
  const height = Math.round(size)
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")!

  ctx.clearRect(0, 0, width, height)
  ctx.lineWidth = Math.max(1, size / 10)
  ctx.lineJoin = "round"
  for (let i = 0; i < total; i++) {
    const cx = i * (size + spacing) + size / 2
    const cy = height / 2
    const outer = size / 2
    const inner = outer * 0.5
    if (i < filled) {
      ctx.fillStyle = fillColor
      ctx.strokeStyle = fillColor
      drawStar(ctx, cx, cy, 5, outer, inner, true)
    } else {
      ctx.fillStyle = emptyColor
      ctx.strokeStyle = emptyColor
      drawStar(ctx, cx, cy, 5, outer, inner, false)
    }
  }
  const dataUrl = canvas.toDataURL("image/png")
  const drawW = width
  const drawH = height
  pdf.addImage(dataUrl, "PNG", x, y - drawH / 2, drawW, drawH)
}

export default addStarsToPdf
