"use client"

import { useMemo } from "react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Dispute } from "@/types"
import { AlertTriangle, CheckCircle2, Clock, ShieldAlert } from "lucide-react"

interface DisputesDashboardProps {
  disputes: Dispute[]
  selectedDisputeId: string | null
  onSelectDispute: (disputeId: string) => void
}

function statusBadgeClass(status: Dispute["status"]) {
  switch (status) {
    case "Fraud Confirmed":
      return "bg-red-100 text-red-700 border-red-200"
    case "Under Review":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "Resolved":
      return "bg-green-100 text-green-700 border-green-200"
    default:
      return "bg-neutral-100 text-neutral-700 border-neutral-200"
  }
}

function statusIcon(status: Dispute["status"]) {
  switch (status) {
    case "Fraud Confirmed":
      return <AlertTriangle className="size-4 text-red-600" />
    case "Under Review":
      return <Clock className="size-4 text-amber-600" />
    case "Resolved":
      return <CheckCircle2 className="size-4 text-green-600" />
    default:
      return null
  }
}

function formatMoney(amount: number, currency?: string) {
  if (currency === "INR") return `₹${Math.abs(amount).toLocaleString("en-IN")}`
  return `$${Math.abs(amount).toFixed(2)}`
}

export function DisputesDashboard({
  disputes,
  selectedDisputeId,
  onSelectDispute,
}: DisputesDashboardProps) {
  const selected = useMemo(
    () => disputes.find((d) => d.disputeId === selectedDisputeId) ?? disputes[0] ?? null,
    [disputes, selectedDisputeId]
  )

  const timeline = useMemo(() => {
    if (!selected) return []
    const base = [
      { label: "Dispute created", at: selected.createdAt },
    ]
    if (selected.status === "Under Review") {
      base.push({ label: "Sent to human review", at: selected.createdAt })
    }
    if (selected.status === "Fraud Confirmed") {
      base.push({ label: "Fraud screening completed", at: selected.createdAt })
      base.push({ label: "Card temporarily blocked", at: selected.createdAt })
    }
    if (selected.status === "Resolved") {
      base.push({ label: "Fraud screening completed", at: selected.createdAt })
      base.push({ label: "Case resolved", at: selected.createdAt })
    }
    return base
  }, [selected])

  return (
    <div className="h-full flex">
      {/* List panel */}
      <div className="w-[360px] border-r border-neutral-200 bg-white">
        <div className="h-16 px-5 flex items-center border-b border-neutral-200">
          <div>
            <div className="text-[15px] font-semibold text-foreground">Disputes</div>
            <div className="text-xs text-muted-foreground">
              Internal tracking view (demo)
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-4rem)]">
          <div className="p-3 space-y-2">
            {disputes.map((d) => {
              const isActive = selected?.disputeId === d.disputeId
              return (
                <button
                  key={d.disputeId}
                  onClick={() => onSelectDispute(d.disputeId)}
                  className={cn(
                    "w-full text-left rounded-xl border p-3 transition-colors",
                    isActive
                      ? "border-[#704EFD]/30 bg-[#704EFD]/5"
                      : "border-neutral-200 hover:bg-neutral-50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-[13px] text-foreground truncate">
                        {d.merchant}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {d.transactionId}
                      </div>
                    </div>
                    <div className="text-[13px] font-semibold text-foreground tabular-nums shrink-0">
                      {formatMoney(d.amount, d.currency)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] h-5 px-2 font-medium", statusBadgeClass(d.status))}
                    >
                      {d.status}
                    </Badge>
                    {d.cardStatus === "Blocked" && (
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 px-2 font-medium bg-red-50 text-red-600 border-red-200"
                      >
                        Card Blocked
                      </Badge>
                    )}
                    <span className="ml-auto text-[10px] text-muted-foreground/70">
                      {format(d.createdAt, "MMM dd")}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Details panel */}
      <div className="flex-1 bg-neutral-50/40">
        <div className="h-16 px-6 flex items-center justify-between border-b border-neutral-200 bg-white">
          <div>
            <div className="text-[15px] font-semibold text-foreground">Dispute Details</div>
            <div className="text-xs text-muted-foreground">
              Review summary, status, and activity
            </div>
          </div>
          {selected && (
            <Badge
              variant="outline"
              className={cn("h-6 px-3 font-medium", statusBadgeClass(selected.status))}
            >
              <span className="mr-2">{statusIcon(selected.status)}</span>
              {selected.status}
            </Badge>
          )}
        </div>

        <div className="p-6 space-y-4">
          {!selected ? (
            <Card className="border-neutral-200">
              <CardContent className="p-6 text-sm text-muted-foreground">
                Select a dispute from the list to view details.
              </CardContent>
            </Card>
          ) : (
            <>
              {selected.status === "Fraud Confirmed" && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-center gap-3">
                  <ShieldAlert className="size-5 text-red-600" />
                  <div className="text-sm text-red-800 font-medium">
                    Fraud confirmed for this transaction
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border-neutral-200">
                  <CardContent className="p-5 space-y-3">
                    <div className="text-sm font-semibold text-foreground">Dispute Summary</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      Dispute <span className="font-mono font-medium text-foreground">{selected.disputeId}</span> was
                      raised for <span className="font-medium text-foreground">{selected.merchant}</span>.
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <div className="text-xs text-muted-foreground">Transaction ID</div>
                        <div className="text-sm font-mono font-semibold">{selected.transactionId}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Amount</div>
                        <div className="text-sm font-semibold">{formatMoney(selected.amount, selected.currency)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Date raised</div>
                        <div className="text-sm">{format(selected.createdAt, "MMM dd, yyyy • HH:mm")}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Card status</div>
                        <div className="text-sm font-medium">
                          {selected.cardStatus === "Blocked" ? "Temporarily Blocked" : "Active"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-neutral-200">
                  <CardContent className="p-5 space-y-3">
                    <div className="text-sm font-semibold text-foreground">Timeline / Activity</div>
                    <div className="space-y-2">
                      {timeline.map((t, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-4 rounded-lg bg-white border border-neutral-200 px-3 py-2">
                          <div className="text-sm text-foreground">{t.label}</div>
                          <div className="text-xs text-muted-foreground shrink-0">
                            {format(t.at, "MMM dd, HH:mm")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selected.status === "Fraud Confirmed" && (
                <Card className="border-neutral-200">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-foreground">Card Security</div>
                      <div className="text-sm text-muted-foreground">
                        Status: <span className="font-medium text-foreground">Card Temporarily Blocked</span>
                      </div>
                    </div>
                    <button className="rounded-full bg-[#704EFD] text-white text-sm font-medium px-4 py-2">
                      View Card Actions
                    </button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

