"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Dispute } from "@/types"
import { format } from "date-fns"
import { Shield, AlertCircle } from "lucide-react"

interface DisputesSidebarProps {
  disputes: Dispute[]
}

export function DisputesSidebar({ disputes }: DisputesSidebarProps) {
  const getStatusColor = (status: Dispute["status"]) => {
    switch (status) {
      case "Fraud Confirmed":
        return "bg-red-100 text-red-700 border-red-200"
      case "Resolved":
        return "bg-green-100 text-green-700 border-green-200"
      case "Under Review":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200"
    }
  }

  return (
    <div className="w-80 border-r border-neutral-200/70 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200/70">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="size-5 text-[#704EFD]" />
          <h2 className="font-semibold text-[17px] text-foreground">Disputes</h2>
        </div>
        <p className="text-xs text-muted-foreground">Track your dispute requests</p>
      </div>

      {/* Disputes List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {disputes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="size-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <AlertCircle className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No disputes yet
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Disputed transactions will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {disputes.map((dispute) => (
                <div
                  key={dispute.disputeId}
                  className="p-3 rounded-lg border border-neutral-200/70 bg-white hover:bg-neutral-50/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[13px] text-foreground truncate">
                        {dispute.merchant}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {dispute.transactionId}
                      </div>
                    </div>
                    <div className="text-[13px] font-semibold text-foreground tabular-nums">
                      {dispute.currency === "INR" ? "₹" : "$"}
                      {Math.abs(dispute.amount).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] h-5 px-2 w-fit font-medium",
                        getStatusColor(dispute.status)
                      )}
                    >
                      {dispute.status}
                    </Badge>
                    
                    {dispute.cardStatus === "Blocked" && (
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 px-2 w-fit font-medium bg-red-50 text-red-600 border-red-200"
                      >
                        Card Blocked
                      </Badge>
                    )}

                    <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                      {format(dispute.createdAt, "MMM dd, HH:mm")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
