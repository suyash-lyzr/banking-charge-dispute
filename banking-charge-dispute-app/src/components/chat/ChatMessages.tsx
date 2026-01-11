"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageBubble } from "./MessageBubble"
import { TypingIndicator } from "./TypingIndicator"
import type { Message, Transaction } from "@/types"

interface ChatMessagesProps {
  messages: Message[]
  onTransactionSelect?: (transaction: Transaction) => void
  onTransactionDispute?: (transaction: Transaction) => void
  disputedTransactionIds?: Set<string>
  onQuickReply?: (value: string) => void
  isLoading?: boolean
}

export function ChatMessages({ 
  messages, 
  onTransactionSelect, 
  onTransactionDispute,
  disputedTransactionIds,
  onQuickReply,
  isLoading = false
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Smooth scroll to bottom when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [messages])

  // Track already-shown transaction IDs to avoid duplicates
  const shownTransactionIds = new Set<string>()

  return (
    <ScrollArea className="flex-1 h-full w-full overflow-y-auto bg-neutral-50">
      <div className="w-full px-4 md:px-6 py-4">
        <div className="flex flex-col min-h-full w-full">
          {messages.map((message, index) => {
            // Filter out duplicate transactions
            let filteredMessage = message
            if (message.metadata?.transactions) {
              const uniqueTransactions = message.metadata.transactions.filter((tx) => {
                if (shownTransactionIds.has(tx.id)) return false
                shownTransactionIds.add(tx.id)
                return true
              })
              filteredMessage = {
                ...message,
                metadata: {
                  ...message.metadata,
                  transactions: uniqueTransactions.length > 0 ? uniqueTransactions : undefined,
                },
              }
            }

            return (
              <MessageBubble
                key={message.id}
                message={filteredMessage}
                onTransactionSelect={onTransactionSelect}
                onTransactionDispute={onTransactionDispute}
                disputedTransactionIds={disputedTransactionIds}
                onQuickReply={onQuickReply}
                isLatestMessage={index === messages.length - 1}
              />
            )
          })}
          
          {/* Show typing indicator when loading */}
          {isLoading && <TypingIndicator />}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
    </ScrollArea>
  )
}
