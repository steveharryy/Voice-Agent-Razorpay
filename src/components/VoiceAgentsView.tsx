'use client';

import React from 'react';
import { CustomerRecord } from '@/types';
import { Sparkles, Mic, Activity, CheckCircle2, Sliders, ShieldCheck, RefreshCw, PhoneForwarded } from 'lucide-react';

interface VoiceAgentsViewProps {
  onStartVoiceCall: (customer: CustomerRecord) => void;
  onOpenVoiceSettings: () => void;
  sampleCustomer: CustomerRecord;
}

export default function VoiceAgentsView({
  onStartVoiceCall,
  onOpenVoiceSettings,
  sampleCustomer,
}: VoiceAgentsViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>AI Voice Assistants</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Configure and monitor autonomous voice agents deployed for Razorpay Autopay mandate recovery.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onOpenVoiceSettings}>
          <Sliders size={13} />
          <span>Voice Settings</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        {/* Agent 1: Arya */}
        <div className="callai-card" style={{ borderColor: 'rgba(139, 92, 246, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
                }}
              >
                <Sparkles size={22} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Arya</div>
                <div style={{ fontSize: '11.5px', color: 'var(--callai-violet-light)' }}>
                  Senior Autopay Recovery Specialist
                </div>
              </div>
            </div>
            <span className="badge badge-recovered">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              Active (Live)
            </span>
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '16px' }}>
            Initiates empathetic outbound calls when recurring debits fail. Explains failure codes, generates instant WhatsApp payment links, and reschedules smart retries.
          </div>

          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Language / Voice:</span>
              <strong style={{ color: '#fff' }}>Strict English (US)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>ASR / Speech:</span>
              <strong style={{ color: '#fff' }}>Deepgram Nova-2</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>LLM Engine:</span>
              <strong style={{ color: '#fff' }}>GPT-4o-mini (Razorpay Playbook)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Latency Target:</span>
              <strong style={{ color: '#06b6d4' }}>&lt;520ms End-to-End</strong>
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => onStartVoiceCall(sampleCustomer)}
          >
            <Mic size={14} />
            <span>Launch Test Call with Arya</span>
          </button>
        </div>

        {/* Agent 2: Smart-Retry Scheduler */}
        <div className="callai-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <RefreshCw size={22} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>KAVACH Engine</div>
                <div style={{ fontSize: '11.5px', color: '#38bdf8' }}>Smart Retry &amp; CBS Monitor</div>
              </div>
            </div>
            <span className="badge badge-link">Autonomous</span>
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '16px' }}>
            Monitors issuer bank server downtime (SBI, HDFC, ICICI). Speculatively re-submits debits during optimal core-banking uptime windows without disturbing the customer.
          </div>

          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Retry Schedule:</span>
              <strong style={{ color: '#fff' }}>T+24h &amp; T+72h</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Pre-Debit Notice:</span>
              <strong style={{ color: '#10b981' }}>Compliant (24h SMS/WA)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>NPCI Mandate Check:</span>
              <strong style={{ color: '#fff' }}>Automated Verification</strong>
            </div>
          </div>

          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            <span>Active in Background</span>
          </button>
        </div>

        {/* Agent 3: High-Touch Escalation */}
        <div className="callai-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <PhoneForwarded size={22} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Escalation Router</div>
                <div style={{ fontSize: '11.5px', color: '#fcd34d' }}>Dispute &amp; Churn Prevention</div>
              </div>
            </div>
            <span className="badge badge-retry">Standby</span>
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '16px' }}>
            Triggered automatically when a customer disputes charges or requests cancellation. Pauses future debits immediately and routes ticket to Merchant Support Leads.
          </div>

          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Routing Target:</span>
              <strong style={{ color: '#fff' }}>Priority Relationship Desk</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Debit Pause SLA:</span>
              <strong style={{ color: '#10b981' }}>Instant (&lt;200ms)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Dispute Rate:</span>
              <strong style={{ color: '#fff' }}>&lt;1.8% of Calls</strong>
            </div>
          </div>

          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            <span>Configured via Tool Call</span>
          </button>
        </div>
      </div>
    </div>
  );
}
