'use client';

import React from 'react';
import { CustomerRecord } from '@/types';
import {
  Mic,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  CreditCard,
  QrCode,
  Building2,
  Clock,
  Send,
  Calendar,
  ChevronRight,
} from 'lucide-react';

function getStatusBadge(status: CustomerRecord['status']) {
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
}

function getMandateIcon(type: CustomerRecord['mandateType']) {
  switch (type) {
    case 'UPI_AUTOPAY':
      return <QrCode size={13} style={{ color: 'var(--status-info-text)' }} />;
    case 'E_NACH':
      return <Building2 size={13} style={{ color: 'var(--status-info-text)' }} />;
    default:
      return <CreditCard size={13} style={{ color: 'var(--indigo-primary)' }} />;
  }
}

export interface CustomerCardProps {
  customer: CustomerRecord;
  onStartVoiceCall: (customer: CustomerRecord) => void;
  onCallViaVapi: (customer: CustomerRecord) => void;
  onOpenCheckout: (customer: CustomerRecord) => void;
  onQuickSendLink: (customer: CustomerRecord) => void;
}

export function CustomerCard({
  customer,
  onStartVoiceCall,
  onCallViaVapi,
  onOpenCheckout,
  onQuickSendLink,
}: CustomerCardProps) {
  const isRecovered = customer.status === 'RECOVERED';
  const isLinkSent = customer.status === 'PAYMENT_LINK_SENT';
  const isRetryScheduled = customer.status === 'RETRY_SCHEDULED';

  return (
    <div
      className={`customer-card ${isRecovered ? 'recovered' : ''} ${
        customer.status === 'CALLING' ? 'active-calling' : ''
      }`}
    >
      <div className="card-top">
        <div className="cust-info">
          <div className="avatar">{customer.name.charAt(0)}</div>
          <div>
            <div className="cust-name">
              <span>{customer.name}</span>
            </div>
            <div className="cust-meta">
              {customer.merchantName} • {customer.planName}
            </div>
          </div>
        </div>
        <div>{getStatusBadge(customer.status)}</div>
      </div>

      <div className="sub-details-box">
        <div className="sub-detail-item">
          <span className="sub-detail-label">Amount Overdue</span>
          <span className="sub-detail-val amount-highlight">
            ₹{customer.amount.toLocaleString('en-IN')}
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              /{customer.billingFrequency === 'Monthly' ? 'mo' : customer.billingFrequency === 'Yearly' ? 'yr' : 'qtr'}
            </span>
          </span>
        </div>

        <div className="sub-detail-item">
          <span className="sub-detail-label">Mandate Rail</span>
          <span className="sub-detail-val">
            {getMandateIcon(customer.mandateType)}
            <span style={{ fontSize: '12px' }}>
              {customer.mandateType.replace('_', ' ')}
            </span>
          </span>
        </div>

        <div className="sub-detail-item">
          <span className="sub-detail-label">Linked Account</span>
          <span className="sub-detail-val" style={{ fontSize: '12px' }} title={customer.mandateDetails.bankOrProvider}>
            {customer.mandateDetails.bankOrProvider.split(' ')[0]} ({customer.mandateDetails.identifier})
          </span>
        </div>

        <div className="sub-detail-item">
          <span className="sub-detail-label">Attempts</span>
          <span className="sub-detail-val" style={{ fontSize: '12px' }}>
            <Clock size={12} style={{ color: 'var(--text-secondary)' }} />
            {customer.attemptCount} of {customer.maxAttempts} debits
          </span>
        </div>
      </div>

      <div className="failure-alert-box">
        <div className="failure-title">
          <AlertTriangle size={13} />
          <span>{customer.failureReason.replace(/_/g, ' ')}</span>
          <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
            {customer.failedAt}
          </span>
        </div>
        <div className="failure-desc">{customer.failureDescription}</div>
        <div
          style={{
            fontSize: '10.5px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            marginTop: '4px',
          }}
        >
          Code: {customer.razorpayErrorCode}
        </div>
      </div>

      {isRetryScheduled && customer.scheduledRetryDate && (
        <div
          style={{
            background: 'var(--status-warning-bg)',
            border: '1px solid var(--status-warning-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            fontSize: '12px',
            color: 'var(--status-warning-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Calendar size={14} />
          <span>Automated retry scheduled: <strong>{customer.scheduledRetryDate}</strong></span>
        </div>
      )}

      {isRecovered && (
        <div
          style={{
            background: 'var(--status-success-bg)',
            border: '1px solid var(--status-success-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            fontSize: '12px',
            color: 'var(--status-success-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={14} />
          <span>
            Payment of ₹{customer.amount} recovered successfully! Mandate active.
          </span>
        </div>
      )}

      <div className="card-actions">
        {!isRecovered ? (
          <>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onStartVoiceCall(customer)}
              title="Test interactive voice recovery directly in your browser with mic"
            >
              <Mic size={13} />
              <span>Voice (Mic)</span>
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onCallViaVapi(customer)}
              title="Place a real phone call to your verified number using Vapi API"
            >
              <PhoneCall size={12} />
              <span>Vapi Dial</span>
            </button>

            {isLinkSent ? (
              <button
                className="btn btn-sm"
                style={{
                  background: '#10B981',
                  color: '#fff',
                  marginLeft: 'auto',
                  fontWeight: 600,
                }}
                onClick={() => onOpenCheckout(customer)}
                title="Open simulated Razorpay Payment Link Checkout"
              >
                <ExternalLink size={12} />
                <span>Pay Link</span>
              </button>
            ) : (
              <button
                className="btn btn-secondary btn-sm"
                style={{ marginLeft: 'auto' }}
                onClick={() => onQuickSendLink(customer)}
                title="Send instant Razorpay payment link directly"
              >
                <Send size={12} />
                <span>Send Link</span>
              </button>
            )}
          </>
        ) : (
          <button
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => onStartVoiceCall(customer)}
          >
            <span>View Call History & Logs</span>
          </button>
        )}
      </div>
    </div>
  );
}

export interface CustomerTableProps {
  customers: CustomerRecord[];
  selectedCustomerId?: string;
  onSelectCustomer: (customer: CustomerRecord) => void;
  onStartVoiceCall: (customer: CustomerRecord) => void;
  onOpenCheckout: (customer: CustomerRecord) => void;
  onQuickSendLink: (customer: CustomerRecord) => void;
}

export function CustomerTable({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  onStartVoiceCall,
  onOpenCheckout,
  onQuickSendLink,
}: CustomerTableProps) {
  return (
    <div className="table-card">
      <table className="data-table">
        <thead>
          <tr>
            <th>Customer & Plan</th>
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
                className={`data-row ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectCustomer(c)}
              >
                <td>
                  <div className="table-customer">
                    <div className="customer-avatar-box">{c.name.charAt(0)}</div>
                    <div>
                      <div className="customer-name">{c.name}</div>
                      <div className="customer-meta">
                        {c.merchantName} • {c.planName}
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    ₹{c.amount.toLocaleString('en-IN')}
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 400, marginLeft: '3px' }}>
                      /{c.billingFrequency === 'Monthly' ? 'mo' : c.billingFrequency === 'Yearly' ? 'yr' : 'qtr'}
                    </span>
                  </div>
                </td>

                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {getMandateIcon(c.mandateType)}
                      <span>{c.mandateType.replace('_', ' ')}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {c.mandateDetails.bankOrProvider.split(' ')[0]} ({c.mandateDetails.identifier})
                    </div>
                  </div>
                </td>

                <td>
                  <div style={{ maxWidth: '240px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--status-danger-text)' }}>
                      {c.failureReason.replace(/_/g, ' ')}
                    </div>
                    <div
                      style={{
                        fontSize: '10.5px',
                        color: 'var(--text-secondary)',
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

                <td>
                  <div style={{ fontSize: '12px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.attemptCount}</span>
                    <span style={{ color: 'var(--text-secondary)' }}> of {c.maxAttempts}</span>
                  </div>
                </td>

                <td>{getStatusBadge(c.status)}</td>

                <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    {!isRecovered ? (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => onStartVoiceCall(c)}
                          title="Call customer with Arya AI voice agent"
                        >
                          <Mic size={12} />
                          <span>Call Arya</span>
                        </button>

                        {isLinkSent ? (
                          <button
                            className="btn btn-sm"
                            style={{ background: '#10B981', color: '#fff', fontWeight: 600 }}
                            onClick={() => onOpenCheckout(c)}
                            title="Open Razorpay Checkout link"
                          >
                            <ExternalLink size={11} />
                            <span>Pay Link</span>
                          </button>
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onQuickSendLink(c)}
                            title="Send WhatsApp payment link"
                          >
                            <Send size={11} />
                          </button>
                        )}
                      </>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--status-success-text)', fontWeight: 600 }}>
                        ✓ Paid
                      </span>
                    )}

                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '6px' }}
                      onClick={() => onSelectCustomer(c)}
                      title="Inspect full mandate details"
                    >
                      <ChevronRight size={14} />
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

export default CustomerTable;
