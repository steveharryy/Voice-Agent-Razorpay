'use client';

import React from 'react';
import { Menu, Search, PhoneCall, Layers, Volume2, RotateCcw, Activity } from 'lucide-react';

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
    <header className="main-header">
      <div className="header-left">
        <button className="menu-toggle-btn" onClick={onToggleSidebar} title="Toggle Navigation Sidebar">
          <Menu size={18} />
        </button>

        <div className="search-bar-wrap">
          <Search size={14} className="search-bar-icon" />
          <input
            type="text"
            className="search-bar-input"
            placeholder="Search customers, subscription IDs, failure codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="header-right">
        {/* Voice Selector button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenVoiceSettings}
          title="Configure &amp; Test English Voice"
          style={{ borderColor: 'rgba(139, 92, 246, 0.35)' }}
        >
          <Volume2 size={14} style={{ color: 'var(--callai-violet-light)' }} />
          <span>Voice: English (US)</span>
        </button>

        {/* Real phone call dialer */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenDialer}
          title="Place real cellular call via Vapi API"
        >
          <PhoneCall size={14} />
          <span>Vapi Dial</span>
        </button>

        {/* FDE Architecture Blueprint */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenArchitecture}
          title="View Razorpay FDE Architecture Blueprint &amp; NPCI Schemas"
        >
          <Layers size={14} />
          <span>Blueprint</span>
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
