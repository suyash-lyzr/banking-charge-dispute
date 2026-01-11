"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/AppSidebar"
import { ObservabilityDashboard } from "@/components/observability/ObservabilityDashboard"
import type { ObservabilityData } from "@/types"

export default function ObservabilityPage() {
  const [data, setData] = useState<ObservabilityData>({
    messages: [],
    totalSteps: 0,
    totalLatency: 0,
  })

  useEffect(() => {
    // Load observability data from localStorage or use mock data for demo
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("observability_data")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          // Convert timestamp strings back to Date objects
          const parsedData: ObservabilityData = {
            ...parsed,
            messages: parsed.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }
          setData(parsedData)
        } catch (e) {
          console.error("Error parsing observability data:", e)
        }
      } else {
        // Mock data for demo purposes
        setData({
          messages: [
            {
              id: "1",
              role: "user",
              timestamp: new Date(),
              step: "transaction_identification",
              latency: 120,
            },
            {
              id: "2",
              role: "assistant",
              timestamp: new Date(),
              step: "fraud_screening",
              latency: 250,
            },
          ],
          totalSteps: 2,
          finalOutcome: "pending",
          totalLatency: 370,
        })
      }
    }
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AppSidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-background">
        <ObservabilityDashboard data={data} />
      </div>
    </div>
  )
}
