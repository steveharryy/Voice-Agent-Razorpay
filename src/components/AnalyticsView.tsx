'use client';

import React from 'react';
import { CustomerRecord } from '@/types';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  Clock,
  PhoneCall,
  DollarSign,
  ArrowUpRight,
  Send,
  Building2,
  QrCode,
  CreditCard,
} from 'lucide-react';

interface AnalyticsViewProps {
  customers: CustomerRecord[];
}

export default function AnalyticsView({ customers }: AnalyticsViewProps) {
  const totalAmount = customers.reduce((acc, c) => acc + c.amount, 0);
  const recoveredCustomers = customers.filter((c) => c.status === 'RECOVERED');
  const recoveredAmount = recoveredCustomers.reduce((acc, c) => acc + c.amount, 0);
  const recoveryRate = Math.round((recoveredAmount / (totalAmount || 1)) * 100);

  const pendingLinks = customers.filter((c) => c.status === 'PAYMENT_LINK_SENT').length;
  const scheduledRetries = customers.filter((c) => c.status === 'RETRY_SCHEDULED').length;
  const failedCount = customers.filter((c) => c.status === 'FAILED' || c.status === 'CALLING').length;

  // Group by failure reason
  const failureCounts: Record<string, number> = {};
  customers.forEach((c) => {
    failureCounts[c.failureReason] = (failureCounts[c.failureReason] || 0) + 1;
  });

  // Group by mandate type
  const mandateCounts: Record<string, number> = {};
  customers.forEach((c) => {
    mandateCounts[c.mandateType] = (mandateCounts[c.mandateType] || 0) + 1;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Autopay Recovery Analytics
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Real-time telemetry on involuntary churn, voice recovery conversion, and recovered recurring ARR.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-recovered">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
            Telemetry Live
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Updated real-time</span>
        </div>
      </div>

      {/* Top Summary Banner */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
              Portfolio Recovery Health
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              ₹{recoveredAmount.toLocaleString('en-IN')}{' '}
              <span style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 400 }}>
                of ₹{totalAmount.toLocaleString('en-IN')} recovered
              </span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Autonomous AI Voice outreach has prevented involuntary churn across{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{recoveredCustomers.length}</strong> merchant subscription accounts.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>First-Call Resolution</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--status-success-text)' }}>
                {recoveryRate}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Target: &gt;65%</div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Average Handling Time</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--indigo-primary)' }}>
                42s
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>vs 4.5m human rep</div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Est. Recovered ARR</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
                ₹{(recoveredAmount * 12).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--status-success-text)' }}>Annualized run-rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Analytical Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        {/* Failure Reason Root-Cause Distribution */}
        <div className="blueprint-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} style={{ color: 'var(--status-danger-text)' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Failure Root-Cause Breakdown
              </h3>
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>10 Accounts</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(failureCounts).map(([reason, count]) => {
              const pct = Math.round((count / customers.length) * 100);
              return (
                <div key={reason}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {reason.replace(/_/g, ' ')}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: '6px', background: '#F1F3F7', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background:
                          reason === 'ACCOUNT_INSUFFICIENT_BALANCE'
                            ? '#DC2626'
                            : reason === 'MANDATE_TENURE_COMPLETED'
                            ? '#D97706'
                            : '#635BFF',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Rails & Mandate Breakdown */}
        <div className="blueprint-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChart size={16} style={{ color: 'var(--indigo-primary)' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Payment Rails &amp; Mandate Share
              </h3>
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>NPCI / Gateway</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(mandateCounts).map(([rail, count]) => {
              const pct = Math.round((count / customers.length) * 100);
              const railIcon =
                rail === 'UPI_AUTOPAY' ? (
                  <QrCode size={13} style={{ color: 'var(--status-info-text)' }} />
                ) : rail === 'E_NACH' ? (
                  <Building2 size={13} style={{ color: 'var(--status-info-text)' }} />
                ) : (
                  <CreditCard size={13} style={{ color: 'var(--indigo-primary)' }} />
                );

              return (
                <div key={rail}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                      {railIcon}
                      {rail.replace('_', ' ')}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: '6px', background: '#F1F3F7', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: rail === 'UPI_AUTOPAY' ? '#0284C7' : rail === 'E_NACH' ? '#635BFF' : '#10B981',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recovery Conversion Funnel */}
      <div className="blueprint-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} style={{ color: 'var(--status-success-text)' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Autopay Voice Recovery Conversion Funnel
            </h3>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Step-by-step resolution</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {/* Stage 1 */}
          <div
            style={{
              background: '#F8F9FB',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
              Stage 1 • Detection
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--status-danger-text)', marginTop: '4px' }}>
              {customers.length} Failed
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Razorpay recurring debit failures ingested
            </div>
          </div>

          {/* Stage 2 */}
          <div
            style={{
              background: '#F8F9FB',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
              Stage 2 • Outreach
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--indigo-primary)', marginTop: '4px' }}>
              {customers.filter((c) => c.status !== 'FAILED').length} Engaged
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Contacted via Voice Agent or instant SMS
            </div>
          </div>

          {/* Stage 3 */}
          <div
            style={{
              background: '#F8F9FB',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
              Stage 3 • Action
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--status-info-text)', marginTop: '4px' }}>
              {pendingLinks + recoveredCustomers.length} Links Dispatched
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              1-Click payment links delivered to customer
            </div>
          </div>

          {/* Stage 4 */}
          <div
            style={{
              background: 'var(--status-success-bg)',
              border: '1px solid var(--status-success-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--status-success-text)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
              Stage 4 • Settlement
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--status-success-text)', marginTop: '4px' }}>
              {recoveredCustomers.length} Salvaged
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              payment.captured webhook verified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
