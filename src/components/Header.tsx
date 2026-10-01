'use client';

import React from 'react';
import { PhoneCall, Layers, Settings, RotateCcw, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenDialer: () => void;
  onOpenArchitecture: () => void;
  onOpenVapiConfig: () => void;
  onResetData: () => void;
}

export default function Header({
  onOpenDialer,
  onOpenArchitecture,
  onOpenVapiConfig,
  onResetData,
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="razorpay-logo-badge" title="Razorpay R-Recover">
          R
        </div>
        <div className="brand-title-wrap">
          <h1>
            <span>Razorpay</span> <span className="highlight">R-Recover</span>
            <span className="badge badge-pill-subtle" style={{ fontSize: '11px', marginLeft: '6px' }}>
              <ShieldCheck size={12} style={{ display: 'inline', marginRight: '3px' }} />
              FDE Edition
            </span>
          </h1>
          <p className="brand-subtitle">
            Autonomous Voice Agent for Failed Autopay Recovery • UPI Autopay &amp; e-NACH Smart Engine
          </p>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="btn btn-call"
          onClick={onOpenDialer}
          title="Dial your real phone number via Vapi.ai API"
        >
          <PhoneCall size={15} />
          <span>Call My Phone</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={onOpenArchitecture}
          title="View System Architecture &amp; Razorpay FDE Blueprint"
        >
          <Layers size={15} />
          <span>Architecture &amp; Design</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={onOpenVapiConfig}
          title="View and copy Vapi Assistant JSON configuration"
        >
          <Settings size={15} />
          <span>Vapi Config</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={onResetData}
          title="Reset 10 customer records to initial state"
        >
          <RotateCcw size={15} />
          <span>Reset Demo</span>
        </button>
      </div>
    </header>
  );
}
