'use client';

import React from 'react';
import { Layers, X, ShieldCheck, Zap, Server, PhoneCall, RefreshCw, Database } from 'lucide-react';

interface ArchitectureModalProps {
  onClose: () => void;
}

export default function ArchitectureModal({ onClose }: ArchitectureModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="call-modal"
        style={{ maxWidth: '900px', maxHeight: '88vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="call-modal-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: '#0c192c' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} style={{ color: 'var(--brand-blue)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
              Razorpay Forward Deployed Engineer (FDE) Blueprint &amp; System Architecture
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Executive Summary */}
          <div className="blueprint-card">
            <h3>
              <Zap size={17} style={{ color: '#00e5ff' }} />
              Executive System Design
            </h3>
            <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.6' }}>
              Razorpay R-Recover is an autonomous voice recovery platform designed for enterprise merchants processing high volumes of recurring subscriptions (UPI Autopay, e-NACH, and Credit/Debit Cards). When a recurring debit failure occurs, rather than passively relying on email dunning, R-Recover orchestrates an instant, context-aware AI voice outreach powered by Vapi.ai and Razorpay Payment APIs.
            </p>
          </div>

          {/* Architecture Diagram */}
          <div className="blueprint-card">
            <h3>
              <Server size={17} style={{ color: '#3395ff' }} />
              End-to-End Event Flow Architecture
            </h3>
            <div className="code-block" style={{ whiteSpace: 'pre', fontSize: '12px' }}>
{`
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
`}
            </div>
          </div>

          {/* Autopay Failure Taxonomy */}
          <div className="blueprint-card">
            <h3>
              <RefreshCw size={17} style={{ color: '#10b981' }} />
              Autopay Failure Codes &amp; Voice Resolution Matrix
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', color: '#cbd5e1' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-medium)', textAlign: 'left', color: '#94a3b8' }}>
                    <th style={{ padding: '8px' }}>Razorpay Error Code</th>
                    <th style={{ padding: '8px' }}>Failure Root Cause</th>
                    <th style={{ padding: '8px' }}>Arya's Voice Strategy</th>
                    <th style={{ padding: '8px' }}>Action Triggered</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px', fontFamily: 'monospace', color: '#f43f5e' }}>ACCOUNT_INSUFFICIENT_BALANCE</td>
                    <td style={{ padding: '8px' }}>Low funds in savings account</td>
                    <td style={{ padding: '8px' }}>Offer instant WhatsApp link or schedule retry on salary date</td>
                    <td style={{ padding: '8px', color: '#38bdf8' }}>send_payment_link / schedule_retry</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px', fontFamily: 'monospace', color: '#f59e0b' }}>MANDATE_TENURE_COMPLETED</td>
                    <td style={{ padding: '8px' }}>1-year e-NACH/UPI mandate expired</td>
                    <td style={{ padding: '8px' }}>Send 1-click renewal link to prevent service interruption</td>
                    <td style={{ padding: '8px', color: '#38bdf8' }}>update_payment_mandate</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px', fontFamily: 'monospace', color: '#3b82f6' }}>ISSUER_BANK_TECHNICAL_TIMEOUT</td>
                    <td style={{ padding: '8px' }}>Bank CBS server temporary downtime</td>
                    <td style={{ padding: '8px' }}>Inform that bank is back online; offer immediate re-try</td>
                    <td style={{ padding: '8px', color: '#38bdf8' }}>retry_now</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px', fontFamily: 'monospace', color: '#f43f5e' }}>CARD_VALIDITY_EXPIRED</td>
                    <td style={{ padding: '8px' }}>Credit card MM/YY expired</td>
                    <td style={{ padding: '8px' }}>Provide tokenized update link or upgrade to UPI Autopay</td>
                    <td style={{ padding: '8px', color: '#38bdf8' }}>update_payment_mandate</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', fontFamily: 'monospace', color: '#f59e0b' }}>MANDATE_MAX_AMOUNT_EXCEEDED</td>
                    <td style={{ padding: '8px' }}>Bill exceeded mandate limit cap</td>
                    <td style={{ padding: '8px' }}>Collect delta via payment link and prompt mandate limit modification</td>
                    <td style={{ padding: '8px', color: '#38bdf8' }}>send_payment_link</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Voice Latency & Optimization */}
          <div className="blueprint-card">
            <h3>
              <Zap size={17} style={{ color: '#f59e0b' }} />
              Telephony Performance &amp; Latency Engineering (&lt;600ms)
            </h3>
            <ul style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.7', paddingLeft: '20px' }}>
              <li><strong>Streaming WebSockets:</strong> Audio streams directly via bidirectional WebSockets (PCM 16-bit 8kHz for PSTN, 24kHz for WebRTC), eliminating chunk buffering.</li>
              <li><strong>Interruption &amp; Barge-in Handling:</strong> Speech detection halts agent audio within 80ms of human speech onset, creating natural conversational turn-taking.</li>
              <li><strong>Speculative Tool Execution:</strong> Payment links are pre-generated during customer greeting stage and cached, allowing instantaneous dispatch upon verbal confirmation.</li>
              <li><strong>PCI-DSS &amp; RBI Compliance:</strong> Agent explicitly enforces zero collection of OTP, CVV, or UPI PIN over telephony. All transactions complete through Razorpay's end-to-end encrypted hosted checkout.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
