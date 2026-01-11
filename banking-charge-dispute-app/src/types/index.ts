/**
 * Core types for the Banking Charge Dispute application
 */

export type MessageRole = "user" | "assistant" | "system";

/**
 * Transaction data structure
 */
export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: Date | string;
  channel: string;
  status?: string;
  currency?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}

export interface QuickReplyButton {
  label: string;
  value: string;
  variant?: "default" | "outline" | "destructive";
}

export interface MessageMetadata {
  transactionId?: string;
  status?: "fraud_confirmed" | "fraud_not_confirmed" | "case_resolved" | "forwarded_to_agent";
  cardStatus?: "blocked" | "active";
  step?: string;
  transactions?: Transaction[];
  isFraudQuestion?: boolean;
  quickReplies?: QuickReplyButton[];
  showQuickActions?: boolean;
}

export interface AgentResponse {
  reply: string;
  metadata?: {
    transactionId?: string;
    status?: string;
    cardStatus?: string;
    step?: string;
    transactions?: Transaction[];
    isFraudQuestion?: boolean;
    quickReplies?: QuickReplyButton[];
    showQuickActions?: boolean;
    [key: string]: unknown;
  };
}

export interface AgentRequest {
  message: string;
  session_id: string;
  user_id?: string;
  agent_id?: string;
}

export interface ObservabilityData {
  messages: Array<{
    id: string;
    role: MessageRole;
    timestamp: Date;
    step?: string;
    latency?: number;
  }>;
  totalSteps: number;
  finalOutcome?: "fraud" | "not_fraud" | "resolved" | "pending";
  totalLatency: number;
}

export interface ResolutionCardData {
  transactionId: string;
  status: "fraud_confirmed" | "fraud_not_confirmed" | "case_resolved" | "forwarded_to_agent";
  cardStatus?: "blocked" | "active";
  message: string;
}
