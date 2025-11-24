"use client"

import { InverusIcon } from "@/components/icons/inverus"
import { APP_NAME, APP_AUTH_URL } from "@/lib/config"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

export function Header({ hasSidebar }: { hasSidebar: boolean }) {
  return (
    <header className="h-app-header pointer-events-none fixed top-0 right-0 left-0 z-50 bg-background">
      <div className="relative mx-auto flex h-full max-w-full items-center justify-between bg-background px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-between">
          <div className="-ml-0.5 flex flex-1 items-center gap-2 lg:-ml-2.5">
            <div className="flex flex-1 items-center gap-2">
              <Link
                href="/"
                className="pointer-events-auto inline-flex items-center text-xl font-medium tracking-tight"
              >
                <InverusIcon className="mr-2 size-6" />
                {APP_NAME}
              </Link>
            </div>
          </div>
          <div />
          <div className="pointer-events-auto flex flex-1 items-center justify-end gap-4">
            <Link
              href="https://inverus.ai/auth"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Go to App
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
