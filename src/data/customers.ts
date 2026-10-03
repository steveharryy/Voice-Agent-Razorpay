import { CustomerRecord } from '@/types';

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust_001',
    subscriptionId: 'sub_Nx81zVikram9',
    name: 'Vikram Sharma',
    phone: '+91 98201 12345',
    email: 'vikram.sharma@gmail.com',
    merchantName: 'Netflix India',
    merchantCategory: 'OTT',
    planName: 'Premium 4K Ultra Plan',
    amount: 649,
    billingFrequency: 'Monthly',
    mandateType: 'UPI_AUTOPAY',
    mandateDetails: {
      bankOrProvider: 'HDFC Bank (Google Pay)',
      identifier: 'vikram@okhdfcbank',
      mandateLimit: 2000,
    },
    dueDate: '2026-10-01',
    failedAt: '2026-10-01 07:15 IST',
    failureReason: 'INSUFFICIENT_FUNDS',
    razorpayErrorCode: 'BAD_REQUEST_PAYMENT_ACCOUNT_INSUFFICIENT_BALANCE',
    failureDescription: 'Debit failed due to insufficient available balance in savings account at the time of recurring charge.',
    attemptCount: 1,
    maxAttempts: 3,
    status: 'FAILED',
    riskScore: 'LOW',
    callLogs: [],
  },
  {
    id: 'cust_002',
    subscriptionId: 'sub_Ct74xAnanya3',
    name: 'Ananya Patel',
    phone: '+91 98450 67890',
    email: 'ananya.patel@outlook.com',
    merchantName: 'Cult.fit',
    merchantCategory: 'Fitness',
    planName: 'Cultpass ELITE All-Access',
    amount: 2499,
    billingFrequency: 'Monthly',
    mandateType: 'E_NACH',
    mandateDetails: {
      bankOrProvider: 'ICICI Bank',
      identifier: '•••• 8912',
      expiryDate: '2026-09-30',
    },
    dueDate: '2026-10-01',
    failedAt: '2026-10-01 06:30 IST',
    failureReason: 'MANDATE_EXPIRED',
    razorpayErrorCode: 'BAD_REQUEST_PAYMENT_MANDATE_TENURE_COMPLETED',
    failureDescription: 'The 1-year e-NACH mandate tenure registered in Oct 2025 expired. Needs 1-click renewal.',
    attemptCount: 2,
    maxAttempts: 3,
    status: 'FAILED',
    riskScore: 'MEDIUM',
    callLogs: [],
  },
  {
    id: 'cust_003',
    subscriptionId: 'sub_Zd99mRajesh1',
    name: 'Rajesh Mehta',
    phone: '+91 97110 54321',
    email: 'rajesh.mehta@yahoo.com',
    merchantName: 'Zerodha Coin',
    merchantCategory: 'Fintech',
    planName: 'Nifty 50 Index Mutual Fund SIP',
    amount: 5000,
    billingFrequency: 'Monthly',
    mandateType: 'E_NACH',
    mandateDetails: {
      bankOrProvider: 'State Bank of India',
      identifier: '•••• 3041',
      mandateLimit: 25000,
    },
    dueDate: '2026-10-01',
    failedAt: '2026-10-01 08:00 IST',
    failureReason: 'BANK_DOWNTIME',
    razorpayErrorCode: 'GATEWAY_ERROR_ISSUER_BANK_TECHNICAL_TIMEOUT',
    failureDescription: 'SBI Core Banking Server timed out during recurring batch debit processing. Bank servers are now back up.',
    attemptCount: 1,
    maxAttempts: 3,
    status: 'FAILED',
    riskScore: 'LOW',
    callLogs: [],
  },
  {
    id: 'cust_004',
    subscriptionId: 'sub_Nt45sSneha7',
    name: 'Sneha Reddy',
    phone: '+91 99880 11223',
    email: 'sneha.reddy@techstartup.io',
    merchantName: 'Notion',
    merchantCategory: 'SaaS',
    planName: 'Enterprise AI Workspace (10 Seats)',
    amount: 3200,
    billingFrequency: 'Monthly',
    mandateType: 'CREDIT_CARD',
    mandateDetails: {
      bankOrProvider: 'Axis Bank Magnus Visa',
      identifier: '•••• 9142',
      expiryDate: '09/26',
    },
    dueDate: '2026-10-01',
    failedAt: '2026-10-01 09:10 IST',
    failureReason: 'CARD_EXPIRED',
    razorpayErrorCode: 'BAD_REQUEST_PAYMENT_CARD_VALIDITY_EXPIRED',
    failureDescription: 'Registered credit card expired in 09/2026. Auto-debit declined by Visa network.',
    attemptCount: 1,
    maxAttempts: 3,
    status: 'FAILED',
    riskScore: 'HIGH',
    callLogs: [],
  },
  {
    id: 'cust_005',
    subscriptionId: 'sub_Ac82kArjun5',
    name: 'Arjun Kapoor',
    phone: '+91 98712 99887',
    email: 'arjun.kapoor@gmail.com',
    merchantName: 'ACT Fibernet',
    merchantCategory: 'Telecom',
    planName: 'GigaSpeed 1 Gbps Fiber Pro',
    amount: 1179,
    billingFrequency: 'Monthly',
    mandateType: 'UPI_AUTOPAY',
    mandateDetails: {
      bankOrProvider: 'Paytm Payments Bank / IndusInd',
      identifier: 'arjunk@paytm',
      mandateLimit: 1000,
    },
    dueDate: '2026-10-01',
    failedAt: '2026-10-01 10:05 IST',
    failureReason: 'MANDATE_LIMIT_EXCEEDED',
    razorpayErrorCode: 'BAD_REQUEST_PAYMENT_MANDATE_MAX_AMOUNT_EXCEEDED',
    failureDescription: 'Bill total of ₹1,179 exceeds customer-set per-debit mandate ceiling of ₹1,000.',
    attemptCount: 1,
    maxAttempts: 3,
    status: 'FAILED',
    riskScore: 'MEDIUM',
    callLogs: [],
  },
  {
    id: 'cust_006',
    subscriptionId: 'sub_St63pPriya2',
    name: 'Priya Nair',
    phone: '+91 97422 33445',
    email: 'priya.nair@healthcare.org',
    merchantName: 'Star Health Insurance',
    merchantCategory: 'Insurance',
    planName: 'Family Optima Health Cover EMI',
    amount: 4850,
    billingFrequency: 'Monthly',
    mandateType: 'DEBIT_CARD',
    mandateDetails: {
      bankOrProvider: 'Kotak Mahindra Bank',
      identifier: '•••• 5521',
    },
    dueDate: '2026-10-01',
    failedAt: '2026-10-01 07:45 IST',
    failureReason: 'PAYMENT_DECLINED_BY_BANK',
    razorpayErrorCode: 'BAD_REQUEST_PAYMENT_DECLINED_BY_BANK_RISK',
    failureDescription: 'Kotak automated fraud detection flagged sudden e-commerce debit limit restriction. Customer can authorize via mobile app.',
    attemptCount: 2,
    maxAttempts: 3,
    status: 'FAILED',
    riskScore: 'HIGH',
    callLogs: [],
  },
  {
    id: 'cust_007',
    subscriptionId: 'sub_Hs19rRohan8',
    name: 'Rohan Gupta',
    phone: '+91 98199 44332',
    email: 'rohan.gupta@deloitte.com',
    merchantName: 'Disney+ Hotstar',
    merchantCategory: 'OTT',
    planName: 'Super 4K Annual Membership',
    amount: 899,
    billingFrequency: 'Yearly',
    mandateType: 'UPI_AUTOPAY',
    mandateDetails: {
      bankOrProvider: 'PhonePe (Yes Bank)',
      identifier: 'rohan.gupta@ybl',
      mandateLimit: 3000,
    },
    dueDate: '2026-10-01',
    failedAt: '2026-10-01 08:30 IST',
    failureReason: 'INSUFFICIENT_FUNDS',
    razorpayErrorCode: 'BAD_REQUEST_PAYMENT_ACCOUNT_INSUFFICIENT_BALANCE',
    failureDescription: 'UPI recurring charge was declined due to low funds in linked primary savings account.',
    attemptCount: 1,
    maxAttempts: 3,
    status: 'FAILED',
    riskScore: 'LOW',
    callLogs: [],
  },
  {
    id: 'cust_008',
    subscriptionId: 'sub_Sc91mMeera4',
    name: 'Meera Iyer',
    phone: '+91 99001 88776',
    email: 'meera.iyer@scaler.com',
    merchantName: 'Scaler Academy',
    merchantCategory: 'EdTech',
    planName: 'Full-Stack Software Engineering EMI',
    amount: 8500,
    billingFrequency: 'Monthly',
    mandateType: 'E_NACH',
    mandateDetails: {
      bankOrProvider: 'Punjab National Bank',
      identifier: '•••• 1190',
      mandateLimit: 15000,
    },
    dueDate: '2026-10-01',
    failedAt: '2026-10-01 06:50 IST',
    failureReason: 'ACCOUNT_KYC_PENDING',
    razorpayErrorCode: 'BAD_REQUEST_PAYMENT_ACCOUNT_DORMANT_OR_FREEZE',
    failureDescription: 'Debit stopped because PNB marked customer account under temporary periodic KYC verification review.',
    attemptCount: 2,
    maxAttempts: 3,
    status: 'FAILED',
    riskScore: 'HIGH',
    callLogs: [],
  },
  {
    id: 'cust_009',
    subscriptionId: 'sub_Sw33aAditya0',
    name: 'Aditya Verma',
    phone: '+91 98230 77665',
    email: 'aditya.verma@zomato.in',
    merchantName: 'Swiggy',
    merchantCategory: 'Fitness',
    planName: 'Swiggy One VIP Quarterly Pass',
    amount: 299,
    billingFrequency: 'Quarterly',
    mandateType: 'UPI_AUTOPAY',
    mandateDetails: {
      bankOrProvider: 'Google Pay (SBI)',
      identifier: 'aditya.v@oksbi',
      mandateLimit: 1000,
    },
    dueDate: '2026-10-01',
    failedAt: '2026-10-01 11:20 IST',
    failureReason: 'CUSTOMER_PAUSED_MANDATE',
    razorpayErrorCode: 'BAD_REQUEST_PAYMENT_MANDATE_USER_REVOKED',
    failureDescription: 'Customer temporarily toggled autopay pause switch inside their Google Pay UPI mandate settings.',
    attemptCount: 1,
    maxAttempts: 3,
    status: 'FAILED',
    riskScore: 'MEDIUM',
    callLogs: [],
  },
  {
    id: 'cust_010',
    subscriptionId: 'sub_Ta55kKavita6',
    name: 'Kavita Joshi',
    phone: '+91 97654 33221',
    email: 'kavita.joshi@tatamotors.com',
    merchantName: 'Tata AIA Life Insurance',
    merchantCategory: 'Insurance',
    planName: 'MahaLife Gold Pension Plan',
    amount: 1420,
    billingFrequency: 'Monthly',
    mandateType: 'CREDIT_CARD',
    mandateDetails: {
      bankOrProvider: 'HDFC Bank Diners Club',
      identifier: '•••• 7013',
    },
    dueDate: '2026-10-01',
    failedAt: '2026-10-01 07:05 IST',
    failureReason: 'AUTHENTICATION_FAILED',
    razorpayErrorCode: 'BAD_REQUEST_PAYMENT_OTP_VERIFICATION_FAILED',
    failureDescription: 'Mandate step-up 2FA authentication challenge timed out after 3 failed OTP delivery attempts by telecom.',
    attemptCount: 1,
    maxAttempts: 3,
    status: 'FAILED',
    riskScore: 'LOW',
    callLogs: [],
  },
];

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
      voiceId: '21m00Tcm4TlvDq8ikWAM',
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
