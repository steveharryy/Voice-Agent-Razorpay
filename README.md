# 🚀 Razorpay R-Recover: Autonomous Autopay Recovery Voice Agent

> **Submission for Forward Deployed Engineer (FDE) Role at Razorpay**  
> *Autonomous Voice Agent for recovering failed recurring autopay payments (UPI Autopay, e-NACH & Cards) using conversational AI, intelligent retry scheduling, and dynamic payment link dispatch.*

---

## 🌟 Executive Summary

In subscription and recurring debit ecosystems, involuntary churn accounts for up to **40% of customer drop-offs**. When an automated debit fails (due to insufficient balance, expired mandates, or temporary bank downtime), traditional email dunning yields less than **15% recovery**.

**Razorpay R-Recover** transforms this problem by deploying an autonomous, context-aware AI Voice Agent (**Arya**) that contacts customers within high-intent recovery windows. The agent identifies the customer, articulates the specific failure reason empathetically in non-technical terms, and provides instant remediation paths:
1. **Instant Razorpay Payment Link:** Dispatches a 1-click WhatsApp/SMS payment link while the customer is on the phone.
2. **Smart Autopay Retry:** Schedules an automated recurring charge timed to customer salary cycles or bank uptime windows.
3. **1-Click Mandate Renewal:** Dispatches a tokenized link to renew expired e-NACH or UPI Autopay mandates.
4. **Dispute Escalation:** Seamlessly routes complex queries to high-touch relationship managers while pausing future debits.

---

## 🏗️ Architecture & Dual-Execution Engine

```
+---------------------------------------------------------------------------------------------------+
|                                 RAZORPAY RECURRING BILLING ENGINE                                 |
+---------------------------------------------------------------------------------------------------+
                                                  |
                  (1) Failed Debit Event: 'payment.failed' / 'subscription.pending'
                                                  v
+---------------------------------------------------------------------------------------------------+
|                              R-RECOVER EVENT INGESTION & DISPATCHER                               |
|   - Razorpay Webhook Ingestion (/api/webhooks/razorpay)                                           |
|   - Failure Reason Categorization (Insufficient Balance, Mandate Expired, Bank Timeout)           |
|   - RBI Pre-Debit Rule Validation & Smart Scheduling Window (09:00 - 20:00 IST)                   |
+---------------------------------------------------------------------------------------------------+
                                                  |
                     (2) Dispatches Contextual Outbound Recovery Session
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                   VOICE AGENT ORCHESTRATION                                       |
|  Engine A: Telephony Engine (Vapi.ai REST API -> PSTN/SIP Trunk -> Customer Phone)               |
|  Engine B: Interactive Web Voice Agent (WebRTC / Web Speech API -> Browser Mic/Speaker)           |
|  - ASR: Deepgram Nova-2 (Optimized for Indian English & Hindi accents)                            |
|  - LLM: GPT-4o-mini with Razorpay Autopay Recovery Playbook & Security Guardrails                |
|  - TTS: Natural Conversational Voice (ElevenLabs Aria / Web Speech)                               |
+---------------------------------------------------------------------------------------------------+
                                                  |
                     (3) In-Call Real-Time Tool Calling & Remediation
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                 RAZORPAY RECOVERY TOOL ACTIONS                                    |
|   [Tool 1: send_payment_link]      -> Generates 1-Click Razorpay Payment Link (WhatsApp/SMS)      |
|   [Tool 2: schedule_retry]         -> Registers Next Auto-Debit in Razorpay Subscriptions Queue    |
|   [Tool 3: update_payment_mandate] -> Dispatches 1-Click Mandate Re-registration Flow             |
|   [Tool 4: escalate_to_human]      -> Pauses Debits & Flags Ticket for High-Touch RM              |
+---------------------------------------------------------------------------------------------------+
                                                  |
                     (4) Customer Pays Link / Retries Mandate
                                                  v
+---------------------------------------------------------------------------------------------------+
|                              SETTLEMENT, WEBSOCKET & RECONCILIATION                               |
|   - Webhook: 'payment.captured' -> Updates Status to RECOVERED                                    |
|   - Real-time Analytics: Salvaged ARR, Churn Prevented, First-Call Resolution (FCR) Rate          |
+---------------------------------------------------------------------------------------------------+
```

