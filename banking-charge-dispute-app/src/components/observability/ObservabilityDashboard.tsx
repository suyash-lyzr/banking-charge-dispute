"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  MessageSquare, 
  ShieldAlert, 
  ShieldCheck, 
  UserCircle, 
  Clock,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  DollarSign,
  Activity
} from "lucide-react"
import { format } from "date-fns"

// Mock trace data
const MOCK_TRACES = [
  {
    id: "TRC-289095",
    status: "Fraud Confirmed" as const,
    duration: 1.9,
    cost: 0.016,
    timestamp: new Date(Date.now() - 3600000),
    userId: "user_****2847",
    channel: "Web",
    agents: [
      { name: "Dispute Orchestrator", tokens: 450, latency: 0.3, status: "success" },
      { name: "Transaction Identification", tokens: 320, latency: 0.5, status: "success" },
      { name: "Fraud Screening", tokens: 890, latency: 1.0, status: "success" },
    ],
    outcome: "fraud_confirmed",
    questionsAsked: 4,
    confidence: "High",
  },
  {
    id: "TRC-289102",
    status: "Resolved" as const,
    duration: 2.4,
    cost: 0.012,
    timestamp: new Date(Date.now() - 7200000),
    userId: "user_****4521",
    channel: "WhatsApp",
    agents: [
      { name: "Dispute Orchestrator", tokens: 380, latency: 0.3, status: "success" },
      { name: "Transaction Identification", tokens: 290, latency: 0.4, status: "success" },
      { name: "Fraud Screening", tokens: 720, latency: 0.9, status: "success" },
      { name: "Dispute De-escalation", tokens: 540, latency: 0.8, status: "success" },
    ],
    outcome: "resolved",
    questionsAsked: 3,
    confidence: "High",
  },
  {
    id: "TRC-289110",
    status: "Escalated" as const,
    duration: 3.1,
    cost: 0.021,
    timestamp: new Date(Date.now() - 10800000),
    userId: "user_****9012",
    channel: "Web",
    agents: [
      { name: "Dispute Orchestrator", tokens: 420, latency: 0.3, status: "success" },
      { name: "Transaction Identification", tokens: 310, latency: 0.5, status: "success" },
      { name: "Fraud Screening", tokens: 950, latency: 1.2, status: "success" },
      { name: "Dispute De-escalation", tokens: 680, latency: 1.1, status: "escalated" },
    ],
    outcome: "escalated",
    questionsAsked: 5,
    confidence: "Medium",
  },
]

