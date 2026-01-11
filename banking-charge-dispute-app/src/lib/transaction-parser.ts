/**
 * Transaction Parser Utility
 * 
 * Extracts transaction data from agent responses.
 * Supports both structured metadata and text parsing.
 */

import type { Transaction } from "@/types";

function stripMarkdownNoise(input: string): string {
  return input
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/_/g, "")
    .replace(/^\s*[-•]\s*/g, "")
    .trim();
}

function cleanFieldValue(input: unknown): string {
  if (input == null) return "";
  return stripMarkdownNoise(String(input));
}

function parseAmountAndCurrency(raw: string): { amount: number | null; currency?: string } {
  const s = stripMarkdownNoise(raw);
  const hasINR = /(?:\bINR\b|₹|Rs\.?)/i.test(s);
  const hasUSD = /(?:\bUSD\b|\$)/i.test(s);

  // remove common currency tokens/symbols
  const numeric = s
    .replace(/₹/g, "")
    .replace(/\bINR\b/gi, "")
    .replace(/\bUSD\b/gi, "")
    .replace(/\$/g, "")
    .replace(/Rs\.?/gi, "")
    .trim();

  const numMatch = numeric.match(/([\d,]+(?:\.\d{1,2})?)/);
  if (!numMatch) return { amount: null };

  const amount = parseFloat(numMatch[1].replace(/,/g, ""));
  if (!Number.isFinite(amount)) return { amount: null };

  return {
    amount,
    currency: hasINR ? "INR" : hasUSD ? "USD" : undefined,
  };
}

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
  const normalized: (Transaction | null)[] = rawTransactions
    .map((tx) => {
      if (typeof tx !== "object" || tx === null) return null;

      const transaction = tx as Record<string, unknown>;

      // Required fields
      const id = cleanFieldValue(transaction.id || transaction.transactionId || transaction.transaction_id || "");
      const merchant = cleanFieldValue(
        transaction.merchant || transaction.merchantName || transaction.merchant_name || "Unknown Merchant"
      );
      const channel = cleanFieldValue(transaction.channel || "Unknown");

      // Amount + currency
      let amount = Number(transaction.amount || 0);
      let currency = cleanFieldValue(transaction.currency || "") || undefined;
      if (!amount && transaction.amount_text) {
        const parsed = parseAmountAndCurrency(String(transaction.amount_text));
        if (parsed.amount != null) amount = parsed.amount;
        if (!currency && parsed.currency) currency = parsed.currency;
      }

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
      if (!currency) currency = "USD";

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
    });
  
  return normalized.filter((tx): tx is Transaction => tx !== null);
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
    const line = stripMarkdownNoise(lines[i]);
    if (!line) continue;

    // Transaction ID
    const idMatch = line.match(/(?:Transaction ID|transaction_id|ID)\s*:\s*(.+)/i);
    if (idMatch) {
      // If we already have a transaction in progress, save it
      if (currentTransaction.id && currentTransaction.merchant) {
        const normalized = normalizeTransaction(currentTransaction);
        if (normalized) transactions.push(normalized);
      }
      // Start new transaction
      currentTransaction = { id: cleanFieldValue(idMatch[1]) };
      continue;
    }

    // Merchant Name
    const merchantMatch = line.match(/(?:Merchant Name|Merchant|merchant)\s*:\s*(.+)/i);
    if (merchantMatch) {
      currentTransaction.merchant = cleanFieldValue(merchantMatch[1]);
      continue;
    }

    // Amount
    const amountLineMatch = line.match(/(?:Amount|amount)\s*:\s*(.+)/i);
    if (amountLineMatch) {
      const parsed = parseAmountAndCurrency(amountLineMatch[1]);
      if (parsed.amount != null) currentTransaction.amount = parsed.amount;
      if (parsed.currency) currentTransaction.currency = parsed.currency;
      continue;
    }

    // Date
    const dateMatch = line.match(/(?:Date|date)\s*:\s*(.+)/i);
    if (dateMatch) {
      currentTransaction.date = cleanFieldValue(dateMatch[1]);
      continue;
    }

    // Channel
    const channelMatch = line.match(/(?:Channel|channel)\s*:\s*(.+)/i);
    if (channelMatch) {
      currentTransaction.channel = cleanFieldValue(channelMatch[1]);
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
    id: cleanFieldValue(partial.id),
    merchant: cleanFieldValue(partial.merchant),
    amount: partial.amount || 0,
    date: partial.date ? cleanFieldValue(partial.date) : new Date(),
    channel: partial.channel ? cleanFieldValue(partial.channel) : "Unknown",
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
