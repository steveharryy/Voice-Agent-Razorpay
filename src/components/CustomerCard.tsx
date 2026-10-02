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
} from 'lucide-react';

interface CustomerCardProps {
  customer: CustomerRecord;
  onStartVoiceCall: (customer: CustomerRecord) => void;
  onCallViaVapi: (customer: CustomerRecord) => void;
  onOpenCheckout: (customer: CustomerRecord) => void;
  onQuickSendLink: (customer: CustomerRecord) => void;
}

export default function CustomerCard({
  customer,
  onStartVoiceCall,
  onCallViaVapi,
  onOpenCheckout,
  onQuickSendLink,
}: CustomerCardProps) {
  const isRecovered = customer.status === 'RECOVERED';
  const isLinkSent = customer.status === 'PAYMENT_LINK_SENT';
  const isRetryScheduled = customer.status === 'RETRY_SCHEDULED';

  const getStatusBadge = () => {
    switch (customer.status) {
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

  const getMandateIcon = () => {
    switch (customer.mandateType) {
      case 'UPI_AUTOPAY':
        return <QrCode size={13} style={{ color: 'var(--status-info-text)' }} />;
      case 'E_NACH':
        return <Building2 size={13} style={{ color: 'var(--status-info-text)' }} />;
      default:
        return <CreditCard size={13} style={{ color: 'var(--indigo-primary)' }} />;
    }
  };

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
        <div>{getStatusBadge()}</div>
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
            {getMandateIcon()}
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
            <span>View Call History &amp; Logs</span>
          </button>
        )}
      </div>
    </div>
  );
}