export function ObservabilityDashboard() {
  const [selectedTrace, setSelectedTrace] = useState(MOCK_TRACES[0])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Fraud Confirmed":
        return "bg-red-100 text-red-700 border-red-200"
      case "Resolved":
        return "bg-green-100 text-green-700 border-green-200"
      case "Escalated":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200"
    }
  }

  return (
    <div className="h-full w-full bg-neutral-50 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Observability</h1>
            <p className="text-sm text-muted-foreground mt-1">
              AI agent performance, traces, and governance
            </p>
          </div>
          <Badge variant="outline" className="text-xs px-3 py-1 bg-[#704EFD] text-white border-[#704EFD]">
            Demo Environment
          </Badge>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="border-neutral-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <MessageSquare className="size-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-semibold text-foreground">815</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Total Conversations</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">Last 7 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <ShieldAlert className="size-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-semibold text-foreground">124</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Total Disputes Raised</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">Automated by AI</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-50">
                  <ShieldCheck className="size-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-semibold text-foreground">46</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Fraud Confirmed</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">37% of disputes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-50">
                  <UserCircle className="size-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-semibold text-foreground">22</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Human Escalations</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">17% escalation rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-50">
                  <Clock className="size-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-semibold text-foreground">2.4m</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Avg Resolution Time</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">End-to-end</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trace Explorer */}
        <div className="grid grid-cols-[400px_1fr] gap-4 min-h-[500px]">
          {/* Left: Trace List */}
          <Card className="border-neutral-200">
            <CardHeader className="border-b border-neutral-200 pb-3">
              <CardTitle className="text-base font-semibold">Recent Traces</CardTitle>
              <p className="text-xs text-muted-foreground">Agent execution traces</p>
            </CardHeader>
            <ScrollArea className="h-[calc(600px-80px)]">
              <div className="p-3 space-y-2">
                {MOCK_TRACES.map((trace) => (
                  <button
                    key={trace.id}
                    onClick={() => setSelectedTrace(trace)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedTrace.id === trace.id
                        ? "border-[#704EFD] bg-[#704EFD]/5"
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-mono font-medium">{trace.id}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] h-5 px-2 ${getStatusColor(trace.status)}`}
                      >
                        {trace.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {trace.duration}s
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="size-3" />
                        ${trace.cost.toFixed(3)}
                      </span>
                      <span className="flex-1 text-right">
                        {format(trace.timestamp, "HH:mm")}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Right: Trace Details */}
          <Card className="border-neutral-200">
            <CardHeader className="border-b border-neutral-200 pb-3">
              <CardTitle className="text-base font-semibold">Trace Details</CardTitle>
              <p className="text-xs text-muted-foreground">{selectedTrace.id}</p>
            </CardHeader>
            <ScrollArea className="h-[450px]">
              <div className="p-4 space-y-4">
                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">User ID</p>
                    <p className="text-sm font-mono">{selectedTrace.userId}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Channel</p>
                    <p className="text-sm font-medium">{selectedTrace.channel}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Total Latency</p>
                    <p className="text-sm font-medium">{selectedTrace.duration}s</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Total Cost</p>
                    <p className="text-sm font-medium">${selectedTrace.cost.toFixed(3)}</p>
                  </div>
                </div>

                {/* Agent Execution Flow */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Agent Execution Flow</h3>
                  <div className="space-y-2">
                    {selectedTrace.agents.map((agent, index) => (
                      <div key={index} className="relative">
                        <div className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 bg-white">
                          <div className={`p-2 rounded-lg ${
                            agent.status === "success" ? "bg-green-50" : 
                            agent.status === "escalated" ? "bg-amber-50" : "bg-neutral-50"
                          }`}>
                            {agent.status === "success" ? (
                              <CheckCircle2 className="size-4 text-green-600" />
                            ) : agent.status === "escalated" ? (
                              <AlertTriangle className="size-4 text-amber-600" />
                            ) : (
                              <Activity className="size-4 text-neutral-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{agent.name}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Zap className="size-3" />
                                {agent.tokens} tokens
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {agent.latency}s
                              </span>
                            </div>
                          </div>
                          {agent.status === "success" && (
                            <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                              Success
                            </Badge>
                          )}
                          {agent.status === "escalated" && (
                            <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                              Escalated
                            </Badge>
                          )}
                        </div>
                        {index < selectedTrace.agents.length - 1 && (
                          <div className="flex justify-center py-1">
                            <ChevronRight className="size-4 text-muted-foreground rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decision Summary */}
                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <h3 className="text-sm font-semibold mb-3">Decision Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Outcome:</span>
                      <span className="font-medium capitalize">{selectedTrace.outcome.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Questions Asked:</span>
                      <span className="font-medium">{selectedTrace.questionsAsked}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="font-medium">{selectedTrace.confidence}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Cost & Analytics */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-neutral-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Model Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GPT-4.1-mini</span>
                <span className="font-medium">$23.40</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GPT-4.1</span>
                <span className="font-medium">$12.73</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span className="text-[#704EFD]">$36.13</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Outcome Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">Fraud Confirmed</span>
                </div>
                <span className="font-medium">37%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">Resolved</span>
                </div>
                <span className="font-medium">46%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">Escalated</span>
                </div>
                <span className="font-medium">17%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Latency</span>
                <span className="font-medium">2.1s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-medium text-green-600">98.3%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uptime</span>
                <span className="font-medium">99.9%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Governance */}
        <Card className="border-neutral-200">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">AI Governance & Safety</CardTitle>
            <p className="text-xs text-muted-foreground">Enterprise compliance and audit readiness</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">All actions logged and traceable</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Complete audit trail for every decision
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">No autonomous card blocking</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    AI recommends, bank policy executes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Human-in-the-loop for edge cases</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Automatic escalation when confidence is low
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Audit-ready decision trails</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Compliance with banking regulations
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
