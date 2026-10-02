'use client';

import React from 'react';
import { Sparkles, Mic, PhoneCall, Volume2, Activity, ShieldCheck, Zap } from 'lucide-react';
import { CustomerRecord } from '@/types';

interface AgentShowcaseCardProps {
  onStartVoiceCall: (customer: CustomerRecord) => void;
  onOpenVoiceSettings: () => void;
  onOpenDialer: () => void;
  sampleCustomer: CustomerRecord;
}

export default function AgentShowcaseCard({
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
              <span>Online &amp; Active</span>
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
