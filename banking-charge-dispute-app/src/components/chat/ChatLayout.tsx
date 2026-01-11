"use client"

import { ChatHeader } from "./ChatHeader"
import { ChatMessages } from "./ChatMessages"
import { QuickActions } from "./QuickActions"
import { ChatInput } from "./ChatInput"
import { ResolutionCard } from "./ResolutionCard"
import type { Message, ResolutionCardData, Transaction } from "@/types"

interface ChatLayoutProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading?: boolean
  resolutionCard?: ResolutionCardData | null
  onForwardToAgent?: () => void
  onClearChat?: () => void
  onTransactionSelect?: (transaction: Transaction) => void
  onTransactionDispute?: (transaction: Transaction) => void
  showQuickActions?: boolean
}

export function ChatLayout({
  messages,
  onSendMessage,
  isLoading = false,
  resolutionCard,
  onForwardToAgent,
  onClearChat,
  onTransactionSelect,
  onTransactionDispute,
  showQuickActions = true,
}: ChatLayoutProps) {
  // Only show quick actions if we have few messages and no active dispute
  const shouldShowQuickActions = showQuickActions && messages.length <= 2 && !resolutionCard

  return (
    <div className="flex h-full flex-col bg-background">
      <ChatHeader onClearChat={onClearChat} />
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-hidden">
          <ChatMessages
            messages={messages}
            onTransactionSelect={onTransactionSelect}
            onTransactionDispute={onTransactionDispute}
            onQuickReply={onSendMessage}
          />
        </div>
        {resolutionCard && (
          <div className="px-4 md:px-6 pb-4 bg-muted/20">
            <div className="max-w-3xl mx-auto">
              <ResolutionCard
                data={resolutionCard}
                onForwardToAgent={onForwardToAgent}
              />
            </div>
          </div>
        )}
        <QuickActions
          onActionClick={onSendMessage}
          disabled={isLoading}
          showInitialActions={shouldShowQuickActions}
        />
        <ChatInput
          onSendMessage={onSendMessage}
          disabled={isLoading}
          placeholder="Type your message..."
        />
      </div>
    </div>
  )
}
