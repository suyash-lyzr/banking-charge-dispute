"use client"

import { ChatLayout } from "./ChatLayout"
import type { Message, ResolutionCardData, Transaction } from "@/types"

interface WebChatFrameProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading?: boolean
  resolutionCard?: ResolutionCardData | null
  onForwardToAgent?: () => void
  onClearChat?: () => void
  onTransactionDispute?: (transaction: Transaction) => void
  disputedTransactionIds?: Set<string>
  onToggleChatMode?: () => void
}

export function WebChatFrame({
  messages,
  onSendMessage,
  isLoading = false,
  resolutionCard,
  onForwardToAgent,
  onClearChat,
  onTransactionDispute,
  disputedTransactionIds,
  onToggleChatMode,
}: WebChatFrameProps) {
  return (
    <div className="h-full w-full flex flex-col items-center bg-neutral-100 p-6 relative">
      {/* Label above container */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground font-medium">
          Desktop View — WhatsApp Web Experience
        </p>
      </div>

      {/* WhatsApp Web-style Container */}
      <div className="w-full max-w-[980px] min-h-[720px] flex-1 max-h-[calc(100vh-140px)] rounded-lg border border-neutral-300 bg-white shadow-lg overflow-hidden flex flex-col">
        <ChatLayout
          messages={messages}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          resolutionCard={resolutionCard}
          onForwardToAgent={onForwardToAgent}
          onClearChat={onClearChat}
          onTransactionDispute={onTransactionDispute}
          disputedTransactionIds={disputedTransactionIds}
          showQuickActions={true}
          variant="web"
          onToggleChatMode={onToggleChatMode}
        />
      </div>
    </div>
  )
}