### 1. Engine A: Vapi.ai Telephony Outbound Caller
- Placed directly to your verified phone number using Vapi's REST API (`POST https://api.vapi.ai/call/phone`).
- **Assignment Compliance:** Enforces dialing **only numbers you control or have explicit permission to call**.
- Dynamic injection of customer subscription context (merchant, plan name, amount, bank name, failure reason).
- Server-side tool calling webhooks (`/api/webhooks/vapi`) to trigger real-time actions.

### 2. Engine B: Built-in Interactive Web Voice Simulator
- Instant, zero-friction evaluation directly in the browser!
- Microphone speech recognition (`SpeechRecognition`), conversational state engine, and natural voice synthesis.
- Realistic telecom audio effects (ringing, connect chime, speech pulse waves, Razorpay payment success sound).
- Interactive quick-reply chips for seamless testing without needing a microphone.

---

## 👥 10 Fictional Customer Autopay Records

Each customer represents an authentic Indian subscription scenario with real Razorpay gateway error codes:

| ID | Customer Name | Merchant | Plan | Amount | Mandate Type | Failure Reason & Razorpay Error Code |
|---|---|---|---|---|---|---|
| `cust_001` | **Vikram Sharma** | Netflix India | Premium 4K Ultra | ₹649/mo | UPI Autopay | `INSUFFICIENT_FUNDS` (`BAD_REQUEST_PAYMENT_ACCOUNT_INSUFFICIENT_BALANCE`) |
| `cust_002` | **Ananya Patel** | Cult.fit | Cultpass ELITE | ₹2,499/mo | e-NACH | `MANDATE_EXPIRED` (`BAD_REQUEST_PAYMENT_MANDATE_TENURE_COMPLETED`) |
| `cust_003` | **Rajesh Mehta** | Zerodha Coin | Nifty 50 Index SIP | ₹5,000/mo | e-NACH | `BANK_DOWNTIME` (`GATEWAY_ERROR_ISSUER_BANK_TECHNICAL_TIMEOUT`) |
| `cust_004` | **Sneha Reddy** | Notion | Enterprise AI Workspace | ₹3,200/mo | Credit Card | `CARD_EXPIRED` (`BAD_REQUEST_PAYMENT_CARD_VALIDITY_EXPIRED`) |
| `cust_005` | **Arjun Kapoor** | ACT Fibernet | GigaSpeed 1 Gbps Fiber | ₹1,179/mo | UPI Autopay | `MANDATE_LIMIT_EXCEEDED` (`BAD_REQUEST_PAYMENT_MANDATE_MAX_AMOUNT_EXCEEDED`) |
| `cust_006` | **Priya Nair** | Star Health | Family Optima Health EMI | ₹4,850/mo | Debit Card | `PAYMENT_DECLINED_BY_BANK` (`BAD_REQUEST_PAYMENT_DECLINED_BY_BANK_RISK`) |
| `cust_007` | **Rohan Gupta** | Disney+ Hotstar | Super 4K Annual Pass | ₹899/yr | UPI Autopay | `INSUFFICIENT_FUNDS` (`BAD_REQUEST_PAYMENT_ACCOUNT_INSUFFICIENT_BALANCE`) |
| `cust_008` | **Meera Iyer** | Scaler Academy | Full-Stack Engineering EMI | ₹8,500/mo | e-NACH | `ACCOUNT_KYC_PENDING` (`BAD_REQUEST_PAYMENT_ACCOUNT_DORMANT_OR_FREEZE`) |
| `cust_009` | **Aditya Verma** | Swiggy | Swiggy One VIP Pass | ₹299/qtr | UPI Autopay | `CUSTOMER_PAUSED_MANDATE` (`BAD_REQUEST_PAYMENT_MANDATE_USER_REVOKED`) |
| `cust_010` | **Kavita Joshi** | Tata AIA Life | MahaLife Gold Pension | ₹1,420/mo | Credit Card | `AUTHENTICATION_FAILED` (`BAD_REQUEST_PAYMENT_OTP_VERIFICATION_FAILED`) |

