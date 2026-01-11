"use client";

import { useState, useEffect, useCallback } from "react";
import { MobileChatFrame } from "@/components/chat/MobileChatFrame";
import { WebChatFrame } from "@/components/chat/WebChatFrame";
import { SystemModal } from "@/components/SystemModal";
import { AppSidebar, type AppView } from "@/components/AppSidebar";
import { DisputesDashboard } from "@/components/disputes/DisputesDashboard";
import { ObservabilityDashboard } from "@/components/observability/ObservabilityDashboard";
import { sendMessageToAgent, generateSessionId } from "@/lib/api";
import type {
  Message,
  ResolutionCardData,
  Transaction,
  QuickReplyButton,
  Dispute,
} from "@/types";

function seedDemoDisputes(): Dispute[] {
  const now = new Date();
  return [
    {
      disputeId: "DSP-1010",
      transactionId: "TXN1010",
      merchant: "ATM Withdrawal",
      amount: 10000,
      currency: "INR",
      status: "Fraud Confirmed",
      cardStatus: "Blocked",
      createdAt: now,
    },
    {
      disputeId: "DSP-1009",
      transactionId: "TXN1009",
      merchant: "Flipkart",
      amount: 12499,
      currency: "INR",
      status: "Under Review",
      cardStatus: "Active",
      createdAt: now,
    },
    {
      disputeId: "DSP-1007",
      transactionId: "TXN1007",
      merchant: "Zomato",
      amount: 560,
      currency: "INR",
      status: "Resolved",
      cardStatus: "Active",
      createdAt: now,
    },
  ];
}

export type ChatMode = "mobile" | "web";

