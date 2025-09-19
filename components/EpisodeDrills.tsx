"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ALL_ITEMS, type DeckItem } from "@/data/phrases"

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim()
}

export default function EpisodeDrills() {
  const search = useSearchParams()
  const router = useRouter()
  const [ep, setEp] = useState<string>("")
  const [index, setIndex] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [started, setStarted] = useState(false)
  const [session, setSession] = useState<DeckItem[]>([])
  const [sessionOptions, setSessionOptions] = useState<string[][]>([])
  const [gameId, setGameId] = useState(0)
  const [progress, setProgress] = useState<Array<{ attempts: number; correct: boolean; selected?: string; scored: boolean; reveal: boolean; disabled: boolean }>>([])
  const [disabled, setDisabled] = useState(false)
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; size: number; color: string; duration: number; delay: number; rotate: number }>>([])
  const [reveal, setReveal] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const applauseBufRef = useRef<AudioBuffer | null>(null)
  const applauseUnavailableRef = useRef<boolean>(false)

  const ensureAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null
    const win = window as typeof window & { webkitAudioContext?: typeof AudioContext }
    const Ctor = win.AudioContext ?? win.webkitAudioContext
    if (!Ctor) return null
    if (!audioCtxRef.current) {
      audioCtxRef.current = new Ctor()
    }
    return audioCtxRef.current
  }, [])

  useEffect(() => {
    const param = search?.get("ep") ?? ""
    setEp((prev) => (prev === param ? prev : param))
  }, [search])

  useEffect(() => {
    const params = new URLSearchParams()
    if (ep) params.set("ep", ep)
    const qs = params.toString()
    router.replace(qs ? `?${qs}` : "?", { scroll: false })
  }, [ep, router])

  // Reduced motion preference
  useEffect(() => {
    try {
      const m = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(!!m.matches)
      const onChange = () => setReducedMotion(!!m.matches)
      m.addEventListener?.('change', onChange)
      return () => m.removeEventListener?.('change', onChange)
    } catch {}
  }, [])

  const episodeOptions = useMemo(() => {
    const m = new Map<string, string>()
    for (const it of ALL_ITEMS) if (it.source) m.set(it.source.slug, it.source.title)
    return [...m.entries()].map(([slug, title]) => ({ slug, title }))
  }, [])

  const items = useMemo<DeckItem[]>(() => {
    const pool = ALL_ITEMS.filter(i => i.source && (!ep || i.source.slug === ep))
    return pool
  }, [ep])

  function interleaveByEpisode(pool: DeckItem[], size: number): DeckItem[] {
    const groups = new Map<string, DeckItem[]>()
    for (const it of pool) {
      const k = it.source?.slug || "_general"
      if (!groups.has(k)) groups.set(k, [])
      groups.get(k)!.push(it)
    }
    // shuffle each group
    for (const [k, arr] of groups) groups.set(k, shuffle(arr))
    const keys = shuffle([...groups.keys()])
    const out: DeckItem[] = []
    let idx = 0
    while (out.length < size && keys.length) {
      const key = keys[idx % keys.length]
      const g = groups.get(key)!
      if (g.length) out.push(g.shift()!)
      // remove empty groups
      for (let i = keys.length - 1; i >= 0; i--) {
        const kk = keys[i]
        if ((groups.get(kk)?.length || 0) === 0) keys.splice(i, 1)
      }
      idx++
    }
    return out
  }

  // Build a 10-round session when started or episode changes
  useEffect(() => {
    if (!started) return
    const size = Math.min(10, items.length)
    const order = ep ? shuffle(items).slice(0, size) : interleaveByEpisode(items, size)
    setSession(order)
    // Build stable options per round
    const opts: string[][] = order.map((it) => {
      const pool = order.filter(i => i.id !== it.id)
      const fallback = items.filter(i => i.id !== it.id)
      const ds = shuffle((pool.length >= 3 ? pool : fallback)).slice(0, 3).map(i => i.phrase)
      return shuffle([it.phrase, ...ds])
    })
    setSessionOptions(opts)
    setProgress(order.map(() => ({ attempts: 0, correct: false, scored: false, reveal: false, disabled: false })))
    setIndex(0)
    setScore(0)
    setStreak(0)
    setResult(null)
    setDisabled(false)
    setReveal(false)
  }, [started, items, ep, gameId])

  // Load bests
  useEffect(() => {
    try {
      const s = localStorage.getItem('pl:bestScore')
      if (s) setBestScore(Math.max(0, Number(s) || 0))
      const st = localStorage.getItem('pl:bestStreak')
      if (st) setBestStreak(Math.max(0, Number(st) || 0))
    } catch {}
  }, [])

  // Prepare current item and derived drill data
  const current = session.length && index < session.length ? session[index] : null
  const matchOptions = useMemo(() => (index < sessionOptions.length ? sessionOptions[index] : []), [index, sessionOptions])
  const summary = useMemo(() => {
    const firstTry: Array<{ item: DeckItem; attempts: number }> = []
    const notFirstTry: Array<{ item: DeckItem; attempts: number; correct: boolean }> = []
    const missed: Array<{ item: DeckItem; attempts: number }> = []
    session.forEach((item, idx) => {
      const p = progress[idx]
      if (!p) return
      if (p.correct && p.attempts === 1) {
        firstTry.push({ item, attempts: p.attempts })
      } else {
        notFirstTry.push({ item, attempts: p.attempts, correct: !!p.correct })
        if (!p.correct) missed.push({ item, attempts: p.attempts })
      }
    })
    return { firstTry, notFirstTry, missed }
  }, [session, progress])
  const finished = started && session.length > 0 && index >= session.length

  function startGame() {
    setStarted(true)
    setIndex(0)
    setResult(null)
    setScore(0)
    setStreak(0)
    setReveal(false)
    setDisabled(false)
    setSession([])
    setSessionOptions([])
    setProgress([])
    setConfetti([])
    setGameId(id => id + 1)
  }

  const nextItem = useCallback(() => {
    const ni = Math.min(index + 1, session.length)
    setIndex(ni)
    setResult(null)
    const p = progress[ni]
    setDisabled(!!p?.disabled)
    setReveal(!!p?.reveal)
  }, [index, progress, session])

  const prevItem = useCallback(() => {
    const pi = Math.max(0, index - 1)
    setIndex(pi)
    setResult(null)
    const p = progress[pi]
    setDisabled(!!p?.disabled)
    setReveal(!!p?.reveal)
  }, [index, progress])

  const triggerConfetti = useCallback(() => {
    const colors = ["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa"]
    const n = reducedMotion ? 12 : 60
    const pieces = Array.from({ length: n }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percent
      size: 6 + Math.floor(Math.random() * 8),
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 700 + Math.floor(Math.random() * 800),
      delay: Math.floor(Math.random() * 200),
      rotate: Math.floor(Math.random() * 360),
    }))
    setConfetti(pieces)
    // Clear after animations finish
    const maxT = Math.max(...pieces.map(p => p.duration + p.delay))
    window.setTimeout(() => setConfetti([]), maxT + 50)
  }, [reducedMotion])

  // Short error beep for incorrect answers
  const playErrorBeep = useCallback(() => {
    try {
      const ctx = ensureAudioContext()
      if (!ctx) return
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      g.gain.setValueAtTime(0.0001, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25)
      o.connect(g); g.connect(ctx.destination)
      o.frequency.setValueAtTime(180, ctx.currentTime)
      o.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.2)
      o.start()
      o.stop(ctx.currentTime + 0.25)
    } catch {}
  }, [ensureAudioContext])

  // Try to load applause sample from /audio; cache result
  const ensureApplauseBuffer = useCallback(async (): Promise<AudioBuffer | null> => {
    if (applauseBufRef.current) return applauseBufRef.current
    if (applauseUnavailableRef.current) return null
    try {
      const res = await fetch('/audio/applause.mp3')
      if (!res.ok) throw new Error('no applause.mp3')
      const arr = await res.arrayBuffer()
      const ctx = ensureAudioContext()
      if (!ctx) throw new Error('no audio context')
      const buf = await ctx.decodeAudioData(arr.slice(0))
      applauseBufRef.current = buf
      return buf
    } catch {
      try {
        const res = await fetch('/audio/applause.ogg')
        if (!res.ok) throw new Error('no applause.ogg')
        const arr = await res.arrayBuffer()
        const ctx = ensureAudioContext()
        if (!ctx) throw new Error('no audio context')
        const buf = await ctx.decodeAudioData(arr.slice(0))
        applauseBufRef.current = buf
        return buf
      } catch {
        applauseUnavailableRef.current = true
        return null
      }
    }
  }, [ensureAudioContext])
  // Applause-like sound for correct answers (layered synthesized claps + crowd wash)
  const playApplauseSynth = useCallback(() => {
    try {
      const ctx = ensureAudioContext()
      if (!ctx) return
      if (ctx.state === 'suspended') { ctx.resume?.().catch(()=>{}) }
      const now = ctx.currentTime
      const total = 3.0

      // Master gain and mild compression to glue the texture
      const master = ctx.createGain()
      master.gain.setValueAtTime(0.0001, now)
      master.gain.exponentialRampToValueAtTime(0.3, now + 0.06)
      // Hold for most of the duration, then fade out
      master.gain.setValueAtTime(0.28, now + total * 0.7)
      master.gain.exponentialRampToValueAtTime(0.0001, now + total)
      const comp = ctx.createDynamicsCompressor()
      comp.threshold.setValueAtTime(-18, now)
      comp.knee.setValueAtTime(24, now)
      comp.ratio.setValueAtTime(4, now)
      comp.attack.setValueAtTime(0.003, now)
      comp.release.setValueAtTime(0.25, now)
      comp.connect(master); master.connect(ctx.destination)

      // Subtle crowd wash (brownish noise, low level)
      const washDur = total
      const washBuf = ctx.createBuffer(1, Math.floor(44100 * washDur), 44100)
      const w = washBuf.getChannelData(0)
      let lastOut = 0
      for (let i = 0; i < w.length; i++) {
        const white = Math.random() * 2 - 1
        lastOut = (lastOut + 0.02 * white) / 1.02 // brown-ish
        w[i] = lastOut
      }
      const wash = ctx.createBufferSource(); wash.buffer = washBuf
      const washBP = ctx.createBiquadFilter(); washBP.type = 'bandpass'; washBP.frequency.value = 800; washBP.Q.value = 0.6
      const washGain = ctx.createGain(); washGain.gain.setValueAtTime(0.0001, now)
      washGain.gain.exponentialRampToValueAtTime(0.08, now + 0.08)
      washGain.gain.setValueAtTime(0.07, now + total * 0.65)
      washGain.gain.exponentialRampToValueAtTime(0.0001, now + total)
      wash.connect(washBP); washBP.connect(washGain); washGain.connect(comp)
      wash.start(now); wash.stop(now + washDur)

      // Dual slapback delays to simulate room
      const d1 = ctx.createDelay(0.3); d1.delayTime.value = 0.11
      const f1 = ctx.createGain(); f1.gain.value = 0.22
      d1.connect(f1); f1.connect(d1)
      const d2 = ctx.createDelay(0.4); d2.delayTime.value = 0.18
      const f2 = ctx.createGain(); f2.gain.value = 0.18
      d2.connect(f2); f2.connect(d2)
      const roomBus = ctx.createGain(); roomBus.gain.value = 0.5
      d1.connect(roomBus); d2.connect(roomBus); roomBus.connect(comp)

      // Create many short clap bursts with stereo spread
      const burstCount = 50
      for (let i = 0; i < burstCount; i++) {
        const start = now + Math.random() * (total * 0.85)
        const dur = 0.06 + Math.random() * 0.1
        const bufSize = Math.floor(44100 * dur)
        const buffer = ctx.createBuffer(1, bufSize, 44100)
        const data = buffer.getChannelData(0)
        // Pink-ish noise per burst
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
        for (let j = 0; j < bufSize; j++) {
          const white = Math.random() * 2 - 1
          b0 = 0.99886 * b0 + white * 0.0555179
          b1 = 0.99332 * b1 + white * 0.0750759
          b2 = 0.96900 * b2 + white * 0.1538520
          b3 = 0.86650 * b3 + white * 0.3104856
          b4 = 0.55000 * b4 + white * 0.5329522
          b5 = -0.7616 * b5 - white * 0.0168980
          const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
          b6 = white * 0.115926
          const t = j / bufSize
          const env = Math.exp(-7 * t)
          data[j] = pink * env
        }
        const src = ctx.createBufferSource(); src.buffer = buffer
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800 + Math.random() * 1200; bp.Q.value = 0.9 + Math.random() * 0.7
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500 + Math.random() * 300
        const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, start); g.gain.exponentialRampToValueAtTime(0.12 + Math.random() * 0.08, start + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, Math.min(now + total, start + dur))
        const panNode = typeof ctx.createStereoPanner === 'function' ? ctx.createStereoPanner() : undefined
        if (panNode) panNode.pan.setValueAtTime(-0.9 + Math.random() * 1.8, start)
        src.connect(bp)
        bp.connect(hp)
        hp.connect(g)
        if (panNode) {
          g.connect(panNode)
          panNode.connect(comp)
        } else {
          g.connect(comp)
        }
        // Send a bit to room delays
        const send = ctx.createGain(); send.gain.value = 0.6
        g.connect(send); send.connect(d1); send.connect(d2)
        src.start(start); src.stop(Math.min(now + total, start + dur + 0.02))
      }
    } catch {}
  }, [ensureAudioContext])

  // Applause: prefer external sample; fallback to synthesized claps
  const playApplause = useCallback(async () => {
    try {
      const ctx = ensureAudioContext()
      if (!ctx) return
      if (ctx.state === 'suspended') {
        ctx.resume?.().catch(() => undefined)
      }
      const now = ctx.currentTime
      const desiredDur = 3.0
      const buf = await ensureApplauseBuffer()
      if (buf) {
        const src = ctx.createBufferSource()
        src.buffer = buf
        // mild variation
        src.playbackRate.value = 0.98 + Math.random() * 0.06
        const g = ctx.createGain()
        g.gain.setValueAtTime(0.0001, now)
        g.gain.exponentialRampToValueAtTime(0.22, now + 0.05)
        // Maintain a gentle plateau, then fade out to hit ~3s total
        g.gain.setValueAtTime(0.22, now + Math.min(0.4, desiredDur * 0.15))
        g.gain.exponentialRampToValueAtTime(0.0001, now + desiredDur)
        src.connect(g)
        g.connect(ctx.destination)
        // If the sample is shorter, loop it softly under the envelope
        if (buf.duration < desiredDur) src.loop = true
        src.start(now)
        src.stop(now + desiredDur + 0.05)
        return
      }
    } catch {}
    playApplauseSynth()
  }, [ensureApplauseBuffer, ensureAudioContext, playApplauseSynth])

  const pickMatch = useCallback((opt: string) => {
    if (!current) return
    const p = progress[index]
    if (!p || p.disabled) return
    const ok = normalize(opt) === normalize(current.phrase)
    const attempts = p.attempts + 1
    const newP = { ...p, attempts, selected: opt }
    if (ok) {
      setResult("Correct! 🎉")
      if (!p.scored) {
        setScore((s) => {
          const v = s + 1
          try {
            if (v > bestScore) {
              setBestScore(v)
              localStorage.setItem('pl:bestScore', String(v))
            }
          } catch {}
          return v
        })
        setStreak((st) => {
          const v = st + 1
          try {
            if (v > bestStreak) {
              setBestStreak(v)
              localStorage.setItem('pl:bestStreak', String(v))
            }
          } catch {}
          return v
        })
        newP.scored = true
      }
      newP.correct = true
      newP.reveal = true
      newP.disabled = true
      setReveal(true)
      setDisabled(true)
      triggerConfetti()
      if (soundOn) playApplause()
    } else {
      setStreak(0)
      if (attempts >= 2) {
        newP.disabled = true
        newP.reveal = true
        setReveal(true)
        setDisabled(true)
        setResult("Not this time")
      } else {
        setResult("Try again — 1 more chance")
      }
      if (soundOn) playErrorBeep()
    }
    const nextProg = [...progress]
    nextProg[index] = newP
    setProgress(nextProg)
  }, [bestScore, bestStreak, current, index, playApplause, playErrorBeep, progress, soundOn, triggerConfetti])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!started) {
        if (e.key.toLowerCase() === 's') { e.preventDefault(); startGame(); }
        return
      }
      if (!session.length) return
      const keys = ['1','2','3','4']
      if (keys.includes(e.key)) {
        e.preventDefault()
        const idx = Number(e.key) - 1
        const opt = matchOptions[idx]
        if (opt) pickMatch(opt)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (disabled) nextItem()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [started, session, matchOptions, disabled, nextItem, pickMatch])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm" htmlFor="ep">Episode</label>
        <select id="ep" className="px-2 py-1.5 rounded-lg border" value={ep} onChange={(e)=>{ setEp(e.target.value); setIndex(0); }}>
          <option value="">All episodes</option>
          {episodeOptions.map(o => <option key={o.slug} value={o.slug}>{o.title}</option>)}
        </select>
        <button
          type="button"
          onClick={() => { try { navigator.clipboard.writeText(window.location.href) } catch {} }}
          className="px-2 py-1 rounded-lg border text-xs"
          title="Copy link with current episode"
        >Copy link</button>
        <div className="flex items-center gap-1 ml-2 text-xs">
          <input id="sfx" type="checkbox" className="rounded border-gray-300" checked={soundOn} onChange={(e)=>setSoundOn(e.target.checked)} />
          <label htmlFor="sfx">Sound effects (applause)</label>
        </div>
        {/* Removed: Read aloud (TTS), Voice, and Sound controls */}
        <div className="ml-auto text-sm text-gray-600">Items: {items.length}</div>
      </div>
      {!started ? (
        <div className="rounded-xl border p-6 text-center space-y-3 bg-gradient-to-br from-brand-50/60 to-white">
          <p className="text-sm text-gray-700">Pick One — 10 rounds</p>
          <h3 className="text-xl font-semibold">Choose the phrase that best fits the meaning</h3>
          <p className="text-gray-600 text-sm">Fast, fun practice from the episodes. Ready?</p>
          <button onClick={startGame} className="px-4 py-2 rounded-lg bg-brand-700 text-white">Start Game ▶</button>
        </div>
      ) : finished ? (
        <div className="rounded-xl border p-6 space-y-4 bg-gradient-to-br from-white to-brand-50/40">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">All done! 🎉</h3>
            <p className="text-gray-700">Score: {score} / {session.length}</p>
            <p className="text-sm text-gray-600">
              First try correct: <strong>{summary.firstTry.length}</strong> · Not first try: <strong>{summary.notFirstTry.length}</strong> · Missed: <strong>{summary.missed.length}</strong>
            </p>
          </div>
          <div className="grid gap-3 text-sm text-left sm:grid-cols-2">
            <div className="rounded-lg border border-green-200 bg-green-50/80 p-3">
              <h4 className="font-semibold text-green-700 text-sm">First try ✅ ({summary.firstTry.length})</h4>
              {summary.firstTry.length ? (
                <ul className="mt-2 space-y-1 text-green-800">
                  {summary.firstTry.map(({ item }) => (
                    <li key={item.id} className="leading-snug">
                      <span className="font-medium">{item.phrase}</span>
                      <span className="block text-xs text-green-700/80">{item.meaning}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-green-700/80">Give it another go to lock in your first-try wins.</p>
              )}
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3">
              <h4 className="font-semibold text-amber-700 text-sm">Not first try ({summary.notFirstTry.length})</h4>
              {summary.notFirstTry.length ? (
                <ul className="mt-2 space-y-1 text-amber-800">
                  {summary.notFirstTry.map(({ item, attempts, correct }) => (
                    <li key={item.id} className="leading-snug">
                      <span className="font-medium">{item.phrase}</span>
                      <span className="block text-xs text-amber-700/80">{item.meaning}</span>
                      <span className={`block text-xs font-medium ${correct ? 'text-amber-600' : 'text-red-600'}`}>
                        {correct ? `Solved in ${attempts} attempt${attempts === 1 ? '' : 's'}` : 'Still needs practice'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-amber-700/80">Amazing! Nothing left to review.</p>
              )}
            </div>
          </div>
          <div className="text-center">
            <button onClick={startGame} className="px-4 py-2 rounded-lg bg-brand-700 text-white">Play Again</button>
          </div>
        </div>
      ) : current ? (
        <div className="relative rounded-xl border p-4 space-y-3 bg-white overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Round {index + 1} / {session.length}</p>
            <div className="flex items-center gap-3 text-sm">
              <span>Score: <strong>{score}</strong></span>
              <span>Streak: <strong>{streak}</strong> <span className="text-gray-500">(best {bestStreak})</span></span>
            </div>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded">
            <div className="h-2 bg-brand-500 rounded" style={{ width: `${((index) / Math.max(1, session.length)) * 100}%` }} />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Meaning</p>
            <h3 className="text-xl font-semibold mt-0.5">{current.meaning}</h3>
            {current.source && (
              <p className="text-xs text-gray-600 mt-0.5">from {current.source.title}</p>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-700">Pick the best expression:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {matchOptions.map(o => (
                <button
                  key={o}
                  onClick={()=>pickMatch(o)}
                  disabled={disabled}
                  className={`px-4 py-2 rounded-xl border transition text-sm sm:text-base ${disabled ? 'opacity-70' : 'hover:border-brand-300 active:scale-[0.99]'}`}
                >
                  {o}
                </button>
              ))}
            </div>
            {result && (
              <div className={`text-sm rounded p-2 ${result.includes('Correct') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>{result}</div>
            )}
            {reveal && current && (
              <div className="text-center text-sm bg-brand-50/50 border border-brand-100 rounded-lg p-3">
                <p><span className="text-gray-600">Phrase:</span> <strong>{current.phrase}</strong></p>
                <p className="text-gray-700 mt-1"><span className="text-gray-600">Example:</span> {current.example}</p>
              </div>
            )}
            <div className="flex items-center justify-between mt-1">
              <button onClick={prevItem} disabled={index === 0} className="px-3 py-1.5 rounded-lg border disabled:opacity-50">◀ Prev</button>
              <button onClick={nextItem} disabled={!disabled} className="px-3 py-1.5 rounded-lg border disabled:opacity-50">{index + 1 === session.length ? 'Finish' : 'Next ▶'}</button>
            </div>
          </div>
          {/* Confetti overlay */}
          {confetti.length > 0 && (
            <div className="pointer-events-none absolute inset-0">
              {confetti.map(p => (
                <span
                  key={p.id}
                  className="block absolute"
                  style={{
                    left: `${p.left}%`,
                    top: `-10px`,
                    width: `${p.size}px`,
                    height: `${p.size * 0.4}px`,
                    backgroundColor: p.color,
                    transform: `rotate(${p.rotate}deg)`,
                    animation: `confetti-fall ${p.duration}ms linear ${p.delay}ms forwards, confetti-spin ${Math.max(600, p.duration)}ms linear ${p.delay}ms`,
                  }}
                />
              ))}
            </div>
          )}
          <style jsx>{`
            @keyframes confetti-fall {
              0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
              100% { transform: translateY(120%) rotate(0deg); opacity: 0.9; }
            }
            @keyframes confetti-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <div className="rounded-xl border p-6 text-center text-sm text-gray-600 bg-white/80">
          Setting up your next round…
        </div>
      )}
    </div>
  )
}
