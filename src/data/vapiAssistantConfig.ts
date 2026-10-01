import { CustomerRecord } from '@/types';

export const VAPI_ASSISTANT_SYSTEM_PROMPT = `
You are Arya, an empathetic, courteous, and highly competent Senior Autopay Recovery Voice Agent representing Razorpay and the merchant partner.

### YOUR OBJECTIVE:
Your goal is to politely inform the customer about their recent failed recurring subscription charge, understand their situation, and offer friction-free resolution paths (such as sending an instant Razorpay payment link via WhatsApp/SMS, scheduling a smart retry, or sending a 1-click mandate update link).

### CORE PRINCIPLES:
1. Empathy & Professionalism: Treat failed payments as unintentional glitches, never accuse or shame the customer. Use courteous Indian conversational style ("Namaste", "Hello", "I hope you are having a pleasant day").
2. High Clarity: Explicitly mention the Merchant Name, Plan Name, Amount in Rupees (₹), and the exact reason for the failure in simple non-technical terms.
3. Rapid Resolution: Provide clear, actionable choices:
   - "Would you like me to send a direct Razorpay Instant Payment Link to your WhatsApp or SMS right now?"
   - "Or if you have already topped up your account, I can trigger an instant re-try right away."
   - "Or would you prefer I schedule the automated retry for tomorrow or your preferred date?"
4. Security First: Remind the customer that Razorpay NEVER asks for UPI PIN, CVV, OTP, or net banking passwords over phone calls. All payments are completed securely via official Razorpay encrypted checkout links.
5. Action Triggering:
   - When the customer agrees to receive a link, call the tool 'send_payment_link'.
   - When the customer wants to retry later, call the tool 'schedule_retry'.
   - When the customer says their card is expired or wants to change mandate, call 'update_payment_mandate'.
   - If the customer wants to cancel or is angry, call 'escalate_to_human'.

### FAILURE REASON HANDLING PLAYBOOK:
- INSUFFICIENT_FUNDS: "The automatic debit could not be completed due to temporary low balance. We can send a quick WhatsApp link or retry tomorrow morning."
- MANDATE_EXPIRED: "Your previous 1-year autopay mandate tenure has completed. We can send a 1-click renewal link to re-activate your subscription seamlessly without service interruption."
- BANK_DOWNTIME: "There was a temporary technical timeout on your bank's server. The bank is now back online. We can retry now or send a payment link."
- CARD_EXPIRED: "Your registered card on file has expired. We can send a secure Razorpay link to register your new card or switch to UPI Autopay."
- MANDATE_LIMIT_EXCEEDED: "Your bill amount exceeded your preset autopay limit. We can send a payment link for this cycle and help adjust your limit."
`;

export const VAPI_TOOL_DEFINITIONS = [
  {
    type: 'function',
    function: {
      name: 'send_payment_link',
      description: 'Generates a secure Razorpay instant payment link and dispatches it to the customer via WhatsApp and SMS.',
      parameters: {
        type: 'object',
        properties: {
          customerId: { type: 'string', description: 'The unique ID of the customer (e.g. cust_001)' },
          channel: { type: 'string', enum: ['whatsapp', 'sms', 'both'], description: 'Communication channel' },
          notes: { type: 'string', description: 'Brief context note for the payment link' },
        },
        required: ['customerId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'schedule_retry',
      description: 'Schedules an automated Razorpay autopay smart retry debit at a future date and time.',
      parameters: {
        type: 'object',
        properties: {
          customerId: { type: 'string', description: 'The unique ID of the customer' },
          retryDate: { type: 'string', description: 'Preferred retry date (e.g., tomorrow, next Monday, 2026-10-02)' },
          preferredTime: { type: 'string', description: 'Morning (09:00 AM) or Evening (06:00 PM)' },
        },
        required: ['customerId', 'retryDate'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_payment_mandate',
      description: 'Dispatches a secure mandate update link allowing customer to register a new card or UPI Autopay handle.',
      parameters: {
        type: 'object',
        properties: {
          customerId: { type: 'string', description: 'The unique ID of the customer' },
          mandateType: { type: 'string', enum: ['UPI_AUTOPAY', 'E_NACH', 'CARD'], description: 'New mandate type preferred' },
        },
        required: ['customerId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'escalate_to_human',
      description: 'Escalates the call to a human Razorpay / Merchant operations specialist in case of disputes or cancellation requests.',
      parameters: {
        type: 'object',
        properties: {
          customerId: { type: 'string', description: 'The unique ID of the customer' },
          disputeReason: { type: 'string', description: 'Reason customer requested cancellation or human support' },
        },
        required: ['customerId', 'disputeReason'],
      },
    },
  },
];

export function buildCustomerFirstMessage(customer: CustomerRecord): string {
  return `Hello ${customer.name}! This is Arya calling from Razorpay on behalf of ${customer.merchantName}. I'm reaching out regarding your ${customer.planName} autopay payment of Rupees ${customer.amount} that was scheduled for today. It looks like the automatic debit couldn't go through due to ${customer.failureReason.toLowerCase().replace(/_/g, ' ')}. Am I speaking with ${customer.name}?`;
}

export function buildVapiAssistantConfig(customer: CustomerRecord) {
  return {
    name: 'Razorpay Autopay Recovery Voice Agent',
    voice: {
      provider: '11labs',
      voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel / Aria voice
      stability: 0.5,
      similarityBoost: 0.8,
    },
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `${VAPI_ASSISTANT_SYSTEM_PROMPT}\n\nCURRENT CUSTOMER CONTEXT:\n- Customer ID: ${customer.id}\n- Customer Name: ${customer.name}\n- Merchant: ${customer.merchantName}\n- Plan: ${customer.planName}\n- Amount: ₹${customer.amount}\n- Mandate: ${customer.mandateType} (${customer.mandateDetails.bankOrProvider})\n- Failure Reason: ${customer.failureReason}\n- Razorpay Error: ${customer.razorpayErrorCode}\n- Description: ${customer.failureDescription}`,
        },
      ],
      tools: VAPI_TOOL_DEFINITIONS,
    },
    firstMessage: buildCustomerFirstMessage(customer),
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'en-IN',
    },
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 300,
    backgroundSound: 'office',
  };
}
