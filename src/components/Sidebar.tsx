'use client';

import React from 'react';
import {
  Sparkles,
  PhoneCall,
  LayoutDashboard,
  BarChart3,
  Layers,
  Volume2,
  RotateCcw,
  Headphones,
  Sliders,
  X,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'QUEUE' | 'AGENTS' | 'ANALYTICS' | 'ARCHITECTURE';
  setActiveTab: (tab: 'QUEUE' | 'AGENTS' | 'ANALYTICS' | 'ARCHITECTURE') => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenVoiceSettings: () => void;
  onOpenDialer: () => void;
  onResetData: () => void;
  customerCount: number;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  onOpenVoiceSettings,
  onOpenDialer,
  onResetData,
  customerCount,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.25)',
            backdropFilter: 'blur(2px)',
            zIndex: 99,
          }}
          onClick={onClose}
        />
      )}

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Sparkles size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="brand-title">
              <span>CallAI</span>
              <span style={{ fontSize: '10px', color: 'var(--indigo-primary)', background: 'var(--indigo-subtle)', padding: '1px 6px', borderRadius: '4px' }}>
                Razorpay
              </span>
            </div>
            <div className="brand-subtitle">Autopay Recovery Engine</div>
          </div>
          {isOpen && (
            <button
              onClick={onClose}
              style={{
                marginLeft: 'auto',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-title">Operations</div>

          <div
            className={`sidebar-nav-item ${activeTab === 'QUEUE' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('QUEUE');
              onClose();
            }}
          >
            <div className="nav-item-content">
              <LayoutDashboard size={15} />
              <span>Recovery Queue</span>
            </div>
            <span className="nav-counter">{customerCount}</span>
          </div>

          <div
            className={`sidebar-nav-item ${activeTab === 'AGENTS' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('AGENTS');
              onClose();
            }}
          >
            <div className="nav-item-content">
              <Headphones size={15} />
              <span>Voice Agents</span>
            </div>
            <span className="nav-counter" style={{ background: '#ECFDF5', color: '#059669' }}>
              Active
            </span>
          </div>

          <div
            className={`sidebar-nav-item ${activeTab === 'ANALYTICS' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('ANALYTICS');
              onClose();
            }}
          >
            <div className="nav-item-content">
              <BarChart3 size={15} />
              <span>Recovery Analytics</span>
            </div>
          </div>

          <div
            className={`sidebar-nav-item ${activeTab === 'ARCHITECTURE' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('ARCHITECTURE');
              onClose();
            }}
          >
            <div className="nav-item-content">
              <Layers size={15} />
              <span>FDE Blueprint</span>
            </div>
          </div>

          <div className="sidebar-nav-title" style={{ marginTop: '16px' }}>
            Settings &amp; Tools
          </div>

          <div
            className="sidebar-nav-item"
            onClick={() => {
              onOpenDialer();
              onClose();
            }}
          >
            <div className="nav-item-content">
              <PhoneCall size={15} />
              <span>Vapi Telephony</span>
            </div>
          </div>

          <div
            className="sidebar-nav-item"
            onClick={() => {
              onOpenVoiceSettings();
              onClose();
            }}
          >
            <div className="nav-item-content">
              <Volume2 size={15} />
              <span>Voice Settings</span>
            </div>
          </div>

          <div
            className="sidebar-nav-item"
            onClick={() => {
              onResetData();
              onClose();
            }}
          >
            <div className="nav-item-content">
              <RotateCcw size={15} />
              <span>Reset Data</span>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-status-box">
            <div className="sidebar-status-header">
              <span>Voice Engine</span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
            </div>
            <div className="sidebar-status-desc">
              Strict English (US) • &lt;520ms
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--indigo-subtle)',
                border: '1px solid var(--indigo-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--indigo-primary)',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              FD
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Razorpay FDE</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Production Mode</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
