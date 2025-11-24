"use client"

import { isSupabaseEnabled } from "@/lib/supabase/config"
import { notFound } from "next/navigation"
import { LoginPage } from "./login-page"
import Link from "next/link"

export default function AuthPage() {
  if (!isSupabaseEnabled) {
    return notFound()
  }

  return (
    <div className="relative h-screen w-full">
      <Link
        href="/"
        className="text-md text-muted-foreground hover:text-primary absolute top-6 left-6 z-50 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg"
      >
        ← Back to chat
      </Link>
      <LoginPage />
    </div>
  )
}
