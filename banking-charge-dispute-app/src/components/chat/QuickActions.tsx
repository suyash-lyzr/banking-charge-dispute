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
    <div className="flex-shrink-0 border-t border-border/40 bg-muted/30 px-4 py-4">
      <div className="text-xs text-muted-foreground mb-3 text-center font-medium uppercase tracking-wide">
        Quick actions
      </div>
      <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.label}
              variant="outline"
              onClick={() => onActionClick(action.label)}
              disabled={disabled}
              className="rounded-full px-5 py-2.5 h-auto text-[14px] font-medium border-[#704EFD]/30 text-[#704EFD] hover:bg-[#704EFD] hover:text-white hover:border-[#704EFD] transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <Icon className="size-4 mr-2" />
              {action.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
