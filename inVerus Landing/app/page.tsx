import { HomeContent } from "@/app/components/home-content"
import { Suspense } from "react"

// Force dynamic rendering to prevent prerendering issues with search params
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}
