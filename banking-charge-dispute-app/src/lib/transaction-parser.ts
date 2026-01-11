/**
 * Transaction Parser Utility
 * 
 * Extracts transaction data from agent responses.
 * Supports both structured metadata and text parsing.
 */

import type { Transaction } from "@/types";

/**
 * Parse transactions from agent response metadata or text
 */
export function parseTransactionsFromResponse(
  metadata?: Record<string, unknown>,
  textContent?: string
): Transaction[] | null {
  // First, try to extract from metadata
  if (metadata) {
    // Check for transactions in metadata
    if (metadata.transactions && Array.isArray(metadata.transactions)) {
      return normalizeTransactions(metadata.transactions);
    }

    // Check for transactions in module_outputs
    if (metadata.module_outputs && typeof metadata.module_outputs === "object") {
      const moduleOutputs = metadata.module_outputs as Record<string, unknown>;
      if (moduleOutputs.transactions && Array.isArray(moduleOutputs.transactions)) {
        return normalizeTransactions(moduleOutputs.transactions);
      }
    }
  }

  // Fallback: Try to parse from text content
  if (textContent) {
    return parseTransactionsFromText(textContent);
  }

  return null;
}

/**
 * Normalize transaction objects to ensure consistent structure
 */
function normalizeTransactions(rawTransactions: unknown[]): Transaction[] {
  return rawTransactions
    .map((tx) => {
      if (typeof tx !== "object" || tx === null) return null;

      const transaction = tx as Record<string, unknown>;

      // Required fields
      const id = String(transaction.id || transaction.transactionId || transaction.transaction_id || "");
      const merchant = String(transaction.merchant || transaction.merchantName || transaction.merchant_name || "Unknown Merchant");
      const amount = Number(transaction.amount || 0);
      const channel = String(transaction.channel || "Unknown");

      // Date handling
      let date: Date | string;
      if (transaction.date) {
        if (transaction.date instanceof Date) {
          date = transaction.date;
        } else {
          date = new Date(String(transaction.date));
          // If invalid date, keep as string
          if (isNaN(date.getTime())) {
            date = String(transaction.date);
          }
        }
      } else {
        date = new Date();
      }

      // Optional fields
      const status = transaction.status ? String(transaction.status) : undefined;
      const currency = transaction.currency ? String(transaction.currency) : "USD";

      if (!id || !merchant || !amount) {
        return null;
      }

      return {
        id,
        merchant,
        amount,
        date,
        channel,
        status,
        currency,
      };
    })
    .filter((tx): tx is Transaction => tx !== null);
}

/**
 * Parse transactions from text content using regex patterns
 */
function parseTransactionsFromText(text: string): Transaction[] | null {
  const transactions: Transaction[] = [];

  // Pattern to detect transaction blocks
  // Looking for patterns like:
  // - Transaction ID: TXN1010
  // - Merchant Name: ATM Withdrawal
  // - Amount: 10,000 INR
  // - Date: 2026-01-14
  // - Channel: Physical

  const lines = text.split("\n");
  let currentTransaction: Partial<Transaction> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Transaction ID
    const idMatch = line.match(/(?:Transaction ID|transaction_id|ID):\s*(.+)/i);
    if (idMatch) {
      // If we already have a transaction in progress, save it
      if (currentTransaction.id && currentTransaction.merchant) {
        const normalized = normalizeTransaction(currentTransaction);
        if (normalized) transactions.push(normalized);
      }
      // Start new transaction
      currentTransaction = { id: idMatch[1].trim() };
      continue;
    }

    // Merchant Name
    const merchantMatch = line.match(/(?:Merchant Name|Merchant|merchant):\s*(.+)/i);
    if (merchantMatch) {
      currentTransaction.merchant = merchantMatch[1].trim();
      continue;
    }

    // Amount
    const amountMatch = line.match(/(?:Amount|amount):\s*([\d,]+(?:\.\d{2})?)\s*([A-Z]{3})?/i);
    if (amountMatch) {
      currentTransaction.amount = parseFloat(amountMatch[1].replace(/,/g, ""));
      if (amountMatch[2]) {
        currentTransaction.currency = amountMatch[2];
      }
      continue;
    }

    // Date
    const dateMatch = line.match(/(?:Date|date):\s*(.+)/i);
    if (dateMatch) {
      currentTransaction.date = dateMatch[1].trim();
      continue;
    }

    // Channel
    const channelMatch = line.match(/(?:Channel|channel):\s*(.+)/i);
    if (channelMatch) {
      currentTransaction.channel = channelMatch[1].trim();
      continue;
    }
  }

  // Don't forget the last transaction
  if (currentTransaction.id && currentTransaction.merchant) {
    const normalized = normalizeTransaction(currentTransaction);
    if (normalized) transactions.push(normalized);
  }

  return transactions.length > 0 ? transactions : null;
}

/**
 * Normalize a partial transaction object
 */
function normalizeTransaction(partial: Partial<Transaction>): Transaction | null {
  if (!partial.id || !partial.merchant) {
    return null;
  }

  return {
    id: partial.id,
    merchant: partial.merchant,
    amount: partial.amount || 0,
    date: partial.date || new Date(),
    channel: partial.channel || "Unknown",
    status: partial.status,
    currency: partial.currency || "USD",
  };
}

/**
 * Detect if a message is likely a fraud verification question
 */
export function detectFraudQuestion(text: string): boolean {
  const fraudQuestionPatterns = [
    /did you authorize/i,
    /can you confirm/i,
    /were you present/i,
    /do you recognize/i,
    /have you shared/i,
    /was this transaction/i,
    /did you make this/i,
    /is this your/i,
    /can you verify/i,
    /please confirm/i,
  ];

  return fraudQuestionPatterns.some((pattern) => pattern.test(text));
}
