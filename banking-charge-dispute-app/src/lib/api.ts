/**
 * API service wrapper for Dispute Orchestrator Agent
 *
 * This is the ONLY API endpoint the frontend communicates with.
 * All sub-agents (Transaction Identification, Fraud Screening, De-escalation)
 * are coordinated internally by the Orchestrator Agent.
 */

import type { AgentRequest, AgentResponse } from "@/types";
import {
  parseTransactionsFromResponse,
  detectFraudQuestion,
} from "./transaction-parser";

const API_BASE_URL = "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
const API_KEY = "sk-default-eE6EHcdIhXl61H4mK4YKZFqISTGrruf1";
const DEFAULT_USER_ID = "suyash@lyzr.ai";
const DEFAULT_AGENT_ID = "69638850c57d451439d52345";

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `${DEFAULT_AGENT_ID}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)}`;
}

/**
 * Send a message to the Dispute Orchestrator Agent
 *
 * @param message - User's message text
 * @param sessionId - Current session identifier
 * @returns Promise with agent response
 */
export async function sendMessageToAgent(
  message: string,
  sessionId: string
): Promise<AgentResponse> {
  try {
    const requestBody: AgentRequest = {
      message,
      session_id: sessionId,
      user_id: DEFAULT_USER_ID,
      agent_id: DEFAULT_AGENT_ID,
    };

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    let reply = "";
    let metadata: Record<string, unknown> = {};

    // Handle different response formats
    // First check for 'response' field (Lyzr Agent API format)
    if (data.response) {
      reply = data.response;
      metadata = data.module_outputs || {};
    }
    // Check for 'reply' field
    else if (data.reply) {
      reply = data.reply;
      metadata = data.metadata || {};
    }
    // Fallback if response format is different
    else if (typeof data === "string") {
      reply = data;
      metadata = {};
    }
    // Last resort: stringify the data
    else {
      reply = JSON.stringify(data);
      metadata = {};
    }

    // Safety: remove any internal routing/tooling text so the UI never shows it.
    // In Lyzr Studio, manager agents may internally use "@Sub-Agent" mentions; users must not see these.
    reply = sanitizeUserFacingText(reply);

    // Parse transactions from metadata or text
    const transactions = parseTransactionsFromResponse(metadata, reply);
    if (transactions) {
      metadata.transactions = transactions;
    }

    // Detect if this is a fraud question
    const isFraudQuestion = detectFraudQuestion(reply);
    if (isFraudQuestion) {
      metadata.isFraudQuestion = true;
    }

    return {
      reply,
      metadata,
    };
  } catch (error) {
    console.error("Error calling agent API:", error);
    throw error;
  }
}

function sanitizeUserFacingText(input: string): string {
  if (!input) return input;

  let text = input;

  // Drop any line that looks like internal manager routing (e.g. "@Fraud Screening Agent, ...")
  text = text
    .split("\n")
    .filter((line) => !/^\s*@.+\bAgent\b/i.test(line.trim()))
    .join("\n");

  // Replace explicit specialist-agent mentions with user-facing wording.
  // (We avoid leaking internal agent architecture in the UI.)
  text = text.replace(/\bFraud Screening Agent\b/gi, "verification process");
  text = text.replace(
    /\bTransaction Identification Agent\b/gi,
    "transaction review"
  );
  text = text.replace(/\bDispute De-escalation Agent\b/gi, "case review");
  text = text.replace(
    /\bConversation Summarisation Agent\b/gi,
    "conversation summary"
  );

  // Clean up excess blank lines created by stripping.
  text = text.replace(/\n{3,}/g, "\n\n").trim();

  return text;
}
