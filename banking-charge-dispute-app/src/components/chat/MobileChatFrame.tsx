"use client"

import { ChatLayout } from "./ChatLayout"
import type { Message, ResolutionCardData, Transaction } from "@/types"

interface MobileChatFrameProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading?: boolean
  resolutionCard?: ResolutionCardData | null
  onForwardToAgent?: () => void
  onClearChat?: () => void
  onTransactionDispute?: (transaction: Transaction) => void
  disputedTransactionIds?: Set<string>
}

export function MobileChatFrame({
  messages,
  onSendMessage,
  isLoading = false,
  resolutionCard,
  onForwardToAgent,
  onClearChat,
  onTransactionDispute,
  disputedTransactionIds,
}: MobileChatFrameProps) {
  return (
    <div className="h-full w-full flex flex-col items-center bg-neutral-100 p-6 relative">
      {/* Label above mobile container */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground font-medium">
          Customer View — WhatsApp Experience
        </p>
      </div>

      {/* Mobile Device Container */}
      <div className="w-full max-w-[390px] min-h-[720px] flex-1 max-h-[calc(100vh-140px)] rounded-[20px] border border-neutral-300 bg-white shadow-xl overflow-hidden flex flex-col">
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
          isMobile={true}
        />
      </div>
    </div>
  )
}
