// ============================================================================
// Types for Razorpay Autopay Recovery Voice Agent System
// ============================================================================

export type MandateType = 'UPI_AUTOPAY' | 'E_NACH' | 'DEBIT_CARD' | 'CREDIT_CARD';

export type AutopayFailureReason =
  | 'INSUFFICIENT_FUNDS'
  | 'MANDATE_EXPIRED'
  | 'BANK_DOWNTIME'
  | 'CARD_EXPIRED'
  | 'MANDATE_LIMIT_EXCEEDED'
  | 'PAYMENT_DECLINED_BY_BANK'
  | 'ACCOUNT_KYC_PENDING'
  | 'CUSTOMER_PAUSED_MANDATE'
  | 'AUTHENTICATION_FAILED';

export type RecoveryStatus =
  | 'FAILED'
  | 'CALL_SCHEDULED'
  | 'CALLING'
  | 'PAYMENT_LINK_SENT'
  | 'RETRY_SCHEDULED'
  | 'RECOVERED'
  | 'DISPUTED'
  | 'ESCALATED';

export interface CallLogItem {
  id: string;
  timestamp: string;
  sender: 'agent' | 'customer' | 'system';
  message: string;
}

export interface CustomerRecord {
  id: string; // e.g., "cust_001"
  subscriptionId: string; // e.g., "sub_Nx81z9a"
  name: string;
  phone: string;
  email: string;
  merchantName: string; // e.g., "Netflix India", "Cult.fit", "Notion"
  merchantLogo?: string;
  merchantCategory: 'OTT' | 'Fitness' | 'SaaS' | 'Fintech' | 'EdTech' | 'Telecom' | 'Insurance';
  planName: string; // e.g., "Premium 4K Ultra", "ELITE Pass", "Enterprise Seat"
  amount: number; // in INR (₹)
  billingFrequency: 'Monthly' | 'Quarterly' | 'Yearly';
  mandateType: MandateType;
  mandateDetails: {
    bankOrProvider: string; // "HDFC Bank", "ICICI Bank", "Google Pay / Axis", "SBI"
    identifier: string; // "•••• 4128" or "user@okaxis"
    mandateLimit?: number; // e.g. ₹5,000 max mandate cap
    expiryDate?: string;
  };
  dueDate: string;
  failedAt: string;
  failureReason: AutopayFailureReason;
  razorpayErrorCode: string; // e.g. "BAD_REQUEST_PAYMENT_ACCOUNT_INSUFFICIENT_BALANCE"
  failureDescription: string;
  attemptCount: number;
  maxAttempts: number;
  status: RecoveryStatus;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  recoveryNotes?: string;
  scheduledRetryDate?: string;
  paymentLinkUrl?: string;
  recoveredAt?: string;
  paymentMethodRecovered?: string;
  callLogs: CallLogItem[];
  vapiCallId?: string;
}

export interface RecoveryStats {
  totalOverdueAmount: number;
  totalCustomers: number;
  failedCount: number;
  recoveredCount: number;
  recoveredAmount: number;
  recoveryRatePercent: number;
  pendingLinksCount: number;
  scheduledRetriesCount: number;
}

export interface VapiCallPayload {
  customerId: string;
  phoneNumber: string;
  customerName: string;
  merchantName: string;
  planName: string;
  amount: number;
  failureReason: string;
}

export interface WebhookEventPayload {
  id: string;
  event: 'payment.captured' | 'payment.failed' | 'subscription.charged' | 'call.completed' | 'link.generated';
  timestamp: string;
  customerId: string;
  data: Record<string, any>;
}
