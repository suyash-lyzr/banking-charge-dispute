"use client"

import { ChatHeader } from "./ChatHeader"
import { ChatMessages } from "./ChatMessages"
import { QuickActions } from "./QuickActions"
import { ChatInput } from "./ChatInput"
import { ResolutionCard } from "./ResolutionCard"
import { ChatEmptyState } from "./ChatEmptyState"
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
  disputedTransactionIds?: Set<string>
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
  disputedTransactionIds,
  showQuickActions = true,
}: ChatLayoutProps) {
  // Show empty state if only the initial greeting exists
  const showEmptyState = messages.length <= 1 && !isLoading
  
  // Only show quick actions if we have messages and no active dispute
  const shouldShowQuickActions = !showEmptyState && showQuickActions && messages.length <= 3 && !resolutionCard

  return (
    <div className="flex h-full w-full flex-col bg-neutral-50">
      <ChatHeader onClearChat={onClearChat} />
      <div className="flex-1 flex flex-col min-h-0 w-full">
        {showEmptyState ? (
          <ChatEmptyState onActionClick={onSendMessage} />
        ) : (
          <>
            <div className="flex-1 overflow-hidden w-full">
              <ChatMessages
                messages={messages}
                onTransactionSelect={onTransactionSelect}
                onTransactionDispute={onTransactionDispute}
                disputedTransactionIds={disputedTransactionIds}
                onQuickReply={onSendMessage}
                isLoading={isLoading}
              />
            </div>
            {resolutionCard && (
              <div className="px-4 md:px-6 pb-3 bg-neutral-50">
                  <ResolutionCard
                    data={resolutionCard}
                    onForwardToAgent={onForwardToAgent}
                  />
              </div>
            )}
            <QuickActions
              onActionClick={onSendMessage}
              disabled={isLoading}
              showInitialActions={shouldShowQuickActions}
            />
          </>
        )}
        <ChatInput
          onSendMessage={onSendMessage}
          disabled={isLoading}
          placeholder="Type your message..."
        />
      </div>
    </div>
  )
}
