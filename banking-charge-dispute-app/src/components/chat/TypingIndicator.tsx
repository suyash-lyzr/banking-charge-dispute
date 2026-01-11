"use client"

export function TypingIndicator() {
  return (
    <div className="flex w-full justify-start mb-2">
      <div className="flex items-center gap-3">
        {/* Bot avatar */}
        <div className="size-8 shrink-0 rounded-full bg-gradient-to-br from-[#704EFD] to-[#5a3dd4] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 text-white"
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        </div>
        
        {/* Typing bubble */}
        <div className="bg-neutral-100 px-5 py-3 rounded-2xl rounded-tl-sm">
          <div className="flex items-center gap-1">
            <div className="size-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]" />
            <div className="size-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]" />
            <div className="size-2 rounded-full bg-muted-foreground/40 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
