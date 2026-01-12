"use client"

import { Button } from "@/components/ui/button"
import { Receipt, FileText, AlertCircle, TrendingUp, CreditCard, HelpCircle } from "lucide-react"
import Image from "next/image"
import type { ChatVariant } from "./ChatLayout"

interface ChatEmptyStateProps {
  onActionClick: (message: string) => void
  variant?: ChatVariant
}

const SUGGESTIONS = [
  {
    label: "Show last transaction",
    message: "Show me my last transaction",
    icon: Receipt,
  },
  {
    label: "Show last 5 transactions",
    message: "Show me my last 5 transactions",
    icon: FileText,
  },
  {
    label: "Dispute a charge",
    message: "I want to dispute a charge",
    icon: AlertCircle,
  },
  {
    label: "Check account activity",
    message: "Show me my recent account activity",
    icon: TrendingUp,
  },
  {
    label: "Card status inquiry",
    message: "What is my card status?",
    icon: CreditCard,
  },
  {
    label: "How can you help me?",
    message: "What can you help me with?",
    icon: HelpCircle,
  },
]

export function ChatEmptyState({ onActionClick, variant = "mobile" }: ChatEmptyStateProps) {
  if (variant === "mobile") {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 py-8">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
        <div className="size-16 rounded-full bg-primary flex items-center justify-center mb-3 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-8 text-white"
            >
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
          </div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Banco Falabella Asistente</h2>
          <p className="text-xs text-muted-foreground text-center">
            Your intelligent dispute resolution assistant
          </p>
        </div>

        {/* Suggestion Grid */}
        <div className="w-full">
          <div className="grid grid-cols-1 gap-2">
            {SUGGESTIONS.map((suggestion) => {
              const Icon = suggestion.icon
              return (
                <Button
                  key={suggestion.label}
                  variant="outline"
                  onClick={() => onActionClick(suggestion.message)}
                  className="h-auto py-3 px-4 justify-start text-left rounded-lg border-neutral-300 bg-white hover:bg-primary/5 hover:border-primary transition-all group"
                >
                  <div className="flex items-center gap-2.5 w-full">
                    <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                        {suggestion.label}
                      </p>
                    </div>
                    <svg
                      className="size-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-12">
        <div className="size-20 rounded-full bg-primary flex items-center justify-center mb-4 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-10 text-white"
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Banco Falabella Asistente</h2>
        <p className="text-sm text-muted-foreground">
          Your intelligent dispute resolution assistant
        </p>
      </div>

      {/* Suggestion Grid */}
      <div className="w-full max-w-3xl">
        <div className="grid grid-cols-2 gap-3 mb-6">
          {SUGGESTIONS.map((suggestion) => {
            const Icon = suggestion.icon
            return (
              <Button
                key={suggestion.label}
                variant="outline"
                onClick={() => onActionClick(suggestion.message)}
                className="h-auto py-4 px-5 justify-start text-left rounded-xl border-neutral-200 bg-white hover:bg-primary/5 hover:border-primary transition-all group"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {suggestion.label}
                    </p>
                  </div>
                  <svg
                    className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
