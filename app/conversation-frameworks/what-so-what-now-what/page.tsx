import FrameworkPageClient from "@/components/conversation-frameworks/FrameworkPageClient"
import { frameworkById } from "@/components/conversation-frameworks/frameworkData"

export default function WhatSoWhatNowWhatPage() {
  return <FrameworkPageClient framework={frameworkById["what-so-what-now-what"]} />
}
