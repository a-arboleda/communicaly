"use client"

import { useRef } from "react"
import AudioPlayer from "@/components/AudioPlayer"
import TranscriptSync, { type Cue } from "@/components/TranscriptSync"

export default function EpisodeAudioWithTranscript({
  src,
  start,
  end,
  cues,
  collapsible = true,
  defaultOpen = false,
  timeOffset = 0,
}: {
  src?: string
  start?: number
  end?: number
  cues?: Cue[]
  collapsible?: boolean
  defaultOpen?: boolean
  timeOffset?: number
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  return (
    <div>
      <AudioPlayer ref={audioRef} src={src} start={start} end={end} />
      {cues && cues.length > 0 ? (
        <TranscriptSync audioRef={audioRef} cues={cues} collapsible={collapsible} defaultOpen={defaultOpen} timeOffset={timeOffset} />
      ) : null}
    </div>
  )
}
