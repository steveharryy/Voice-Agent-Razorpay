'use client';

import React from 'react';
import { Sparkles, Mic, Volume2, ShieldCheck, Zap, Activity } from 'lucide-react';
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
      <div className="agent-banner-inner">
        <div className="agent-profile">
          <div className="agent-avatar-orb">
            <Sparkles size={28} />
            <div className="agent-online-dot" />
          </div>

          <div>
            <div className="agent-info-title">
              <span>Arya</span>
              <span className="agent-tag">AI Voice Specialist</span>
              <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Activity size={12} />
                <span>Ready to Call</span>
              </span>
            </div>
            <div className="agent-info-desc">
              Context-aware autonomous recovery agent. Explains payment failures, sends instant 1-click Razorpay links, and schedules retries.
            </div>

            <div className="agent-spec-row">
              <div className="spec-chip">
                <span>Model:</span>
                <strong>GPT-4o-mini</strong>
              </div>
              <span style={{ color: 'var(--border-medium)' }}>•</span>
              <div className="spec-chip">
                <span>ASR:</span>
                <strong>Deepgram Nova-2 (Strict EN-US)</strong>
              </div>
              <span style={{ color: 'var(--border-medium)' }}>•</span>
              <div className="spec-chip">
                <span>Latency:</span>
                <strong style={{ color: '#06b6d4' }}>&lt;520ms</strong>
              </div>
              <span style={{ color: 'var(--border-medium)' }}>•</span>
              <div className="spec-chip">
                <span>Tools:</span>
                <strong>4 Razorpay Actions Active</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="agent-banner-actions">
          <button
            className="btn btn-primary"
            onClick={() => onStartVoiceCall(sampleCustomer)}
            title="Launch interactive voice conversation with Arya"
          >
            <Mic size={15} />
            <span>Talk with Arya</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={onOpenVoiceSettings}
            title="Preview and test current English voice"
          >
            <Volume2 size={14} style={{ color: 'var(--callai-violet-light)' }} />
            <span>Test Voice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
