'use client';

import React, { useState } from 'react';
import { INITIAL_CUSTOMERS } from '@/data/mockCustomers';
import { buildVapiAssistantConfig } from '@/data/vapiAssistantConfig';
import { Settings, Copy, Check, X, Code2 } from 'lucide-react';

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
            <Settings size={18} style={{ color: 'var(--brand-blue)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Vapi Assistant Configuration Payload</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
              Import this JSON directly into <a href="https://dashboard.vapi.ai" target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>Vapi Dashboard</a> to create the Razorpay Autopay Recovery Assistant.
            </p>
            <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
              {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
              <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>
          </div>

          <div
            style={{
              background: '#040810',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '16px',
              maxHeight: '450px',
              overflowY: 'auto',
            }}
          >
            <pre style={{ color: '#38bdf8', fontSize: '12px', fontFamily: 'monospace', lineHeight: '1.5' }}>
              {jsonString}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
