"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface QuickReplyButton {
  label: string
  value: string
  variant?: "default" | "outline" | "destructive"
}

interface QuickReplyButtonsProps {
  buttons: QuickReplyButton[]
  onButtonClick: (value: string) => void
  disabled?: boolean
  isMobile?: boolean
}

export function QuickReplyButtons({ buttons, onButtonClick, disabled, isMobile = false }: QuickReplyButtonsProps) {
  if (buttons.length === 0) return null

  if (isMobile) {
    return (
      <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={() => !disabled && onButtonClick(button.value)}
            disabled={disabled}
            className={cn(
              "rounded-full px-4 py-2.5 h-auto text-[14px] font-medium transition-all whitespace-nowrap shrink-0",
              "bg-white border border-[#704EFD] text-[#704EFD]",
              "active:scale-95 shadow-sm",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              !disabled && "hover:bg-[#704EFD] hover:text-white"
            )}
          >
            {button.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2 mt-3 justify-start">
      {buttons.map((button, index) => (
        <Button
          key={index}
          onClick={() => onButtonClick(button.value)}
          disabled={disabled}
          variant={button.variant || "outline"}
          className={cn(
            "rounded-full px-5 py-2.5 h-auto text-[14px] font-medium transition-all",
            "border-[#704EFD] text-[#704EFD] hover:bg-[#704EFD] hover:text-white",
            "active:scale-95 shadow-sm hover:shadow-md",
            button.variant === "destructive" && "border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {button.label}
        </Button>
      ))}
    </div>
  )
}
