"use client"

import { useRouter } from "next/navigation"
import { AppSidebar, type AppView } from "@/components/AppSidebar"
import { ObservabilityDashboard } from "@/components/observability/ObservabilityDashboard"

export default function ObservabilityPage() {
  const router = useRouter()

  const handleViewChange = (view: AppView) => {
    if (view === "chat") {
      router.push("/")
    } else if (view === "disputes") {
      router.push("/disputes")
    } else if (view === "observability") {
      router.push("/observability")
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AppSidebar activeView="observability" onChangeView={handleViewChange} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-background">
        <ObservabilityDashboard />
      </div>
    </div>
  )
}
