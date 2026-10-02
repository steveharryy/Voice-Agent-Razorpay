'use client';

import React, { useState } from 'react';
import { INITIAL_CUSTOMERS } from '@/data/mockCustomers';
import { buildVapiAssistantConfig } from '@/data/vapiAssistantConfig';
import { Settings, Copy, Check, X } from 'lucide-react';

interface VapiConfigModalProps {
  onClose: () => void;
}

export default function VapiConfigModal({ onClose }: VapiConfigModalProps) {
  const [copied, setCopied] = useState(false);
  const sampleCustomer = INITIAL_CUSTOMERS[0];
  const config = buildVapiAssistantConfig(sampleCustomer);
  const jsonString = JSON.stringify(config, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="call-modal"
        style={{ maxWidth: '780px', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="call-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={16} style={{ color: 'var(--indigo-primary)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Vapi Assistant Configuration Payload
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px' }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Import this JSON directly into <a href="https://dashboard.vapi.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--indigo-primary)', fontWeight: 600 }}>Vapi Dashboard</a> to create the Razorpay Autopay Recovery Assistant.
            </p>
            <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
              {copied ? <Check size={13} style={{ color: 'var(--status-success-text)' }} /> : <Copy size={13} />}
              <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>
          </div>

          <div
            style={{
              background: '#F8F9FB',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              maxHeight: '440px',
              overflowY: 'auto',
            }}
          >
            <pre style={{ color: '#1E293B', fontSize: '11.5px', fontFamily: 'var(--font-mono)', lineHeight: '1.5' }}>
              {jsonString}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
