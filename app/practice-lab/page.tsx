import { Suspense } from "react"
import PracticeLabClient from "./PracticeLabClient"

export default function PracticeLabPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-sm text-gray-600">Loading practice lab...</div>}>
      <PracticeLabClient />
    </Suspense>
  )
}
