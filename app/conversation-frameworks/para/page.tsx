import FrameworkPageClient from "@/components/conversation-frameworks/FrameworkPageClient"
import { frameworkById } from "@/components/conversation-frameworks/frameworkData"

export default function ParaPage() {
  return <FrameworkPageClient framework={frameworkById.para} />
}
