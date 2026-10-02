'use client';

import React from 'react';
import { CustomerRecord } from '@/types';
import { AlertCircle, TrendingUp, CheckCircle2, Clock, Send, Calendar } from 'lucide-react';

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
    <div className="kpi-grid">
      {/* Card 1: Overdue Autopay */}
      <div className="callai-card">
        <div className="card-header-row">
          <span className="card-title">Total Overdue Autopay</span>
          <div className="card-icon-pill" style={{ color: '#f43f5e' }}>
            <AlertCircle size={16} />
          </div>
        </div>
        <div className="card-value">₹{totalAmount.toLocaleString('en-IN')}</div>
        <div className="card-subtext">
          <span>{failedCount} mandates pending recovery</span>
        </div>
        <div className="card-progress">
          <div className="card-progress-bar" style={{ width: '100%', background: '#f43f5e' }} />
        </div>
      </div>

      {/* Card 2: Recovered Revenue */}
      <div className="callai-card">
        <div className="card-header-row">
          <span className="card-title">Recovered Revenue</span>
          <div className="card-icon-pill" style={{ color: '#10b981' }}>
            <TrendingUp size={16} />
          </div>
        </div>
        <div className="card-value" style={{ color: '#10b981' }}>
          ₹{recoveredAmount.toLocaleString('en-IN')}
        </div>
        <div className="card-subtext">
          <span>{recoveredCustomers.length} of {customers.length} accounts salvaged</span>
        </div>
        <div className="card-progress">
          <div className="card-progress-bar" style={{ width: `${recoveryRate}%`, background: '#10b981' }} />
        </div>
      </div>

      {/* Card 3: Voice Recovery Rate */}
      <div className="callai-card">
        <div className="card-header-row">
          <span className="card-title">Recovery Success Rate</span>
          <div className="card-icon-pill" style={{ color: 'var(--callai-violet)' }}>
            <CheckCircle2 size={16} />
          </div>
        </div>
        <div className="card-value" style={{ color: 'var(--callai-violet-light)' }}>
          {recoveryRate}%
        </div>
        <div className="card-subtext">
          <span>Benchmark: &gt;65% FCR</span>
        </div>
        <div className="card-progress">
          <div className="card-progress-bar" style={{ width: `${recoveryRate}%`, background: 'var(--gradient-primary)' }} />
        </div>
      </div>

      {/* Card 4: In-Flight Operations */}
      <div className="callai-card">
        <div className="card-header-row">
          <span className="card-title">In-Flight Queue</span>
          <div className="card-icon-pill" style={{ color: '#06b6d4' }}>
            <Clock size={16} />
          </div>
        </div>
        <div className="card-value" style={{ color: '#38bdf8', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{pendingLinks} Links</span>
          <span style={{ color: 'var(--text-faint)' }}>•</span>
          <span style={{ color: '#f59e0b' }}>{scheduledRetries} Retries</span>
        </div>
        <div className="card-subtext">
          <span>Active recovery workflows</span>
        </div>
        <div className="card-progress">
          <div
            className="card-progress-bar"
            style={{ width: `${((pendingLinks + scheduledRetries) / 10) * 100}%`, background: '#06b6d4' }}
          />
        </div>
      </div>
    </div>
  );
}
