"use client"

import { RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ChatHeaderProps {
  onClearChat?: () => void
  isMobile?: boolean
}

export function ChatHeader({ onClearChat, isMobile = false }: ChatHeaderProps) {
  if (isMobile) {
    return (
      <div className="sticky top-0 z-10 h-14 flex items-center justify-between px-4 border-b border-neutral-300 bg-[#075E54]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-9 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <Image
                src="/lyzr-logo.png"
                alt="SecureBank"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full border-2 border-[#075E54]" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-[15px] text-white">SecureBank Assistant</span>
            <span className="text-[12px] text-white/80 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1">
                <span className="size-1.5 bg-green-400 rounded-full" />
                Online
              </span>
              <span className="text-white/50">•</span>
              <span>WhatsApp</span>
            </span>
          </div>
        </div>
        {onClearChat && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearChat}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 p-0"
          >
            <RefreshCcw className="size-4" />
          </Button>
        )}
      </div>
    )
  }

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
