import FrameworkPageClient from "@/components/conversation-frameworks/FrameworkPageClient"
import { frameworkById } from "@/components/conversation-frameworks/frameworkData"

export default function PrepPage() {
  return <FrameworkPageClient framework={frameworkById.prep} />
}
