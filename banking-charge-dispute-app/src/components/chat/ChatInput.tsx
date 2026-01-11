"use client"

import { useState, KeyboardEvent } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
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
              className="h-12 pr-14 rounded-xl border-neutral-200 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-[#704EFD]/20 focus-visible:border-[#704EFD] text-[15px] placeholder:text-muted-foreground/60"
            />
            <Button
              onClick={handleSend}
              disabled={disabled || !input.trim()}
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 size-9 rounded-lg bg-[#704EFD] hover:bg-[#5a3dd4] shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
