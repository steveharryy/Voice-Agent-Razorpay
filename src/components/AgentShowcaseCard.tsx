'use client';

import React from 'react';
import { Sparkles, Mic, Volume2, Activity } from 'lucide-react';
import { CustomerRecord } from '@/types';

interface AgentShowcaseCardProps {
  onStartVoiceCall: (customer: CustomerRecord) => void;
  onOpenVoiceSettings: () => void;
  sampleCustomer: CustomerRecord;
}

export default function AgentShowcaseCard({
  onStartVoiceCall,
  onOpenVoiceSettings,
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
            <span className="agent-badge-pill">AI Voice Specialist</span>
            <span style={{ fontSize: '11px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <Activity size={12} />
              <span>Ready</span>
            </span>
          </div>
          <div className="agent-desc">
            Autonomous voice agent dedicated to failed autopay recovery. Explains failure codes, generates 1-click Razorpay payment links, and reschedules smart retries.
          </div>

          <div className="agent-specs">
            <div className="spec-item">
              <span>Model:</span>
              <strong>GPT-4o-mini</strong>
            </div>
            <span style={{ color: 'var(--border-color)' }}>•</span>
            <div className="spec-item">
              <span>ASR:</span>
              <strong>Deepgram Nova-2 (Strict EN-US)</strong>
            </div>
            <span style={{ color: 'var(--border-color)' }}>•</span>
            <div className="spec-item">
              <span>Latency:</span>
              <strong style={{ color: 'var(--indigo-primary)' }}>&lt;520ms</strong>
            </div>
            <span style={{ color: 'var(--border-color)' }}>•</span>
            <div className="spec-item">
              <span>Actions:</span>
              <strong>4 Razorpay Tools</strong>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="btn btn-primary"
          onClick={() => onStartVoiceCall(sampleCustomer)}
          title="Launch interactive voice conversation with Arya"
        >
          <Mic size={14} />
          <span>Talk with Arya (Mic)</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={onOpenVoiceSettings}
          title="Preview and test current English voice"
        >
          <Volume2 size={13} style={{ color: 'var(--indigo-primary)' }} />
          <span>Test Voice</span>
        </button>
      </div>
    </div>
  );
}
