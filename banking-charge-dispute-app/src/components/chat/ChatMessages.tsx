"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageBubble } from "./MessageBubble"
import type { Message, Transaction } from "@/types"

interface ChatMessagesProps {
  messages: Message[]
  onTransactionSelect?: (transaction: Transaction) => void
  onTransactionDispute?: (transaction: Transaction) => void
  onQuickReply?: (value: string) => void
}

export function ChatMessages({ 
  messages, 
  onTransactionSelect, 
  onTransactionDispute,
  onQuickReply
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Smooth scroll to bottom when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [messages])

  return (
    <ScrollArea className="flex-1 h-full overflow-y-auto bg-muted/20">
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-6">
        <div className="flex flex-col min-h-full">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              onTransactionSelect={onTransactionSelect}
              onTransactionDispute={onTransactionDispute}
              onQuickReply={onQuickReply}
              isLatestMessage={index === messages.length - 1}
            />
          ))}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
    </ScrollArea>
  )
}