export default function HomePage() {
  const [activeView, setActiveView] = useState<AppView>("chat");
  const [chatMode, setChatMode] = useState<ChatMode>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chat_mode");
      if (stored === "mobile" || stored === "web") return stored;
    }
    return "mobile";
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chat_session_id");
      if (stored) return stored;
      const newId = generateSessionId();
      localStorage.setItem("chat_session_id", newId);
      return newId;
    }
    return generateSessionId();
  });
  const [resolutionCard, setResolutionCard] =
    useState<ResolutionCardData | null>(null);
  const [disputedTransactionIds, setDisputedTransactionIds] = useState<
    Set<string>
  >(new Set());
  const [disputes, setDisputes] = useState<Dispute[]>(seedDemoDisputes);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(
    null
  );
  const [systemModal, setSystemModal] = useState<{
    open: boolean;
    disputeId: string;
    transactionId: string;
    merchant: string;
    amount: number;
    currency?: string;
  } | null>(null);
  const [currentDisputeTransaction, setCurrentDisputeTransaction] =
    useState<Transaction | null>(null);
  const [currentDisputeId, setCurrentDisputeId] = useState<string | null>(null);

  const inferDisputeOutcomeFromText = (text: string) => {
    const t = text.toLowerCase();
    const fraudConfirmed =
      t.includes("fraud confirmed") ||
      t.includes("unauthorized") ||
      t.includes("temporarily blocked") ||
      t.includes("card has been blocked") ||
      t.includes("card has been temporarily blocked");
    const resolved =
      t.includes("resolved") ||
      t.includes("valid charge") ||
      t.includes("authorized") ||
      t.includes("considered a valid charge");
    const underReview =
      t.includes("under review") ||
      t.includes("human review") ||
      t.includes("investigation") ||
      t.includes("we will investigate");

    return { fraudConfirmed, resolved, underReview };
  };

  // Initialize with system greeting
  useEffect(() => {
    const initialMessage: Message = {
      id: "initial",
      role: "system",
      content: "Hi 👋 I'm your banking assistant. How can I help you today?",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  // Detect if we should show Yes/No quick replies for fraud questions
  const detectQuickRepliesNeeded = (
    text: string
  ): QuickReplyButton[] | undefined => {
    const lowerText = text.toLowerCase();

    // Safety: only show yes/no buttons when there's a single question (not a list)
    const questionCount = (text.match(/\?/g) || []).length;
    const looksEnumerated = /\n?\s*\d+\.\s+/.test(text);
    if (questionCount !== 1 || looksEnumerated) return undefined;

    // Check if this is a Yes/No question
    if (
      (lowerText.includes("did you") ||
        lowerText.includes("have you") ||
        lowerText.includes("do you") ||
        lowerText.includes("were you") ||
        lowerText.includes("was this")) &&
      lowerText.includes("?")
    ) {
      return [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ];
    }

    // Check for fraud confirmation responses
    if (lowerText.includes("would you like to") && lowerText.includes("?")) {
      return [
        { label: "Yes, please", value: "Yes" },
        { label: "No, thanks", value: "No" },
      ];
    }

    return undefined;
  };

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const startTime = Date.now();
        const response = await sendMessageToAgent(content, sessionId);
        const latency = Date.now() - startTime;

        // Detect if we need quick reply buttons
        const quickReplies = detectQuickRepliesNeeded(response.reply);

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.reply,
          timestamp: new Date(),
          metadata: {
            transactions: response.metadata?.transactions as
              | Transaction[]
              | undefined,
            isFraudQuestion: response.metadata?.isFraudQuestion as
              | boolean
              | undefined,
            quickReplies: quickReplies,
            step: response.metadata?.step as string | undefined,
          },
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Reflect outcomes into dispute tracking (frontend-only)
        if (response.metadata) {
          const status = response.metadata.status as string | undefined;
          const transactionId = response.metadata.transactionId as
            | string
            | undefined;

          if (status && transactionId) {
            let resolutionStatus: ResolutionCardData["status"] =
              "case_resolved";

            if (
              status === "fraud_confirmed" ||
              status.toLowerCase().includes("fraud")
            ) {
              resolutionStatus = "fraud_confirmed";

              // Update existing dispute to "Fraud Confirmed"
              setDisputes((prev) =>
                prev.map((d) =>
                  d.transactionId === transactionId
                    ? {
                        ...d,
                        status: "Fraud Confirmed" as const,
                        cardStatus: "Blocked" as const,
                      }
                    : d
                )
              );

              // Show system modal
              if (currentDisputeTransaction) {
                setSystemModal({
                  open: true,
                  disputeId:
                    currentDisputeId ||
                    `DSP-${Date.now().toString().slice(-6)}`,
                  transactionId,
                  merchant:
                    currentDisputeTransaction.merchant || "Unknown Merchant",
                  amount: currentDisputeTransaction.amount || 0,
                  currency: currentDisputeTransaction.currency || "INR",
                });
              }
            } else if (
              status === "fraud_not_confirmed" ||
              status.toLowerCase().includes("not fraud")
            ) {
              resolutionStatus = "fraud_not_confirmed";

              // Update existing dispute to "Resolved"
              setDisputes((prev) =>
                prev.map((d) =>
                  d.transactionId === transactionId
                    ? {
                        ...d,
                        status: "Resolved" as const,
                        cardStatus: "Active" as const,
                      }
                    : d
                )
              );
            } else if (
              status === "forwarded_to_agent" ||
              status.toLowerCase().includes("forward")
            ) {
              resolutionStatus = "forwarded_to_agent";
            }

            setResolutionCard({
              transactionId: transactionId || "N/A",
              status: resolutionStatus,
              cardStatus: response.metadata.cardStatus as
                | "blocked"
                | "active"
                | undefined,
              message: response.reply,
            });
          }
        }

        // Fallback: if no metadata-based status is present, update dispute from the agent's text
        if (currentDisputeTransaction) {
          const { fraudConfirmed, resolved, underReview } =
            inferDisputeOutcomeFromText(response.reply);
          if (fraudConfirmed) {
            setDisputes((prev) =>
              prev.map((d) =>
                d.transactionId === currentDisputeTransaction.id
                  ? {
                      ...d,
                      status: "Fraud Confirmed" as const,
                      cardStatus: "Blocked" as const,
                    }
                  : d
              )
            );
            setSystemModal({
              open: true,
              disputeId:
                currentDisputeId || `DSP-${Date.now().toString().slice(-6)}`,
              transactionId: currentDisputeTransaction.id,
              merchant: currentDisputeTransaction.merchant,
              amount: currentDisputeTransaction.amount,
              currency: currentDisputeTransaction.currency || "INR",
            });
          } else if (resolved) {
            setDisputes((prev) =>
              prev.map((d) =>
                d.transactionId === currentDisputeTransaction.id
                  ? {
                      ...d,
                      status: "Resolved" as const,
                      cardStatus: "Active" as const,
                    }
                  : d
              )
            );
          } else if (underReview) {
            setDisputes((prev) =>
              prev.map((d) =>
                d.transactionId === currentDisputeTransaction.id
                  ? { ...d, status: "Under Review" as const }
                  : d
              )
            );
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, isLoading]
  );

  const handleForwardToAgent = useCallback(() => {
    const forwardMessage: Message = {
      id: `forward-${Date.now()}`,
      role: "system",
      content:
        "Your case has been forwarded to a human agent. They will contact you shortly.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, forwardMessage]);
    setResolutionCard({
      transactionId: resolutionCard?.transactionId || "N/A",
      status: "forwarded_to_agent",
      message: "Your case has been forwarded to a human agent.",
    });
  }, [resolutionCard]);

  const handleToggleChatMode = useCallback(() => {
    const newMode: ChatMode = chatMode === "mobile" ? "web" : "mobile";
    setChatMode(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("chat_mode", newMode);
    }
  }, [chatMode]);

  const handleClearChat = useCallback(() => {
    const initialMessage: Message = {
      id: "initial",
      role: "system",
      content: "Hi 👋 I'm your banking assistant. How can I help you today?",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    setResolutionCard(null);
    setDisputedTransactionIds(new Set());
    setDisputes(seedDemoDisputes());
    setSystemModal(null);
    setSelectedDisputeId(null);
    setCurrentDisputeTransaction(null);
    setCurrentDisputeId(null);

    const newSessionId = generateSessionId();
    setSessionId(newSessionId);

    if (typeof window !== "undefined") {
      localStorage.setItem("chat_session_id", newSessionId);
    }
  }, []);

  const handleTransactionDispute = useCallback(
    (transaction: Transaction) => {
      // Mark this transaction as disputed
      setDisputedTransactionIds((prev) => new Set(prev).add(transaction.id));

      // Store transaction for later dispute updates
      setCurrentDisputeTransaction(transaction);

      // Create an "Under Review" dispute immediately (if not already present)
      setDisputes((prev) => {
        if (prev.some((d) => d.transactionId === transaction.id)) return prev;
        const disputeId = `DSP-${Date.now().toString().slice(-6)}`;
        setCurrentDisputeId(disputeId);
        const newDispute: Dispute = {
          disputeId,
          transactionId: transaction.id,
          merchant: transaction.merchant,
          amount: transaction.amount,
          currency: transaction.currency || "INR",
          status: "Under Review",
          cardStatus: "Active",
          createdAt: new Date(),
        };
        return [newDispute, ...prev];
      });

      const disputeMessage = `I want to dispute the transaction ${transaction.id} - ${transaction.merchant} for ${transaction.amount}`;
      handleSendMessage(disputeMessage);
    },
    [handleSendMessage]
  );

  return (
    <div className="h-screen w-screen bg-neutral-100 flex">
      <AppSidebar activeView={activeView} onChangeView={setActiveView} />

      <div className="flex-1 min-w-0 bg-neutral-100">
        {activeView === "chat" && (
          <>
            {chatMode === "mobile" ? (
              <MobileChatFrame
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                resolutionCard={resolutionCard}
                onForwardToAgent={handleForwardToAgent}
                onClearChat={handleClearChat}
                onTransactionDispute={handleTransactionDispute}
                disputedTransactionIds={disputedTransactionIds}
                onToggleChatMode={handleToggleChatMode}
                systemModal={systemModal}
                onSystemModalOpenChange={(open) =>
                  setSystemModal(open ? systemModal : null)
                }
              />
            ) : (
              <WebChatFrame
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                resolutionCard={resolutionCard}
                onForwardToAgent={handleForwardToAgent}
                onClearChat={handleClearChat}
                onTransactionDispute={handleTransactionDispute}
                disputedTransactionIds={disputedTransactionIds}
                onToggleChatMode={handleToggleChatMode}
              />
            )}
          </>
        )}

        {activeView === "disputes" && (
          <div className="h-full w-full bg-neutral-100">
            <DisputesDashboard
              disputes={disputes}
              selectedDisputeId={selectedDisputeId}
              onSelectDispute={setSelectedDisputeId}
            />
          </div>
        )}

        {activeView === "observability" && (
          <div className="h-full w-full">
            <ObservabilityDashboard />
          </div>
        )}
      </div>

      {/* System Modal for Fraud Confirmation */}
      {systemModal && !(activeView === "chat" && chatMode === "mobile") && (
        <SystemModal
          open={systemModal.open}
          onOpenChange={(open) => setSystemModal(open ? systemModal : null)}
          disputeId={systemModal.disputeId}
          transactionId={systemModal.transactionId}
          merchant={systemModal.merchant}
          amount={systemModal.amount}
          currency={systemModal.currency}
        />
      )}
    </div>
  );
}
