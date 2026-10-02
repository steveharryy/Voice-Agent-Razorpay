'use client';

import React from 'react';
import { Menu, Search, PhoneCall, Layers, Volume2, RotateCcw, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  onOpenDialer: () => void;
  onOpenArchitecture: () => void;
  onOpenVoiceSettings: () => void;
  onResetData: () => void;
}

export default function Header({
  onToggleSidebar,
  searchTerm,
  setSearchTerm,
  onOpenDialer,
  onOpenArchitecture,
  onOpenVoiceSettings,
  onResetData,
}: HeaderProps) {
  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
        <button
          className="btn btn-secondary btn-sm"
          style={{ display: 'none', padding: '6px' }}
          onClick={onToggleSidebar}
          title="Toggle Navigation"
        >
          <Menu size={16} />
        </button>

        <div className="header-search-wrap">
          <Search size={14} className="header-search-icon" />
          <input
            type="text"
            className="header-search-input"
            placeholder="Search customers, subscription IDs, failure codes... (⌘K)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="header-actions">
        {/* Voice Selector button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenVoiceSettings}
          title="Configure &amp; Test English Voice"
        >
          <Volume2 size={13} style={{ color: 'var(--indigo-primary)' }} />
          <span>Voice: English (US)</span>
        </button>

        {/* Real phone call dialer */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenDialer}
          title="Place real telephone call via Vapi API"
        >
          <PhoneCall size={13} />
          <span>Vapi Dial</span>
        </button>

        {/* Blueprint */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenArchitecture}
          title="View Razorpay FDE Architecture Blueprint"
        >
          <Layers size={13} />
          <span>Blueprint</span>
        </button>

        {/* Reset button */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={onResetData}
          title="Reset demo records to initial state"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
}
