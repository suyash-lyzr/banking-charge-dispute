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
    <div className="flex-shrink-0 border-t border-neutral-200 bg-white px-4 py-3">
      <div className="flex flex-wrap gap-2 justify-center">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.label}
              variant="outline"
              onClick={() => onActionClick(action.label)}
              disabled={disabled}
              className="rounded-full px-4 py-2 h-auto text-sm font-medium border-neutral-200 text-[#704EFD] hover:bg-[#704EFD] hover:text-white hover:border-[#704EFD]"
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
