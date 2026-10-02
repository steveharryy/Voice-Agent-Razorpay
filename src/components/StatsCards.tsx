'use client';

import React from 'react';
import { CustomerRecord } from '@/types';
import { IndianRupee, TrendingUp, AlertTriangle, CheckCircle2, Clock, Send, Calendar } from 'lucide-react';

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
    <div className="kpi-strip">
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Total Overdue Autopay</span>
          <AlertTriangle size={14} style={{ color: '#f43f5e' }} />
        </div>
        <div className="kpi-value-row">
          <span className="kpi-value">₹{totalAmount.toLocaleString('en-IN')}</span>
          <span className="kpi-subtext">across 10 mandates</span>
        </div>
        <div className="kpi-subtext">
          {failedCount} subscriptions currently pending recovery
        </div>
        <div className="kpi-progress-bar">
          <div className="kpi-progress-fill" style={{ width: '100%', background: '#f43f5e' }} />
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Recovered Revenue</span>
          <TrendingUp size={14} style={{ color: '#10b981' }} />
        </div>
        <div className="kpi-value-row">
          <span className="kpi-value" style={{ color: '#10b981' }}>
            ₹{recoveredAmount.toLocaleString('en-IN')}
          </span>
          <span className="kpi-subtext">
            {recoveredCustomers.length} of {customers.length} salvaged
          </span>
        </div>
        <div className="kpi-subtext">
          Recovered via instant WhatsApp link / card authorization
        </div>
        <div className="kpi-progress-bar">
          <div className="kpi-progress-fill" style={{ width: `${recoveryRate}%`, background: '#10b981' }} />
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Voice Recovery Rate</span>
          <CheckCircle2 size={14} style={{ color: 'var(--razorpay-blue)' }} />
        </div>
        <div className="kpi-value-row">
          <span className="kpi-value" style={{ color: 'var(--razorpay-blue)' }}>
            {recoveryRate}%
          </span>
          <span className="kpi-subtext">FCR benchmark: &gt;65%</span>
        </div>
        <div className="kpi-subtext">
          First-Call Resolution (FCR) target achieved
        </div>
        <div className="kpi-progress-bar">
          <div className="kpi-progress-fill" style={{ width: `${recoveryRate}%` }} />
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">In-Flight Queue</span>
          <Clock size={14} style={{ color: '#8b5cf6' }} />
        </div>
        <div className="kpi-value-row">
          <span className="kpi-value" style={{ color: '#c084fc', fontSize: '20px' }}>
            {pendingLinks} Links
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span className="kpi-value" style={{ color: '#f59e0b', fontSize: '20px' }}>
            {scheduledRetries} Retries
          </span>
        </div>
        <div className="kpi-subtext">
          Active recovery workflows being tracked
        </div>
        <div className="kpi-progress-bar">
          <div
            className="kpi-progress-fill"
            style={{ width: `${((pendingLinks + scheduledRetries) / 10) * 100}%`, background: '#8b5cf6' }}
          />
        </div>
      </div>
    </div>
  );
}
