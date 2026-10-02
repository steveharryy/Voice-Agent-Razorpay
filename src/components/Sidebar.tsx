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
  ShieldCheck,
  Headphones,
  Sliders,
  X,
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
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 99,
          }}
          onClick={onClose}
        />
      )}

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Logo */}
        <div className="sidebar-logo">
          <div className="logo-symbol">
            <Sparkles size={20} />
          </div>
          <div className="logo-text-wrap">
            <div className="logo-title">
              <span>Call</span>
              <span className="violet-text">AI</span>
              <span style={{ fontSize: '10px', color: '#06b6d4', marginLeft: '4px', fontWeight: 600 }}>
                x Razorpay
              </span>
            </div>
            <div className="logo-subtitle">Autopay Recovery Agent</div>
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

        {/* Navigation Sections */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">Core Operations</div>

          <div
            className={`sidebar-nav-item ${activeTab === 'QUEUE' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('QUEUE');
              onClose();
            }}
          >
            <div className="nav-item-left">
              <LayoutDashboard size={16} className="nav-icon" />
              <span>Recovery Queue</span>
            </div>
            <span className="nav-pill-badge">{customerCount}</span>
          </div>

          <div
            className={`sidebar-nav-item ${activeTab === 'AGENTS' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('AGENTS');
              onClose();
            }}
          >
            <div className="nav-item-left">
              <Headphones size={16} className="nav-icon" />
              <span>Voice Agents</span>
            </div>
            <span className="nav-pill-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              1 Active
            </span>
          </div>

          <div
            className={`sidebar-nav-item ${activeTab === 'ANALYTICS' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('ANALYTICS');
              onClose();
            }}
          >
            <div className="nav-item-left">
              <BarChart3 size={16} className="nav-icon" />
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
            <div className="nav-item-left">
              <Layers size={16} className="nav-icon" />
              <span>FDE Blueprint</span>
            </div>
          </div>

          <div className="nav-section-title" style={{ marginTop: '16px' }}>
            Telephony &amp; Tools
          </div>

          <div
            className="sidebar-nav-item"
            onClick={() => {
              onOpenDialer();
              onClose();
            }}
          >
            <div className="nav-item-left">
              <PhoneCall size={16} className="nav-icon" />
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
            <div className="nav-item-left">
              <Volume2 size={16} className="nav-icon" />
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
            <div className="nav-item-left">
              <RotateCcw size={16} className="nav-icon" />
              <span>Reset Data</span>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="voice-status-box">
            <div className="voice-status-header">
              <span>Voice Engine Active</span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            </div>
            <div className="voice-status-text">
              Strict English (US) • GPT-4o-mini &amp; Nova-2 ASR
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 4px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              FD
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>Razorpay FDE</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Forward Deployed</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
