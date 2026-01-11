"use client"

import { Shield, CheckCircle, XCircle, AlertCircle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ResolutionCardData } from "@/types"
import { cn } from "@/lib/utils"

interface ResolutionCardProps {
  data: ResolutionCardData
  onForwardToAgent?: () => void
}

export function ResolutionCard({
  data,
  onForwardToAgent,
}: ResolutionCardProps) {
  const getStatusConfig = () => {
    switch (data.status) {
      case "fraud_confirmed":
        return {
          icon: Shield,
          iconColor: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-950/20",
          borderColor: "border-red-200 dark:border-red-900/50",
          badgeVariant: "destructive" as const,
          badgeText: "Fraud Confirmed",
        }
      case "fraud_not_confirmed":
        return {
          icon: CheckCircle,
          iconColor: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-950/20",
          borderColor: "border-green-200 dark:border-green-900/50",
          badgeVariant: "default" as const,
          badgeText: "Verified Transaction",
        }
      case "case_resolved":
        return {
          icon: CheckCircle,
          iconColor: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-950/20",
          borderColor: "border-green-200 dark:border-green-900/50",
          badgeVariant: "default" as const,
          badgeText: "Case Resolved",
        }
      case "forwarded_to_agent":
        return {
          icon: AlertCircle,
          iconColor: "text-primary",
          bgColor: "bg-primary/5",
          borderColor: "border-primary/20",
          badgeVariant: "secondary" as const,
          badgeText: "Forwarded to Agent",
        }
      default:
        return {
          icon: AlertCircle,
          iconColor: "text-muted-foreground",
          bgColor: "bg-muted/50",
          borderColor: "border-border",
          badgeVariant: "outline" as const,
          badgeText: "Pending",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <div className="mx-auto max-w-3xl px-6 pb-4">
      <Card className={cn(
        "animate-in fade-in-50 slide-in-from-bottom-4 duration-700 border-2",
        config.borderColor
      )}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl shadow-sm",
                  config.bgColor
                )}
              >
                <Icon className={cn("size-5", config.iconColor)} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground leading-none mb-1.5">
                  Resolution Status
                </h3>
                <Badge variant={config.badgeVariant} className="text-xs font-medium">
                  {config.badgeText}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            {data.message}
          </p>
          
          <div className="rounded-lg bg-muted/30 p-4 space-y-2.5 border border-border/40">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium">Transaction ID</span>
              <span className="font-mono text-sm font-semibold text-foreground">{data.transactionId}</span>
            </div>
            {data.cardStatus && (
              <div className="flex items-center justify-between pt-1.5 border-t border-border/40">
                <span className="text-sm text-muted-foreground font-medium">Card Status</span>
                <Badge
                  variant={data.cardStatus === "blocked" ? "destructive" : "default"}
                  className="font-semibold"
                >
                  {data.cardStatus === "blocked" ? "🔒 Blocked" : "✓ Active"}
                </Badge>
              </div>
            )}
          </div>

          {data.status === "fraud_not_confirmed" && onForwardToAgent && (
            <Button
              variant="outline"
              className="w-full h-11 rounded-full hover:bg-primary hover:text-primary-foreground transition-all shadow-sm group"
              onClick={onForwardToAgent}
            >
              Forward to Human Agent
              <ArrowRight className="size-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
