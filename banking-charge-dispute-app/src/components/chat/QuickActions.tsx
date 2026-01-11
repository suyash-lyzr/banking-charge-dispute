"use client"

import { Button } from "@/components/ui/button"
import { Receipt, FileText, AlertCircle } from "lucide-react"

interface QuickActionsProps {
  onActionClick: (action: string) => void
  disabled?: boolean
  showInitialActions?: boolean
}

const QUICK_ACTIONS = [
  {
    label: "Show last transaction",
    icon: Receipt,
  },
  {
    label: "Show last 5 transactions",
    icon: FileText,
  },
  {
    label: "Dispute a charge",
    icon: AlertCircle,
  },
]

export function QuickActions({
  onActionClick,
  disabled = false,
  showInitialActions = true,
}: QuickActionsProps) {
  if (!showInitialActions) return null

  return (
    <div className="flex-shrink-0 bg-neutral-50/50 px-6 py-4 border-t border-neutral-200/60">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
        <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wide">
          Quick Actions
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      </div>
      <div className="flex flex-wrap gap-2.5 justify-center">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.label}
              variant="outline"
              onClick={() => onActionClick(action.label)}
              disabled={disabled}
              className="group relative rounded-xl px-4 py-2.5 h-auto text-[13px] font-medium border-neutral-200 bg-white text-foreground hover:bg-[#704EFD] hover:text-white hover:border-[#704EFD] transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <Icon className="size-4 mr-2 transition-transform group-hover:scale-110" />
              {action.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
