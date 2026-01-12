"use client"

import { useState, KeyboardEvent } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ChatVariant } from "./ChatLayout"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
  variant?: ChatVariant
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
  variant = "mobile",
}: ChatInputProps) {
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim())
      setInput("")
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (variant === "mobile") {
    return (
      <div className="sticky bottom-0 border-t border-neutral-300 bg-[#F0F0F0] p-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              className="h-10 pr-12 rounded-full border-neutral-300 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-[15px] placeholder:text-muted-foreground/60"
            />
            <Button
              onClick={handleSend}
              disabled={disabled || !input.trim()}
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 size-8 rounded-full bg-primary hover:bg-primary/90 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {disabled ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Send className="size-3.5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky bottom-0 border-t border-neutral-200 bg-white p-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              className="h-12 pr-14 rounded-xl border-neutral-200 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-[15px] placeholder:text-muted-foreground/60"
            />
            <Button
              onClick={handleSend}
              disabled={disabled || !input.trim()}
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 size-9 rounded-lg bg-primary hover:bg-primary/90 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {disabled ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground/60">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
