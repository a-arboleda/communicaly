"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

const expressions = ["catch up on", "put them away", "put off", "hang them up"]
const sentences = [
  ["I’ve been busy all week. Today I need to", "my laundry."],
  ["These clothes are dry. I should", "."],
  ["I keep finding other things to do because I want to", "doing the laundry."],
  ["The washing machine’s finished. The clothes are still wet, so I need to", "."],
]
type Result = "correct" | "retry" | null

function shuffled() {
  const items = [0, 1, 2, 3]
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

export default function ExpressionPractice() {
  const [order, setOrder] = useState([0, 1, 2, 3])
  const [slots, setSlots] = useState<(number | null)[]>([null, null, null, null])
  const [results, setResults] = useState<Result[]>([null, null, null, null])
  const [selected, setSelected] = useState<number | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [notice, setNotice] = useState("")
  const [drag, setDrag] = useState<{ id: number; x: number; y: number; width: number } | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const needsRetry = results.some((result) => result === "retry")
  const pointerGesture = useRef<{ id: number; pointerId: number; x: number; y: number; offsetX: number; offsetY: number; width: number; moved: boolean } | null>(null)

  function clearDrag() {
    pointerGesture.current = null
    setDrag(null)
    setHovered(null)
  }

  function cancelSelection() {
    clearDrag()
    setSelected(null)
    setNotice("Selection cancelled.")
  }
  const suppressClick = useRef(false)
  useEffect(() => { setOrder(shuffled()) }, [])

  useEffect(() => {
    // A release outside the page, lost capture, or a window switch must never
    // leave a floating token behind. Normal drops finish in onPointerUp first.
    const cancel = () => {
      if (!pointerGesture.current) return
      pointerGesture.current = null
      setDrag(null)
      setHovered(null)
      setSelected(null)
    }
    const release = (event: PointerEvent) => {
      if (event.pointerId === pointerGesture.current?.pointerId) cancel()
    }
    const hide = () => { if (document.hidden) cancel() }
    window.addEventListener("blur", cancel)
    window.addEventListener("pointerup", release)
    window.addEventListener("pointercancel", release)
    document.addEventListener("visibilitychange", hide)
    return () => {
      window.removeEventListener("blur", cancel)
      window.removeEventListener("pointerup", release)
      window.removeEventListener("pointercancel", release)
      document.removeEventListener("visibilitychange", hide)
    }
  }, [])

  useEffect(() => {
    if (!drag) return
    document.body.classList.add("expression-drag-active")
    return () => document.body.classList.remove("expression-drag-active")
  }, [!!drag])

  function move(id: number, destination: number | null) {
    if (!expressions[id] || needsRetry) return
    const origin = slots.indexOf(id)
    if ((origin >= 0 && results[origin] === "correct") || (destination !== null && results[destination] === "correct")) return
    if (origin === destination) { setSelected(null); return }
    const next = [...slots]
    const feedback = [...results]
    if (origin >= 0) { next[origin] = null; feedback[origin] = null }
    if (destination !== null) { next[destination] = id; feedback[destination] = null }
    setSlots(next)
    setResults(feedback)
    setSelected(null)
    setNotice(`${expressions[id]} ${destination === null ? "returned to the answer bank" : `placed in blank ${destination + 1}`}.`)
  }

  function token(id: number, locked = false, destination?: number) {
    return <button key={id} type="button" draggable={false} disabled={locked || needsRetry}
      aria-pressed={selected === id} aria-label={`${expressions[id]}${locked ? ", correct and kept in place" : ", select expression"}`}
      className={`expression-token ${destination !== undefined ? "is-placed" : ""} ${selected === id ? "is-selected" : ""} ${drag?.id === id ? "is-dragging" : ""}`}
      onClick={() => {
        if (suppressClick.current) { suppressClick.current = false; return }
        if (destination !== undefined && selected !== null && selected !== id) move(selected, destination)
        else setSelected(selected === id ? null : id)
      }}
      onMouseDown={(event) => event.preventDefault()}
      onLostPointerCapture={() => { if (pointerGesture.current?.id === id) cancelSelection() }}
      onPointerDown={(event) => {
        if (event.button !== 0 || !event.isPrimary) return
        event.preventDefault()
        event.currentTarget.focus({ preventScroll: true })
        window.getSelection()?.removeAllRanges()
        suppressClick.current = false
        const bounds = event.currentTarget.getBoundingClientRect()
        pointerGesture.current = { id, pointerId: event.pointerId, x: event.clientX, y: event.clientY, offsetX: event.clientX - bounds.left, offsetY: event.clientY - bounds.top, width: bounds.width, moved: false }
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => {
        const gesture = pointerGesture.current
        if (!gesture || gesture.pointerId !== event.pointerId) return
        if (event.buttons === 0) { cancelSelection(); return }
        event.preventDefault()
        if (gesture.moved || Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 8) {
          gesture.moved = true
          window.getSelection()?.removeAllRanges()
          setDrag({ id, x: event.clientX - gesture.offsetX, y: event.clientY - gesture.offsetY, width: gesture.width })
          const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-destination]")
          const destination = target?.dataset.destination
          setHovered(destination && (destination === "bank" || results[Number(destination)] !== "correct") ? destination : null)
        }
      }}
      onPointerCancel={cancelSelection}
      onPointerUp={(event) => {
        const gesture = pointerGesture.current
        if (!gesture || gesture.pointerId !== event.pointerId) return
        clearDrag()
        if (!gesture.moved) return
        event.preventDefault()
        setSelected(null)
        suppressClick.current = true
        window.setTimeout(() => { suppressClick.current = false }, 0)
        const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-destination]")
        if (target) move(gesture.id, target.dataset.destination === "bank" ? null : Number(target.dataset.destination))
      }}
    >{expressions[id]}</button>
  }

  function drop(event: React.DragEvent, destination: number | null) {
    event.preventDefault()
    const value = event.dataTransfer.getData("text/plain")
    if (/^[0-3]$/.test(value)) move(Number(value), destination)
  }

  return <section className="card expression-practice" aria-labelledby="little-practice" onKeyDown={(event) => { if (event.key === "Escape") cancelSelection() }}>
    <div className="card-body space-y-5">
      <h2 id="little-practice" className="text-xl font-semibold text-brand-700">A little practice</h2>
      <p>Drag each expression into the right blank. When you’re ready, check your answers.</p>
      <p id="expression-help" className="text-sm text-stone-600">You can also select an expression, then select a blank. Select a placed expression to move it or return it to the bank.</p>
      <div data-destination="bank" className={`expression-bank ${hovered === "bank" ? "is-drop-target" : ""}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => drop(event, null)} aria-label="Answer bank">
        {order.filter((id) => !slots.includes(id)).map((id) => token(id))}
        {slots.every((id) => id !== null) && <p className="text-sm text-stone-600">All expressions are in place.</p>}
        <button className="btn text-sm" type="button" disabled={selected === null || !slots.includes(selected)} onClick={() => { if (selected !== null) move(selected, null) }}>Return selected expression to bank</button>
      </div>
      {selected !== null && <div className="flex flex-wrap items-center gap-3 text-sm"><span>Selected: <strong>{expressions[selected]}</strong></span><button className="btn" onClick={cancelSelection}>Cancel selection</button></div>}
      <ol className="space-y-4">
        {sentences.map(([before, after], index) => <li key={index} className="rounded-2xl border border-stone-200 p-4 leading-relaxed">
          <div id={`sentence-${index}`}>{index + 1}. {before}{" "}
          <span data-destination={index} className={`expression-slot ${hovered === String(index) ? "is-drop-target" : ""}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => drop(event, index)}>
            {slots[index] !== null && token(slots[index], results[index] === "correct", index)}
            {slots[index] === null && <button type="button" className="expression-blank" aria-label={`Place selected expression in blank ${index + 1}`} aria-describedby={`sentence-${index} expression-help`} onClick={() => { if (selected !== null) move(selected, index); else setNotice("Select an expression first, then select a blank.") }}>Place expression here</button>}
          </span>{after === "." ? after : ` ${after}`}
            {results[index] && <span className={results[index] === "correct" ? "mt-2 block text-green-800" : "mt-2 block text-amber-900"}>{results[index] === "correct" ? "✓ Correct" : "↻ Not quite"}</span>}
          </div>
        </li>)}
      </ol>
      <div className="flex flex-wrap gap-3">
        {needsRetry ? <button className="btn btn-light-green" onClick={() => {
          setSlots(slots.map((id, index) => results[index] === "correct" ? id : null))
          setResults(results.map((result) => result === "correct" ? result : null))
          setSelected(null)
          setNotice("The expressions to try again are back in the bank. Your correct answers are kept in place.")
        }}>Try again</button> : <>
        <button className="btn btn-light-green" disabled={slots.some((id) => id === null)} onClick={() => {
          const next = slots.map((id, index): Result => id === index ? "correct" : "retry")
          setResults(next); setAttempted(true); setSelected(null)
          setNotice(next.every((result) => result === "correct") ? "You’ve got them all!" : next.map((result, index) => `Blank ${index + 1}: ${result === "correct" ? "Correct" : "Not quite"}.`).join(" "))
        }}>Check answers</button>
        {attempted && <button className="btn" onClick={() => { setSlots([0, 1, 2, 3]); setResults(["correct", "correct", "correct", "correct"]); setSelected(null); setNotice("Answers revealed. " + expressions.map((expression, index) => `Blank ${index + 1}: ${expression}.`).join(" ")) }}>Show answers</button>}
        <button className="btn" onClick={() => { setSlots([null, null, null, null]); setResults([null, null, null, null]); setAttempted(false); setSelected(null); setOrder(shuffled()); setNotice("Ready for another go. The answer bank has been shuffled.") }}>Start again</button>
        </>}
      </div>
      {results.every((result) => result === "correct") && <p className="font-semibold text-green-800">You’ve got them all!</p>}
      <p role="status" aria-live="polite" aria-atomic="true" className={`text-sm text-stone-600 ${notice === "You’ve got them all!" ? "sr-only" : notice.startsWith("Blank ") ? "sr-only sm:not-sr-only" : ""}`}>{notice}</p>
    </div>
    {drag && createPortal(<div aria-hidden="true" className="expression-token expression-drag-preview" style={{ position: "fixed", pointerEvents: "none", zIndex: 10000, left: drag.x, top: drag.y, width: drag.width }}>{expressions[drag.id]}</div>, document.body)}
  </section>
}
