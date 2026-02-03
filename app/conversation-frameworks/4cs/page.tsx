import FrameworkPageClient from "@/components/conversation-frameworks/FrameworkPageClient"
import { frameworkById } from "@/components/conversation-frameworks/frameworkData"

export default function FourCsPage() {
  return <FrameworkPageClient framework={frameworkById["4cs"]} />
}
