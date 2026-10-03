'use client';

import React from 'react';
import { CustomerRecord } from '@/types';
import {
  Sparkles,
  Mic,
  PhoneCall,
  Volume2,
  Activity,
  Sliders,
  RefreshCw,
  PhoneForwarded,
} from 'lucide-react';

export interface AgentShowcaseCardProps {
  onStartVoiceCall: (customer: CustomerRecord) => void;
  onOpenVoiceSettings: () => void;
  onOpenDialer: () => void;
  sampleCustomer: CustomerRecord;
}

export function AgentShowcaseCard({
  onStartVoiceCall,
  onOpenVoiceSettings,
  onOpenDialer,
  sampleCustomer,
}: AgentShowcaseCardProps) {
  return (
    <div className="voice-agent-banner">
      <div className="agent-banner-left">
        <div className="agent-avatar-circle">
          <Sparkles size={22} />
          <div className="agent-live-dot" />
        </div>

        <div>
          <div className="agent-name-row">
            <span className="agent-name">Arya</span>
            <span className="agent-badge-pill">Autonomous Recovery Agent</span>
            <span style={{ fontSize: '11px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <Activity size={12} />
              <span>Online & Active</span>
            </span>
          </div>

          <div className="agent-desc">
            Autonomous voice agent dedicated to recovering failed recurring autopay payments. Reaches out empathetically, diagnoses failure reasons, generates 1-click Razorpay payment links, and reschedules smart retries.
          </div>

          <div className="agent-specs">
            <div className="spec-item">
              <span>Model:</span>
              <strong>GPT-4o-mini</strong>
            </div>
            <span style={{ color: 'var(--border-color)' }}>•</span>
            <div className="spec-item">
              <span>Voice Engine:</span>
              <strong>Strict English (US)</strong>
            </div>
            <span style={{ color: 'var(--border-color)' }}>•</span>
            <div className="spec-item">
              <span>ASR:</span>
              <strong>Deepgram Nova-2</strong>
            </div>
            <span style={{ color: 'var(--border-color)' }}>•</span>
            <div className="spec-item">
              <span>Latency:</span>
              <strong style={{ color: 'var(--indigo-primary)' }}>&lt;520ms</strong>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary"
          onClick={() => onStartVoiceCall(sampleCustomer)}
          title="Start interactive voice call demonstration with Arya"
        >
          <Mic size={14} />
          <span>Call Customer #1 ({sampleCustomer.name})</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={onOpenDialer}
          title="Place real telephone call via Vapi API"
        >
          <PhoneCall size={13} />
          <span>Vapi Outbound Call</span>
        </button>

        <button
          className="btn btn-ghost"
          onClick={onOpenVoiceSettings}
          title="Test English voice synthesis audio"
        >
          <Volume2 size={13} style={{ color: 'var(--indigo-primary)' }} />
          <span>Test Voice</span>
        </button>
      </div>
    </div>
  );
}

export interface VoiceAgentsViewProps {
  onStartVoiceCall: (customer: CustomerRecord) => void;
  onOpenVoiceSettings: () => void;
  sampleCustomer: CustomerRecord;
}

export function VoiceAgentsView({
  onStartVoiceCall,
  onOpenVoiceSettings,
  sampleCustomer,
}: VoiceAgentsViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>AI Voice Assistants</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Configure and monitor autonomous voice agents deployed for Razorpay Autopay mandate recovery.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={onOpenVoiceSettings}>
          <Sliders size={13} />
          <span>Voice Settings</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <div className="metric-card" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--indigo-subtle)',
                  border: '1px solid var(--indigo-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--indigo-primary)',
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Arya</div>
                <div style={{ fontSize: '11.5px', color: 'var(--indigo-primary)', fontWeight: 600 }}>
                  Autopay Recovery Specialist
                </div>
              </div>
            </div>
            <span className="badge badge-recovered">
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669' }} />
              Live
            </span>
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '14px' }}>
            Initiates empathetic outbound calls when recurring debits fail. Explains failure codes, generates instant WhatsApp payment links, and reschedules smart retries.
          </div>

          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Language / Voice:</span>
              <strong style={{ color: 'var(--text-primary)' }}>Strict English (US)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>ASR Engine:</span>
              <strong style={{ color: 'var(--text-primary)' }}>Deepgram Nova-2</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>LLM Engine:</span>
              <strong style={{ color: 'var(--text-primary)' }}>GPT-4o-mini (Razorpay Playbook)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Latency Target:</span>
              <strong style={{ color: 'var(--indigo-primary)' }}>&lt;520ms End-to-End</strong>
            </div>
          </div>

          <button
            className="btn btn-primary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => onStartVoiceCall(sampleCustomer)}
          >
            <Mic size={13} />
            <span>Launch Test Call with Arya</span>
          </button>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--status-info-bg)',
                  border: '1px solid var(--status-info-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--status-info-text)',
                }}
              >
                <RefreshCw size={18} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>KAVACH Engine</div>
                <div style={{ fontSize: '11.5px', color: 'var(--status-info-text)', fontWeight: 600 }}>Smart Retry & CBS Monitor</div>
              </div>
            </div>
            <span className="badge badge-link">Autonomous</span>
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '14px' }}>
            Monitors issuer bank server downtime (SBI, HDFC, ICICI). Speculatively re-submits debits during optimal core-banking uptime windows without disturbing the customer.
          </div>

          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Retry Schedule:</span>
              <strong style={{ color: 'var(--text-primary)' }}>T+24h & T+72h</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Pre-Debit Notice:</span>
              <strong style={{ color: 'var(--status-success-text)' }}>Compliant (24h SMS/WA)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>NPCI Mandate Check:</span>
              <strong style={{ color: 'var(--text-primary)' }}>Automated Verification</strong>
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            <span>Active in Background</span>
          </button>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--status-warning-bg)',
                  border: '1px solid var(--status-warning-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--status-warning-text)',
                }}
              >
                <PhoneForwarded size={18} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Escalation Router</div>
                <div style={{ fontSize: '11.5px', color: 'var(--status-warning-text)', fontWeight: 600 }}>Dispute & Churn Prevention</div>
              </div>
            </div>
            <span className="badge badge-retry">Standby</span>
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '14px' }}>
            Triggered automatically when a customer disputes charges or requests cancellation. Pauses future debits immediately and routes ticket to Merchant Support Leads.
          </div>

          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Routing Target:</span>
              <strong style={{ color: 'var(--text-primary)' }}>Priority Relationship Desk</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Debit Pause SLA:</span>
              <strong style={{ color: 'var(--status-success-text)' }}>Instant (&lt;200ms)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dispute Rate:</span>
              <strong style={{ color: 'var(--text-primary)' }}>&lt;1.8% of Calls</strong>
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            <span>Configured via Tool Call</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoiceAgentsView;
