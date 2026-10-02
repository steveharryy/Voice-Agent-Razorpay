'use client';

import React from 'react';
import { CustomerRecord } from '@/types';
import {
  X,
  Mic,
  Send,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Phone,
  Mail,
} from 'lucide-react';

interface CustomerDrawerProps {
  customer: CustomerRecord | null;
  onClose: () => void;
  onStartVoiceCall: (customer: CustomerRecord) => void;
  onOpenCheckout: (customer: CustomerRecord) => void;
  onQuickSendLink: (customer: CustomerRecord) => void;
}

export default function CustomerDrawer({
  customer,
  onClose,
  onStartVoiceCall,
  onOpenCheckout,
  onQuickSendLink,
}: CustomerDrawerProps) {
  if (!customer) return null;

  const isRecovered = customer.status === 'RECOVERED';
  const isLinkSent = customer.status === 'PAYMENT_LINK_SENT';

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="inspection-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="drawer-top">
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
              Subscription Details
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {customer.subscriptionId}
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="drawer-content">
          {/* Customer Summary Card */}
          <div className="drawer-card" style={{ background: 'var(--indigo-subtle)', borderColor: 'var(--indigo-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="customer-avatar-box" style={{ width: '38px', height: '38px', fontSize: '15px' }}>
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{customer.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {customer.merchantName} • {customer.planName}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--indigo-primary)', fontFamily: 'var(--font-mono)' }}>
                  ₹{customer.amount.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {customer.billingFrequency}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(99, 91, 255, 0.15)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                <Phone size={12} />
                <span>{customer.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                <Mail size={12} />
                <span>{customer.email}</span>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {!isRecovered ? (
              <>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => onStartVoiceCall(customer)}
                >
                  <Mic size={14} />
                  <span>Start Voice Recovery</span>
                </button>

                {isLinkSent ? (
                  <button
                    className="btn"
                    style={{ background: '#10B981', color: '#fff' }}
                    onClick={() => onOpenCheckout(customer)}
                  >
                    <ExternalLink size={14} />
                    <span>Open Checkout</span>
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary"
                    onClick={() => onQuickSendLink(customer)}
                    title="Send WhatsApp payment link"
                  >
                    <Send size={14} />
                    <span>Send Link</span>
                  </button>
                )}
              </>
            ) : (
              <div
                style={{
                  width: '100%',
                  background: 'var(--status-success-bg)',
                  border: '1px solid var(--status-success-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  color: 'var(--status-success-text)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <ShieldCheck size={16} />
                <span>Payment captured successfully. Mandate in good standing!</span>
              </div>
            )}
          </div>

          {/* Autopay Failure Diagnostics */}
          <div className="drawer-section">
            <div className="drawer-section-title">Autopay Failure Diagnostics</div>
            <div className="drawer-card" style={{ borderLeft: '3px solid #DC2626', background: 'var(--status-danger-bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-danger-text)', fontWeight: 600, fontSize: '13px' }}>
                <AlertTriangle size={14} />
                <span>{customer.failureReason.replace(/_/g, ' ')}</span>
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: '1.45', marginTop: '4px' }}>
                {customer.failureDescription}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--status-danger-text)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                Gateway Code: {customer.razorpayErrorCode}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <Clock size={11} />
                <span>Failed at: {customer.failedAt}</span>
              </div>
            </div>
          </div>

          {/* Mandate Registration Metadata */}
          <div className="drawer-section">
            <div className="drawer-section-title">NPCI &amp; Mandate Details</div>
            <div className="drawer-card">
              <div className="drawer-row">
                <span className="drawer-row-label">Mandate Type</span>
                <span className="drawer-row-value">{customer.mandateType.replace('_', ' ')}</span>
              </div>
              <div className="drawer-row">
                <span className="drawer-row-label">Issuing Bank</span>
                <span className="drawer-row-value">{customer.mandateDetails.bankOrProvider}</span>
              </div>
              <div className="drawer-row">
                <span className="drawer-row-label">Account / VPA Handle</span>
                <span className="drawer-row-value" style={{ fontFamily: 'var(--font-mono)' }}>
                  {customer.mandateDetails.identifier}
                </span>
              </div>
              {customer.mandateDetails.mandateLimit && (
                <div className="drawer-row">
                  <span className="drawer-row-label">Mandate Ceiling</span>
                  <span className="drawer-row-value">₹{customer.mandateDetails.mandateLimit.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="drawer-row">
                <span className="drawer-row-label">Debit Attempts</span>
                <span className="drawer-row-value">{customer.attemptCount} of {customer.maxAttempts} debits</span>
              </div>
              <div className="drawer-row">
                <span className="drawer-row-label">Due Date</span>
                <span className="drawer-row-value">{customer.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Call Transcript Audit */}
          <div className="drawer-section">
            <div className="drawer-section-title">Voice Recovery Audit History</div>
            <div className="drawer-card">
              {customer.callLogs && customer.callLogs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {customer.callLogs.map((log) => (
                    <div key={log.id} style={{ fontSize: '12px' }}>
                      <div style={{ color: log.sender === 'agent' ? 'var(--indigo-primary)' : 'var(--status-info-text)', fontWeight: 600 }}>
                        {log.sender === 'agent' ? 'Arya (AI)' : 'Customer'}:
                      </div>
                      <div style={{ color: 'var(--text-primary)', marginTop: '2px' }}>{log.message}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '10px 0' }}>
                  No prior call sessions recorded. Click "Start Voice Recovery" to initiate contact.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
