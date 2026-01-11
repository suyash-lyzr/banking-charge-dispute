"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { sendMessageToAgent, generateSessionId } from "@/lib/api";
import type {
  Message,
  ResolutionCardData,
  Transaction,
  QuickReplyButton,
} from "@/types";

export default function HomePage() {
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

        // Check for resolution status
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
            } else if (
              status === "fraud_not_confirmed" ||
              status.toLowerCase().includes("not fraud")
            ) {
              resolutionStatus = "fraud_not_confirmed";
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

      const disputeMessage = `I want to dispute the transaction ${transaction.id} - ${transaction.merchant} for ${transaction.amount}`;
      handleSendMessage(disputeMessage);
    },
    [handleSendMessage]
  );

  return (
    <div className="min-h-screen w-screen bg-neutral-100 flex justify-center p-4 md:p-6">
      <div className="w-full max-w-[820px] h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden">
        <ChatLayout
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          resolutionCard={resolutionCard}
          onForwardToAgent={handleForwardToAgent}
          onClearChat={handleClearChat}
          onTransactionDispute={handleTransactionDispute}
          disputedTransactionIds={disputedTransactionIds}
          showQuickActions={true}
        />
      </div>
    </div>
  );
}
