import FrameworkPageClient from "@/components/conversation-frameworks/FrameworkPageClient"
import { frameworkById } from "@/components/conversation-frameworks/frameworkData"

export default function RasePage() {
  return <FrameworkPageClient framework={frameworkById.rase} />
}
