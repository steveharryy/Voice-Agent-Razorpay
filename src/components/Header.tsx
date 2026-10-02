'use client';

import React from 'react';
import { PhoneCall, Layers, Volume2, RotateCcw, ShieldCheck, ChevronDown, Activity } from 'lucide-react';

interface HeaderProps {
  onOpenDialer: () => void;
  onOpenArchitecture: () => void;
  onOpenVoiceSettings: () => void;
  onResetData: () => void;
}

export default function Header({
  onOpenDialer,
  onOpenArchitecture,
  onOpenVoiceSettings,
  onResetData,
}: HeaderProps) {
  return (
    <header className="top-navbar">
      <div className="nav-left">
        <div className="rzp-badge">
          <div className="rzp-icon" title="Razorpay Subscriptions">
            R
          </div>
          <div className="rzp-product-label">
            <div className="rzp-product-name">
              <span>Razorpay</span>
              <span style={{ color: 'var(--razorpay-blue)' }}>R-Recover</span>
              <span className="env-pill">
                <span className="env-dot" />
                Live Autopay Ops
              </span>
            </div>
            <div className="rzp-sub-label">
              Autonomous Voice Recovery Agent • UPI Autopay &amp; e-NACH Mandate Engine
            </div>
          </div>
        </div>
      </div>

      <div className="nav-actions">
        {/* Voice Selector button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenVoiceSettings}
          title="Configure &amp; Test English Voice"
          style={{ borderColor: 'rgba(51, 149, 255, 0.35)' }}
        >
          <Volume2 size={14} style={{ color: 'var(--razorpay-blue)' }} />
          <span>Voice: English (US)</span>
        </button>

        {/* Real phone call dialer */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenDialer}
          title="Place real cellular call via Vapi API"
        >
          <PhoneCall size={14} />
          <span>Call Phone (Vapi)</span>
        </button>

        {/* FDE Architecture Blueprint */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenArchitecture}
          title="View Razorpay FDE Architecture Blueprint &amp; NPCI Schemas"
        >
          <Layers size={14} />
          <span>Architecture &amp; Design</span>
        </button>

        {/* Reset Demo button */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={onResetData}
          title="Reset 10 customer records to initial state"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
}