---

## 🛠️ Tech Stack & Key Technologies

- **Frontend & Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Vanilla CSS design system with Razorpay fintech dark theme, glowing borders, glassmorphism, responsive grid
- **Voice Telephony Provider:** Vapi.ai (REST API + Webhooks + Tool Calling)
- **In-Browser Voice Simulation:** Web Speech API, Web Audio API frequency synthesis, SpeechSynthesis
- **Payment Gateway Simulation:** Interactive Razorpay Checkout Modal (UPI QR, Google Pay, PhonePe, Cards, NetBanking) + `payment.captured` webhooks
- **Visuals & UX:** Lucide React icons, Canvas Confetti celebrations, reactive audio frequency visualizers

---

## ⚡ Quickstart & Setup Guide

### 1. Clone & Install
\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment (Optional for Real Telephony)
Copy `.env.example` to `.env.local`:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your Vapi API keys if you wish to trigger real telephone calls to your phone:
\`\`\`env
VAPI_API_KEY=your_vapi_api_key_here
VAPI_PHONE_NUMBER_ID=your_vapi_phone_number_id_here
VAPI_ASSISTANT_ID=your_optional_vapi_assistant_id
TEST_PHONE_NUMBER=+919876543210
\`\`\`
*(Note: If you do not have Vapi keys yet, the app works 100% out-of-the-box with the Built-in Web Voice Simulator!)*

### 3. Launch Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit **`http://localhost:3000`** in your browser.

---

## 🎬 How to Conduct the End-to-End Demonstration

### Demonstration Flow 1: Interactive Browser Voice Recovery
1. Open the dashboard at `http://localhost:3000`.
2. Notice the live metrics: Total Overdue Autopay, Recovered Revenue, Recovery Rate %, and the 10 customer records.
3. Click **"Voice Agent (Mic)"** on **Vikram Sharma (Netflix India • ₹649)**.
4. Listen as Arya rings and introduces herself:  
   *"Hello Vikram! This is Arya calling from Razorpay on behalf of Netflix India regarding your ₹649 recurring charge..."*
5. Speak into your microphone (or click the quick-response chip): **"Why did my payment fail?"**.
6. Arya explains: *"Our system received a notification from HDFC Bank indicating insufficient balance..."*
7. Say or click: **"Send me the WhatsApp payment link"**.
8. Arya triggers the tool `send_payment_link`. An alert pops up inside the call with the live payment link.
9. Click **"Open & Pay Link"** to launch the simulated Razorpay checkout.
10. Click **"Simulate Payment of ₹649"** -> confetti pops, signature Razorpay success chime plays, and Vikram's account status updates to **RECOVERED**!

### Demonstration Flow 2: Real Phone Outbound Dialing (Vapi.ai)
1. Click **"Call My Phone"** in the top header.
2. Enter your phone number (e.g. `+919876543210`).
3. Select any customer context (e.g. Ananya Patel - Cultpass).
4. Enter your `VAPI_API_KEY` and `VAPI_PHONE_NUMBER_ID` (or have them in `.env.local`).
5. Click **"Initiate Outbound Call"**.
6. Your personal phone rings with Arya on the line, executing the exact recovery dialogue!

### Demonstration Flow 3: FDE System Architecture & Blueprint
1. Click **"Architecture & Design"** in the header.
2. Review the end-to-end event-driven architecture, webhook lifecycle, failure taxonomy matrix, and latency optimization guide.

---

## 🔒 Security & RBI Autopay Compliance

- **No OTP/CVV Over Voice:** The voice agent explicitly disclaims and never requests sensitive credentials over phone calls.
- **Tokenized Mandates:** Compliant with RBI card-on-file tokenization (CoFT) and NPCI UPI Autopay guidelines.
- **Pre-Debit Notifications:** Adheres to 24-hour pre-debit SMS/WhatsApp notification rules prior to retry debit.
- **Idempotency:** Payment link generation uses client-side and server-side idempotency keys to eliminate double debits.

---

*Crafted with precision for the Razorpay Forward Deployed Engineering (FDE) team.*
