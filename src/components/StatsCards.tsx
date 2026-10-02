'use client';

import React from 'react';
import { CustomerRecord } from '@/types';
import { AlertCircle, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

interface StatsCardsProps {
  customers: CustomerRecord[];
}

export default function StatsCards({ customers }: StatsCardsProps) {
  const totalAmount = customers.reduce((acc, c) => acc + c.amount, 0);
  const recoveredCustomers = customers.filter((c) => c.status === 'RECOVERED');
  const recoveredAmount = recoveredCustomers.reduce((acc, c) => acc + c.amount, 0);
  const recoveryRate = Math.round((recoveredAmount / (totalAmount || 1)) * 100);

  const pendingLinks = customers.filter((c) => c.status === 'PAYMENT_LINK_SENT').length;
  const scheduledRetries = customers.filter((c) => c.status === 'RETRY_SCHEDULED').length;
  const failedCount = customers.filter((c) => c.status === 'FAILED' || c.status === 'CALLING').length;

  return (
    <div className="metrics-grid">
      {/* Metric 1 */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-label">Total Overdue Autopay</span>
          <AlertCircle size={14} style={{ color: 'var(--status-danger-text)' }} />
        </div>
        <div className="metric-value">₹{totalAmount.toLocaleString('en-IN')}</div>
        <div className="metric-subtext">
          {failedCount} failed recurring debits
        </div>
        <div className="metric-bar-bg">
          <div className="metric-bar-fill" style={{ width: '100%', background: 'var(--status-danger-text)' }} />
        </div>
      </div>

      {/* Metric 2 */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-label">Recovered Revenue</span>
          <TrendingUp size={14} style={{ color: 'var(--status-success-text)' }} />
        </div>
        <div className="metric-value" style={{ color: 'var(--status-success-text)' }}>
          ₹{recoveredAmount.toLocaleString('en-IN')}
        </div>
        <div className="metric-subtext">
          {recoveredCustomers.length} of {customers.length} salvaged
        </div>
        <div className="metric-bar-bg">
          <div className="metric-bar-fill" style={{ width: `${recoveryRate}%`, background: 'var(--status-success-text)' }} />
        </div>
      </div>

      {/* Metric 3 */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-label">Recovery Success Rate</span>
          <CheckCircle2 size={14} style={{ color: 'var(--indigo-primary)' }} />
        </div>
        <div className="metric-value" style={{ color: 'var(--indigo-primary)' }}>
          {recoveryRate}%
        </div>
        <div className="metric-subtext">
          First-Call Resolution benchmark: &gt;65%
        </div>
        <div className="metric-bar-bg">
          <div className="metric-bar-fill" style={{ width: `${recoveryRate}%`, background: 'var(--indigo-primary)' }} />
        </div>
      </div>

      {/* Metric 4 */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-label">In-Flight Queue</span>
          <Clock size={14} style={{ color: 'var(--status-info-text)' }} />
        </div>
        <div className="metric-value" style={{ color: 'var(--text-primary)', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--status-info-text)' }}>{pendingLinks} Links</span>
          <span style={{ color: 'var(--text-tertiary)' }}>•</span>
          <span style={{ color: 'var(--status-warning-text)' }}>{scheduledRetries} Retries</span>
        </div>
        <div className="metric-subtext">
          Active recovery workflows being tracked
        </div>
        <div className="metric-bar-bg">
          <div
            className="metric-bar-fill"
            style={{ width: `${((pendingLinks + scheduledRetries) / 10) * 100}%`, background: 'var(--status-info-text)' }}
          />
        </div>
      </div>
    </div>
  );
}
