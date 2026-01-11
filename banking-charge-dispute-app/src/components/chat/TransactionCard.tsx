"use client"

import { format } from "date-fns"
import { CreditCard, Store, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Transaction } from "@/types"

interface TransactionCardProps {
  transaction: Transaction
  className?: string
  onSelect?: (transaction: Transaction) => void
  showDisputeButton?: boolean
  onDispute?: (transaction: Transaction) => void
}

export function TransactionCard({ transaction, className, onSelect, showDisputeButton = true, onDispute }: TransactionCardProps) {
  const isClickable = !!onSelect && !showDisputeButton
  
  // Format the date properly whether it's a Date object or string
  const formatDate = (date: Date | string) => {
    try {
      if (typeof date === "string") {
        return format(new Date(date), "MMM dd, yyyy")
      }
      return format(date, "MMM dd, yyyy")
    } catch {
      return String(date)
    }
  }

  // Format currency based on the currency field
  const formatCurrency = (amount: number, currency?: string) => {
    const absAmount = Math.abs(amount)
    if (currency === "INR") {
      return `₹${absAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `$${absAmount.toFixed(2)}`
  }

  const handleClick = () => {
    if (onSelect) {
      onSelect(transaction)
    }
  }

  const handleDisputeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDispute) {
      onDispute(transaction)
    }
  }

  return (
    <Card 
      className={cn(
        "animate-in fade-in-50 slide-in-from-bottom-2 duration-500 mb-4 overflow-hidden border-border/40 transition-all bg-white dark:bg-card",
        isClickable && "cursor-pointer hover:border-[#704EFD] hover:shadow-md active:scale-[0.99]",
        className
      )}
      onClick={isClickable ? handleClick : undefined}
    >
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#704EFD]/10">
                <Store className="size-4 text-[#704EFD]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[16px] text-foreground mb-1 truncate">
                  {transaction.merchant}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground">
                  <span>{formatDate(transaction.date)}</span>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="capitalize">{transaction.channel} transaction</span>
                </div>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-xl font-bold text-foreground tabular-nums">
                {formatCurrency(transaction.amount, transaction.currency)}
              </div>
            </div>
          </div>

          {showDisputeButton && onDispute && (
            <Button
              onClick={handleDisputeClick}
              className="w-full rounded-full bg-[#704EFD] hover:bg-[#5a3dd4] text-white font-medium h-11 text-[15px] shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              <AlertCircle className="size-4 mr-2" />
              Dispute this charge
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
