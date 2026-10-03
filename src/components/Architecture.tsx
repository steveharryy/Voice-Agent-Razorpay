'use client';

import React from 'react';
import { Layers, X, ShieldCheck, Zap, Server, RefreshCw } from 'lucide-react';

interface ArchitectureProps {
  onClose: () => void;
}

export default function Architecture({ onClose }: ArchitectureProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="call-modal"
        style={{ maxWidth: '920px', maxHeight: '88vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="call-modal-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} style={{ color: 'var(--indigo-primary)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Razorpay Forward Deployed Engineer (FDE) Architecture Blueprint
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px' }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="blueprint-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Zap size={16} style={{ color: 'var(--indigo-primary)' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Executive System Design & Problem Statement
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Razorpay Autopay Voice Recovery is an autonomous recovery platform engineered for enterprise merchants with high recurring payment volumes (UPI Autopay, e-NACH, and Credit/Debit Cards). Rather than relying on passive email dunning which achieves &lt;15% recovery, this platform orchestrates context-aware, empathetic outbound AI voice outreach within seconds of recurring debit failure, resolving the issue via instant payment links or scheduled retries.
            </p>
          </div>

          <div className="blueprint-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Server size={16} style={{ color: 'var(--indigo-primary)' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                End-to-End Event Flow Architecture
              </h3>
            </div>
            <div
              style={{
                background: '#F8F9FB',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
                color: '#1E293B',
                overflowX: 'auto',
                lineHeight: '1.5',
                whiteSpace: 'pre',
              }}
            >
{`
+---------------------------------------------------------------------------------------------------+
|                                 RAZORPAY RECURRING BILLING ENGINE                                 |
+---------------------------------------------------------------------------------------------------+
                                                  |
                  (1) Failed Debit Event: 'payment.failed' / 'subscription.pending'
                                                  v
+---------------------------------------------------------------------------------------------------+
|                              CALLAI EVENT INGESTION & DISPATCHER                                  |
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
|  - ASR: Deepgram Nova-2 (Optimized for Indian English & Strict English)                          |
|  - LLM: GPT-4o-mini with Razorpay Autopay Recovery Playbook & Security Guardrails                |
|  - TTS: Natural Conversational Voice (ElevenLabs Aria / Strict EN-US Web Speech)                 |
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

          <div className="blueprint-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <RefreshCw size={16} style={{ color: 'var(--status-success-text)' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Autopay Failure Codes & Voice Resolution Matrix
              </h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '8px 10px', background: '#F8F9FB', fontWeight: 600 }}>Razorpay Error Code</th>
                    <th style={{ padding: '8px 10px', background: '#F8F9FB', fontWeight: 600 }}>Failure Root Cause</th>
                    <th style={{ padding: '8px 10px', background: '#F8F9FB', fontWeight: 600 }}>Arya's Voice Strategy</th>
                    <th style={{ padding: '8px 10px', background: '#F8F9FB', fontWeight: 600 }}>Action Triggered</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', color: 'var(--status-danger-text)', fontWeight: 600 }}>ACCOUNT_INSUFFICIENT_BALANCE</td>
                    <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>Low funds in savings account</td>
                    <td style={{ padding: '10px', color: 'var(--text-primary)' }}>Offer instant WhatsApp link or schedule retry on salary date</td>
                    <td style={{ padding: '10px', color: 'var(--indigo-primary)', fontWeight: 600 }}>send_payment_link / schedule_retry</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', color: 'var(--status-warning-text)', fontWeight: 600 }}>MANDATE_TENURE_COMPLETED</td>
                    <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>1-year e-NACH/UPI mandate expired</td>
                    <td style={{ padding: '10px', color: 'var(--text-primary)' }}>Send 1-click renewal link to prevent service interruption</td>
                    <td style={{ padding: '10px', color: 'var(--indigo-primary)', fontWeight: 600 }}>update_payment_mandate</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', color: 'var(--status-info-text)', fontWeight: 600 }}>ISSUER_BANK_TECHNICAL_TIMEOUT</td>
                    <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>Bank CBS server temporary downtime</td>
                    <td style={{ padding: '10px', color: 'var(--text-primary)' }}>Inform that bank is back online; offer immediate re-try</td>
                    <td style={{ padding: '10px', color: 'var(--indigo-primary)', fontWeight: 600 }}>retry_now</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', color: 'var(--status-danger-text)', fontWeight: 600 }}>CARD_VALIDITY_EXPIRED</td>
                    <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>Credit card MM/YY expired</td>
                    <td style={{ padding: '10px', color: 'var(--text-primary)' }}>Provide tokenized update link or upgrade to UPI Autopay</td>
                    <td style={{ padding: '10px', color: 'var(--indigo-primary)', fontWeight: 600 }}>update_payment_mandate</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', color: 'var(--status-warning-text)', fontWeight: 600 }}>MANDATE_MAX_AMOUNT_EXCEEDED</td>
                    <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>Bill exceeded mandate limit cap</td>
                    <td style={{ padding: '10px', color: 'var(--text-primary)' }}>Collect delta via payment link and prompt mandate limit modification</td>
                    <td style={{ padding: '10px', color: 'var(--indigo-primary)', fontWeight: 600 }}>send_payment_link</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="blueprint-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={16} style={{ color: 'var(--status-success-text)' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Telephony Performance & Latency Engineering (&lt;520ms)
              </h3>
            </div>
            <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7', paddingLeft: '20px' }}>
              <li><strong>Streaming WebSockets:</strong> Audio streams directly via bidirectional WebSockets (PCM 16-bit 8kHz for PSTN, 24kHz for WebRTC), eliminating chunk buffering.</li>
              <li><strong>Interruption & Barge-in Handling:</strong> Speech detection halts agent audio within 80ms of human speech onset, creating natural conversational turn-taking.</li>
              <li><strong>Speculative Tool Execution:</strong> Payment links are pre-generated during customer greeting stage and cached, allowing instantaneous dispatch upon verbal confirmation.</li>
              <li><strong>RBI & PCI-DSS Compliance:</strong> Agent explicitly enforces zero collection of OTP, CVV, or UPI PIN over telephony. All transactions complete through Razorpay's end-to-end encrypted hosted checkout.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
