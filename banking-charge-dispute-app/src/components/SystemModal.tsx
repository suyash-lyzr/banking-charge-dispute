"use client"

import { AlertTriangle, CreditCard, Shield, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect } from "react"

interface SystemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  disputeId: string
  transactionId: string
  merchant: string
  amount: number
  currency?: string
}

export function SystemModal({
  open,
  onOpenChange,
  disputeId,
  transactionId,
  merchant,
  amount,
  currency = "USD",
}: SystemModalProps) {
  const formatCurrency = (amt: number, curr?: string) => {
    if (curr === "INR") {
      return `₹${Math.abs(amt).toLocaleString("en-IN")}`
    }
    return `$${Math.abs(amt).toFixed(2)}`
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 p-1 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X className="size-4 text-muted-foreground" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="size-6 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Security Action Taken</h2>
          </div>

          <div className="space-y-4">
          <p className="text-[15px] leading-relaxed text-foreground">
            We detected unauthorized activity on your card. Your card has been temporarily blocked to prevent further misuse.
          </p>

          <div className="rounded-lg bg-neutral-50 border border-neutral-200/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Dispute ID</span>
              <span className="font-mono text-sm font-semibold">{disputeId}</span>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-neutral-200/50">
              <span className="text-sm text-muted-foreground">Transaction</span>
              <div className="text-right">
                <div className="font-semibold text-sm">{merchant}</div>
                <div className="text-xs text-muted-foreground">{transactionId}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200/50">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="font-semibold text-sm">{formatCurrency(amount, currency)}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200/50">
              <span className="text-sm text-muted-foreground">Card Status</span>
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 font-medium">
                🔒 Blocked
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="outline"
              className="w-full rounded-full h-10 border-[#704EFD] text-[#704EFD] hover:bg-[#704EFD] hover:text-white"
              onClick={() => {
                // Mock action
                alert("New card request feature coming soon")
              }}
            >
              <CreditCard className="size-4 mr-2" />
              Request New Card
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full h-10"
              onClick={() => onOpenChange(false)}
            >
              <Shield className="size-4 mr-2" />
              Contact Support
            </Button>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
