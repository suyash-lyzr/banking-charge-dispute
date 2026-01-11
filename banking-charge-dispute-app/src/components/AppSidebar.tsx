"use client"

import { MessageSquare, ListChecks, BarChart3, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export type AppView = "chat" | "disputes" | "observability"

interface AppSidebarProps {
  className?: string
  activeView: AppView
  onChangeView: (view: AppView) => void
}

export function AppSidebar({ className, activeView, onChangeView }: AppSidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full w-[280px] flex-col border-r border-neutral-200 bg-neutral-50",
        className
      )}
    >
      {/* Header - height matches ChatHeader (h-16) */}
      <div className="h-16 flex items-center gap-3 border-b border-neutral-200 px-5 bg-white">
        <div className="flex size-10 items-center justify-center rounded-xl overflow-hidden">
          <Image
            src="/lyzr-logo.png"
            alt="Lyzr Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-foreground leading-none">SecureBank</h2>
          <p className="text-xs text-muted-foreground mt-1">Dispute Assistant</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        <button
          onClick={() => onChangeView("chat")}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            activeView === "chat"
              ? "bg-[#704EFD] text-white"
              : "text-foreground hover:bg-neutral-200/60"
          )}
        >
          <MessageSquare className="size-4 shrink-0" />
          Chat Assistant
        </button>

        <button
          onClick={() => onChangeView("disputes")}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            activeView === "disputes"
              ? "bg-[#704EFD] text-white"
              : "text-foreground hover:bg-neutral-200/60"
          )}
        >
          <ListChecks className="size-4 shrink-0" />
          Disputes
        </button>

        <button
          disabled
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground/60 cursor-not-allowed"
          title="Observability (coming soon)"
        >
          <BarChart3 className="size-4 shrink-0" />
          Observability
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 text-muted-foreground">
            Soon
          </span>
        </button>
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-200 p-4 bg-white">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#704EFD] text-white text-xs font-semibold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">John Doe</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-full bg-green-500" />
                Online
              </span>
              <span className="text-muted-foreground/50">•</span>
              Customer
            </div>
          </div>
          <ShieldCheck className="size-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}
