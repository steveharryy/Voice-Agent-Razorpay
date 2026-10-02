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
  Building2,
  Calendar,
  Clock,
  Phone,
  Mail,
  Copy,
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
        {/* Drawer Header */}
        <div className="drawer-header">
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Subscription Inspection
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {customer.subscriptionId}
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-icon"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Top Customer Card */}
          <div className="drawer-data-card" style={{ background: 'rgba(51, 149, 255, 0.05)', borderColor: 'rgba(51, 149, 255, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="customer-avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{customer.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {customer.merchantName} • {customer.planName}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  ₹{customer.amount.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                  {customer.billingFrequency}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
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
          <div style={{ display: 'flex', gap: '10px' }}>
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
                    style={{ background: '#10b981', color: '#fff' }}
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
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  color: '#6ee7b7',
                  fontSize: '12.5px',
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
          <div>
            <div className="drawer-section-title">Autopay Failure Diagnostics</div>
            <div className="drawer-data-card" style={{ borderLeft: '3px solid #f43f5e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fda4af', fontWeight: 600, fontSize: '13px' }}>
                <AlertTriangle size={14} />
                <span>{customer.failureReason.replace(/_/g, ' ')}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.45' }}>
                {customer.failureDescription}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                Gateway Code: {customer.razorpayErrorCode}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={11} />
                <span>Failed at: {customer.failedAt}</span>
              </div>
            </div>
          </div>

          {/* Mandate Registration Metadata */}
          <div>
            <div className="drawer-section-title">NPCI &amp; Mandate Details</div>
            <div className="drawer-data-card">
              <div className="drawer-data-row">
                <span className="drawer-data-label">Mandate Type</span>
                <span className="drawer-data-value">{customer.mandateType.replace('_', ' ')}</span>
              </div>
              <div className="drawer-data-row">
                <span className="drawer-data-label">Issuing Bank</span>
                <span className="drawer-data-value">{customer.mandateDetails.bankOrProvider}</span>
              </div>
              <div className="drawer-data-row">
                <span className="drawer-data-label">Account / VPA Handle</span>
                <span className="drawer-data-value" style={{ fontFamily: 'var(--font-mono)' }}>
                  {customer.mandateDetails.identifier}
                </span>
              </div>
              {customer.mandateDetails.mandateLimit && (
                <div className="drawer-data-row">
                  <span className="drawer-data-label">Preset Mandate Ceiling</span>
                  <span className="drawer-data-value">₹{customer.mandateDetails.mandateLimit.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="drawer-data-row">
                <span className="drawer-data-label">Debit Attempt Count</span>
                <span className="drawer-data-value">{customer.attemptCount} of {customer.maxAttempts} debits</span>
              </div>
              <div className="drawer-data-row">
                <span className="drawer-data-label">Due Date</span>
                <span className="drawer-data-value">{customer.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Call Transcript Audit */}
          <div>
            <div className="drawer-section-title">Voice Recovery Audit History</div>
            <div className="drawer-data-card">
              {customer.callLogs && customer.callLogs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {customer.callLogs.map((log) => (
                    <div key={log.id} style={{ fontSize: '12px' }}>
                      <div style={{ color: log.sender === 'agent' ? 'var(--razorpay-blue)' : '#38bdf8', fontWeight: 600 }}>
                        {log.sender === 'agent' ? 'Arya (AI)' : 'Customer'}:
                      </div>
                      <div style={{ color: '#cbd5e1' }}>{log.message}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '10px 0' }}>
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
