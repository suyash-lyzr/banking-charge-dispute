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
  isDisputed?: boolean
  isMobile?: boolean
}

export function TransactionCard({ transaction, className, onSelect, showDisputeButton = true, onDispute, isDisputed = false, isMobile = false }: TransactionCardProps) {
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

  if (isMobile) {
    return (
      <Card 
        className={cn(
          "mb-1.5 overflow-hidden border border-neutral-300/70 shadow-sm bg-white",
          isClickable && "cursor-pointer hover:border-[#704EFD] hover:shadow-md",
          className
        )}
        onClick={isClickable ? handleClick : undefined}
      >
        <CardContent className="p-0">
          <div className="p-2.5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-start gap-2 flex-1">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#704EFD]/10">
                  <Store className="size-3 text-[#704EFD]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[14px] text-foreground mb-0.5 truncate">
                    {transaction.merchant}
                  </div>
                  <div className="text-[12px] text-muted-foreground">
                    {formatCurrency(transaction.amount, transaction.currency)} <span className="mx-1 text-muted-foreground/50">·</span> {formatDate(transaction.date)}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-neutral-300 text-muted-foreground">
                      <CreditCard className="size-2 mr-0.5" />
                      {transaction.channel}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground/70 font-mono">{transaction.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {showDisputeButton && onDispute && !isDisputed && (
              <Button
                onClick={handleDisputeClick}
                className="w-full rounded-full bg-[#704EFD] hover:bg-[#5a3dd4] text-white font-medium h-8 text-[12px] shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <AlertCircle className="size-3 mr-1" />
                Dispute this charge
              </Button>
            )}
            {isDisputed && (
              <div className="w-full text-center py-1 text-[11px] text-muted-foreground">
                Dispute started
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className={cn(
        "mb-2 overflow-hidden border border-neutral-200/70 shadow-sm bg-white",
        isClickable && "cursor-pointer hover:border-[#704EFD] hover:shadow-md",
        className
      )}
      onClick={isClickable ? handleClick : undefined}
    >
      <CardContent className="p-0">
        <div className="p-3">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex items-start gap-2.5 flex-1">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#704EFD]/10">
                <Store className="size-3.5 text-[#704EFD]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[15px] text-foreground mb-0.5 truncate">
                  {transaction.merchant}
                </div>
                <div className="text-[13px] text-muted-foreground">
                  {formatCurrency(transaction.amount, transaction.currency)} <span className="mx-1 text-muted-foreground/50">·</span> {formatDate(transaction.date)}
                </div>
                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-[11px] h-5 px-2 border-neutral-200 text-muted-foreground">
                    <CreditCard className="size-2.5 mr-1" />
                    {transaction.channel}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground/70 font-mono">{transaction.id}</span>
                </div>
              </div>
            </div>
          </div>

          {showDisputeButton && onDispute && !isDisputed && (
            <Button
              onClick={handleDisputeClick}
              className="w-full rounded-full bg-[#704EFD] hover:bg-[#5a3dd4] text-white font-medium h-9 text-[13px] shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              <AlertCircle className="size-3.5 mr-1.5" />
              Dispute this charge
            </Button>
          )}
          {isDisputed && (
            <div className="w-full text-center py-1.5 text-xs text-muted-foreground">
              Dispute started
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
