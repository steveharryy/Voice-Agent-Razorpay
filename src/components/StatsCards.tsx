'use client';

import React from 'react';
import { CustomerRecord } from '@/types';
import { IndianRupee, TrendingUp, AlertCircle, CheckCircle2, CalendarClock, Send } from 'lucide-react';

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
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">
          <span>Total Overdue Autopay</span>
          <AlertCircle size={15} style={{ color: '#f43f5e' }} />
        </div>
        <div className="stat-value" style={{ color: '#f8fafc' }}>
          ₹{totalAmount.toLocaleString('en-IN')}
        </div>
        <div className="stat-subtext">Across {customers.length} recurring subscription mandates</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">
          <span>Recovered Revenue</span>
          <TrendingUp size={15} style={{ color: '#10b981' }} />
        </div>
        <div className="stat-value" style={{ color: '#10b981' }}>
          ₹{recoveredAmount.toLocaleString('en-IN')}
        </div>
        <div className="stat-subtext">
          {recoveredCustomers.length} of {customers.length} accounts salvaged
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">
          <span>Voice Recovery Rate</span>
          <CheckCircle2 size={15} style={{ color: '#00e5ff' }} />
        </div>
        <div className="stat-value" style={{ color: '#00e5ff' }}>
          {recoveryRate}%
        </div>
        <div className="stat-subtext">Target benchmark: &gt;65% FCR</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">
          <span>In-Flight Pipeline</span>
          <Send size={15} style={{ color: '#8b5cf6' }} />
        </div>
        <div className="stat-value" style={{ color: '#c084fc', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{pendingLinks} Links</span>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>•</span>
          <span style={{ color: '#f59e0b' }}>{scheduledRetries} Retries</span>
        </div>
        <div className="stat-subtext">{failedCount} waiting for voice recovery intervention</div>
      </div>
    </div>
  );
}
