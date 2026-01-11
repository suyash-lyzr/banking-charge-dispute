"use client"

import { MessageSquare, BarChart3 } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Chat Assistant",
    icon: MessageSquare,
    href: "/",
  },
  {
    title: "Observability",
    icon: BarChart3,
    href: "/observability",
  },
]

interface AppSidebarProps {
  className?: string
}

export function AppSidebar({ className }: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col border-r bg-card",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-6 py-5">
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
          <h2 className="text-base font-semibold">SecureBank</h2>
          <p className="text-xs text-muted-foreground">Dispute Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="mb-2">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Application
          </p>
        </div>
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-[#704EFD] text-white shadow-lg"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.title}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#603BFC] to-[#A94FA1] text-white text-xs font-semibold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">john.doe@email.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
