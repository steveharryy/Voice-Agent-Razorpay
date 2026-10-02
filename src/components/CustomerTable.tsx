'use client';

import React from 'react';
import { CustomerRecord } from '@/types';
import {
  Mic,
  Send,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Building2,
  QrCode,
  CreditCard,
} from 'lucide-react';

interface CustomerTableProps {
  customers: CustomerRecord[];
  selectedCustomerId?: string;
  onSelectCustomer: (customer: CustomerRecord) => void;
  onStartVoiceCall: (customer: CustomerRecord) => void;
  onOpenCheckout: (customer: CustomerRecord) => void;
  onQuickSendLink: (customer: CustomerRecord) => void;
}

export default function CustomerTable({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  onStartVoiceCall,
  onOpenCheckout,
  onQuickSendLink,
}: CustomerTableProps) {
  const getStatusBadge = (status: CustomerRecord['status']) => {
    switch (status) {
      case 'RECOVERED':
        return (
          <span className="badge badge-recovered">
            <CheckCircle2 size={11} /> Recovered
          </span>
        );
      case 'CALLING':
        return (
          <span className="badge badge-calling">
            <PhoneCall size={11} /> In Call
          </span>
        );
      case 'PAYMENT_LINK_SENT':
        return (
          <span className="badge badge-link">
            <Send size={11} /> Link Sent
          </span>
        );
      case 'RETRY_SCHEDULED':
        return (
          <span className="badge badge-retry">
            <Calendar size={11} /> Retry Set
          </span>
        );
      default:
        return (
          <span className="badge badge-failed">
            <AlertTriangle size={11} /> Failed
          </span>
        );
    }
  };

  const getMandateIcon = (type: CustomerRecord['mandateType']) => {
    switch (type) {
      case 'UPI_AUTOPAY':
        return <QrCode size={12} style={{ color: '#06b6d4' }} />;
      case 'E_NACH':
        return <Building2 size={12} style={{ color: '#38bdf8' }} />;
      default:
        return <CreditCard size={12} style={{ color: '#a78bfa' }} />;
    }
  };

  return (
    <div className="table-card">
      <table className="callai-table">
        <thead>
          <tr>
            <th>Customer &amp; Plan</th>
            <th>Overdue Amount</th>
            <th>Mandate Rail</th>
            <th>Failure Reason</th>
            <th>Attempts</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => {
            const isSelected = c.id === selectedCustomerId;
            const isRecovered = c.status === 'RECOVERED';
            const isLinkSent = c.status === 'PAYMENT_LINK_SENT';

            return (
              <tr
                key={c.id}
                className={`table-row ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectCustomer(c)}
              >
                {/* Customer Column */}
                <td>
                  <div className="table-customer-wrap">
                    <div className="table-avatar">{c.name.charAt(0)}</div>
                    <div>
                      <div className="table-customer-name">{c.name}</div>
                      <div className="table-customer-meta">
                        {c.merchantName} • {c.planName}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Amount Column */}
                <td>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                    ₹{c.amount.toLocaleString('en-IN')}
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '3px' }}>
                      /{c.billingFrequency === 'Monthly' ? 'mo' : c.billingFrequency === 'Yearly' ? 'yr' : 'qtr'}
                    </span>
                  </div>
                </td>

                {/* Mandate Column */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#cbd5e1', fontWeight: 500 }}>
                      {getMandateIcon(c.mandateType)}
                      <span>{c.mandateType.replace('_', ' ')}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {c.mandateDetails.bankOrProvider.split(' ')[0]} ({c.mandateDetails.identifier})
                    </div>
                  </div>
                </td>

                {/* Failure Reason */}
                <td>
                  <div style={{ maxWidth: '240px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#fda4af' }}>
                      {c.failureReason.replace(/_/g, ' ')}
                    </div>
                    <div
                      style={{
                        fontSize: '10.5px',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={c.razorpayErrorCode}
                    >
                      {c.razorpayErrorCode}
                    </div>
                  </div>
                </td>

                {/* Debit Attempts */}
                <td>
                  <div style={{ fontSize: '12px' }}>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{c.attemptCount}</span>
                    <span style={{ color: 'var(--text-muted)' }}> of {c.maxAttempts}</span>
                  </div>
                </td>

                {/* Status */}
                <td>{getStatusBadge(c.status)}</td>

                {/* Actions */}
                <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    {!isRecovered ? (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => onStartVoiceCall(c)}
                          title="Call customer with Arya AI voice agent"
                        >
                          <Mic size={13} />
                          <span>Call with Arya</span>
                        </button>

                        {isLinkSent ? (
                          <button
                            className="btn btn-sm"
                            style={{ background: '#10b981', color: '#fff' }}
                            onClick={() => onOpenCheckout(c)}
                            title="Open Razorpay Checkout link"
                          >
                            <ExternalLink size={12} />
                            <span>Pay Link</span>
                          </button>
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onQuickSendLink(c)}
                            title="Send WhatsApp payment link"
                          >
                            <Send size={12} />
                          </button>
                        )}
                      </>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>
                        ✓ Paid
                      </span>
                    )}

                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '6px' }}
                      onClick={() => onSelectCustomer(c)}
                      title="Inspect full mandate details"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
