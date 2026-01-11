"use client"

import { ChatHeader } from "./ChatHeader"
import { ChatMessages } from "./ChatMessages"
import { QuickActions } from "./QuickActions"
import { ChatInput } from "./ChatInput"
import { ResolutionCard } from "./ResolutionCard"
import { ChatEmptyState } from "./ChatEmptyState"
import type { Message, ResolutionCardData, Transaction } from "@/types"

export type ChatVariant = "mobile" | "web"

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
  variant?: ChatVariant
  onToggleChatMode?: () => void
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
  variant = "mobile",
  onToggleChatMode,
}: ChatLayoutProps) {
  // Show empty state if only the initial greeting exists
  const showEmptyState = messages.length <= 1 && !isLoading
  
  // Don't show quick actions once chat has started (ChatEmptyState has its own suggestions)
  const shouldShowQuickActions = false

  // WhatsApp theme applies to both mobile and web variants
  const isWhatsAppTheme = variant === "mobile" || variant === "web"

  return (
    <div className={isWhatsAppTheme ? "flex h-full w-full flex-col bg-[#ECE5DD]" : "flex h-full w-full flex-col bg-neutral-50"}>
      <ChatHeader onClearChat={onClearChat} variant={variant} onToggleChatMode={onToggleChatMode} />
      <div className="flex-1 flex flex-col min-h-0 w-full">
        {showEmptyState ? (
          <ChatEmptyState onActionClick={onSendMessage} variant={variant} />
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
                variant={variant}
              />
            </div>
            {resolutionCard && (
              <div className={isWhatsAppTheme ? "px-3 pb-2 bg-[#ECE5DD]" : "px-4 md:px-6 pb-3 bg-neutral-50"}>
                  <ResolutionCard
                    data={resolutionCard}
                    onForwardToAgent={onForwardToAgent}
                    variant={variant}
                  />
              </div>
            )}
            <QuickActions
              onActionClick={onSendMessage}
              disabled={isLoading}
              showInitialActions={shouldShowQuickActions}
              variant={variant}
            />
          </>
        )}
        <ChatInput
          onSendMessage={onSendMessage}
          disabled={isLoading}
          placeholder={variant === "mobile" ? "Type a message" : "Type your message..."}
          variant={variant}
        />
      </div>
    </div>
  )
}
