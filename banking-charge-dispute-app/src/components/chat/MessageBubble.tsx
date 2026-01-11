"use client"

import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Message, Transaction } from "@/types"
import { TransactionCard } from "./TransactionCard"
import { QuickReplyButtons } from "./QuickReplyButtons"

interface MessageBubbleProps {
  message: Message
  onTransactionSelect?: (transaction: Transaction) => void
  onTransactionDispute?: (transaction: Transaction) => void
  onQuickReply?: (value: string) => void
  isLatestMessage?: boolean
}

export function MessageBubble({ 
  message, 
  onTransactionSelect, 
  onTransactionDispute,
  onQuickReply,
  isLatestMessage = false
}: MessageBubbleProps) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"
  const isFraudQuestion = message.metadata?.isFraudQuestion || false
  const hasTransactions = message.metadata?.transactions && message.metadata.transactions.length > 0
  const hasQuickReplies = message.metadata?.quickReplies && message.metadata.quickReplies.length > 0

  // Helper to check if text contains transaction details that should be hidden
  const containsTransactionDetails = (text: string): boolean => {
    const transactionPatterns = [
      /Transaction ID:/i,
      /Merchant Name:/i,
      /Amount:/i,
      /Date:/i,
      /Channel:/i,
    ]
    let matchCount = 0
    for (const pattern of transactionPatterns) {
      if (pattern.test(text)) matchCount++
    }
    return matchCount >= 3
  }

  // Helper to clean and render text
  const renderText = (text: string) => {
    // Safety: never render internal routing lines if they slip through
    text = text
      .split("\n")
      .filter((line) => !/^\s*@.+\bAgent\b/i.test(line.trim()))
      .join("\n")

    // If we have transaction cards, filter out transaction details from text
    if (hasTransactions && containsTransactionDetails(text)) {
      const lines = text.split('\n')
      const filteredLines = []
      let inTransactionBlock = false
      
      for (const line of lines) {
        const trimmed = line.trim()
        if (/(Transaction ID|Merchant Name|Merchant|Amount|Date|Channel):/i.test(trimmed)) {
          inTransactionBlock = true
          continue
        }
        if (inTransactionBlock && trimmed && !/^[-•]/.test(trimmed) && !/:/.test(trimmed)) {
          inTransactionBlock = false
        }
        if (!inTransactionBlock && trimmed) {
          filteredLines.push(line)
        }
      }
      
      if (filteredLines.length === 0) {
        return null
      }
      
      text = filteredLines.join('\n')
    }

    // Remove ** markers
    const cleanText = text.replace(/\*\*/g, '')
    const lines = cleanText.split('\n').filter(line => line.trim() !== '')
    
    // For consumer UI, render simple clean text
    return (
      <div className="space-y-2">
        {lines.map((line, i) => {
          const trimmedLine = line.trim()
          if (!trimmedLine) return null
          
          // Simple bullet points
          if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
            const content = trimmedLine.substring(1).trim()
            return (
              <div key={i} className="flex gap-2">
                <span className="shrink-0">•</span>
                <span className="flex-1">{content}</span>
              </div>
            )
          }
          
          // Regular text
          return <div key={i}>{trimmedLine}</div>
        })}
      </div>
    )
  }

  // System message (centered, pill-shaped)
  if (isSystem) {
    return (
      <div className="flex w-full justify-center animate-in fade-in duration-300 my-4">
        <div className="max-w-xs px-4 py-2 rounded-full bg-muted/50 text-muted-foreground text-center text-sm">
          {message.content}
        </div>
      </div>
    )
  }

  // Assistant message with transactions
  if (!isUser && hasTransactions) {
    return (
      <div className="flex w-full flex-col animate-in fade-in-50 slide-in-from-left-2 duration-300 mb-4">
        {/* Introductory text (if any) */}
        {message.content && renderText(message.content) && (
          <div className="flex justify-start mb-3">
            <div className="max-w-[85%] md:max-w-[75%] bg-white dark:bg-card border border-border/40 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
              <div className="text-[15px] leading-relaxed text-foreground">
                {renderText(message.content)}
              </div>
              <div className="mt-1.5 text-[11px] text-muted-foreground/60">
                {format(message.timestamp, "HH:mm")}
              </div>
            </div>
          </div>
        )}
        
        {/* Transaction cards */}
        <div className="flex flex-col gap-2 max-w-[90%] md:max-w-[80%]">
          {message.metadata?.transactions?.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              showDisputeButton={true}
              onDispute={onTransactionDispute}
            />
          ))}
        </div>
      </div>
    )
  }

  // Regular chat bubbles
  return (
    <div
      className={cn(
        "flex w-full animate-in fade-in-50 duration-300 mb-4",
        isUser ? "justify-end slide-in-from-right-2" : "justify-start slide-in-from-left-2"
      )}
    >
      <div className="flex flex-col max-w-[85%] md:max-w-[75%]">
        <div
          className={cn(
            "rounded-2xl shadow-sm",
            isUser
              ? "bg-[#704EFD] text-white px-4 py-3 rounded-tr-sm self-end"
              : "bg-white dark:bg-card border border-border/40 px-4 py-3 rounded-tl-sm",
            isFraudQuestion && "bg-gradient-to-br from-white to-purple-50/30 dark:from-card dark:to-purple-950/10 border-[#704EFD]/20"
          )}
        >
          <div className={cn(
            "leading-relaxed",
            isUser ? "text-white text-[15px]" : "text-foreground text-[15px]",
            isFraudQuestion && "font-medium"
          )}>
            {renderText(message.content)}
          </div>
          <div
            className={cn(
              "mt-1.5 text-[11px]",
              isUser ? "text-white/70 text-right" : "text-muted-foreground/60"
            )}
          >
            {format(message.timestamp, "HH:mm")}
          </div>
        </div>
        
        {/* Quick reply buttons (only on latest assistant message) */}
        {!isUser && hasQuickReplies && isLatestMessage && onQuickReply && (
          <div className="mt-2 ml-1">
            <QuickReplyButtons
              buttons={message.metadata.quickReplies}
              onButtonClick={onQuickReply}
            />
          </div>
        )}
      </div>
    </div>
  )
}
