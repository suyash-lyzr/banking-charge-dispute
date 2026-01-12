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
        "flex h-full w-[280px] flex-col bg-white",
        className
      )}
    >
      {/* Header - height matches ChatHeader (h-16) */}
      <div className="h-16 flex items-center gap-3 px-5 bg-white">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl overflow-hidden">
          <Image
            src="/banco-falabella-logo.svg"
            alt="Banco Falabella"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-foreground leading-none">Banco Falabella</h2>
          <p className="text-xs text-muted-foreground mt-1">Asistente de Disputas</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        <button
          onClick={() => onChangeView("chat")}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
            activeView === "chat"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-foreground hover:bg-neutral-100"
          )}
        >
          <MessageSquare className="size-5 shrink-0" />
          <span className="truncate">Chat Assistant</span>
        </button>

        <button
          onClick={() => onChangeView("disputes")}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
            activeView === "disputes"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-foreground hover:bg-neutral-100"
          )}
        >
          <ListChecks className="size-5 shrink-0" />
          <span className="truncate">Disputes</span>
        </button>

        <button
          onClick={() => onChangeView("observability")}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
            activeView === "observability"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-foreground hover:bg-neutral-100"
          )}
        >
          <BarChart3 className="size-5 shrink-0" />
          <span className="truncate">Observability</span>
        </button>
      </nav>

      {/* Footer */}
      <div className="p-3 bg-white">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-neutral-100 transition-colors cursor-pointer">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">John Doe</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-full bg-green-500" />
                Online
              </span>
              <span className="text-muted-foreground/50">•</span>
              <span>Customer</span>
            </div>
          </div>
          <ShieldCheck className="size-4 text-muted-foreground shrink-0" />
        </div>
      </div>
    </div>
  )
}
