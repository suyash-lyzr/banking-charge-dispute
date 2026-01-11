"use client"

import { RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ChatHeaderProps {
  onClearChat?: () => void
}

export function ChatHeader({ onClearChat }: ChatHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border/30 bg-white dark:bg-card shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="size-10 rounded-full bg-gradient-to-br from-[#704EFD] to-[#5a3dd4] flex items-center justify-center shadow-md">
            <Image
              src="/lyzr-logo.png"
              alt="SecureBank"
              width={24}
              height={24}
              className="rounded-full"
            />
          </div>
          <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full border-2 border-white dark:border-card" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-[15px] md:text-base text-foreground">SecureBank Assistant</span>
          <span className="text-xs text-muted-foreground">Always here to help</span>
        </div>
      </div>
      {onClearChat && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearChat}
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full h-9 px-3"
        >
          <RefreshCcw className="size-4" />
          <span className="ml-2 hidden md:inline text-sm">Clear</span>
        </Button>
      )}
    </div>
  )
}
