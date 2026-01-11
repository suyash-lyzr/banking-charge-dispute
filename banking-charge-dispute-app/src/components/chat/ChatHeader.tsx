"use client"

import { RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ChatHeaderProps {
  onClearChat?: () => void
}

export function ChatHeader({ onClearChat }: ChatHeaderProps) {
  return (
    <div className="sticky top-0 z-10 h-16 flex items-center justify-between px-4 md:px-6 border-b border-neutral-200 bg-white">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="size-10 rounded-full bg-[#704EFD] flex items-center justify-center">
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
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="size-2 bg-green-500 rounded-full" />
              Online
            </span>
            <span className="text-muted-foreground/50">•</span>
            Always here to help
          </span>
        </div>
      </div>
      {onClearChat && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearChat}
          className="text-muted-foreground hover:text-foreground hover:bg-neutral-100 rounded-full h-9 px-3"
        >
          <RefreshCcw className="size-4" />
          <span className="ml-2 hidden md:inline text-sm">Clear Chat</span>
        </Button>
      )}
    </div>
  )
}
