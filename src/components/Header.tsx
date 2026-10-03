'use client';

import React from 'react';
import { Menu, Search, Volume2, RotateCcw } from 'lucide-react';

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
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--status-success-bg)',
            border: '1px solid var(--status-success-border)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 10px',
            fontSize: '11.5px',
            color: 'var(--status-success-text)',
            fontWeight: 600,
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
          <span>Arya Agent Active</span>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenVoiceSettings}
          title="Configure & Test English Voice"
        >
          <Volume2 size={13} style={{ color: 'var(--indigo-primary)' }} />
          <span>Strict English</span>
        </button>

        <button
          className="btn btn-ghost btn-sm"
          onClick={onResetData}
          title="Reset demo records to initial state"
        >
          <RotateCcw size={13} />
          <span>Reset Demo</span>
        </button>
      </div>
    </header>
  );
}
