'use client';

import React from 'react';
import { CustomerRecord } from '@/types';
import { BarChart3, PieChart, TrendingUp, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface AnalyticsViewProps {
  customers: CustomerRecord[];
}

export default function AnalyticsView({ customers }: AnalyticsViewProps) {
  const totalAmount = customers.reduce((acc, c) => acc + c.amount, 0);
  const recoveredAmount = customers
    .filter((c) => c.status === 'RECOVERED')
    .reduce((acc, c) => acc + c.amount, 0);
  const recoveryRate = Math.round((recoveredAmount / (totalAmount || 1)) * 100);

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
      {/* Top Summary Banner */}
      <div className="blueprint-card" style={{ background: 'linear-gradient(135deg, rgba(51, 149, 255, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)', borderColor: 'rgba(51, 149, 255, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Autopay Portfolio Salvage Health
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              ₹{recoveredAmount.toLocaleString('en-IN')} of ₹{totalAmount.toLocaleString('en-IN')} Recovered
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Active AI Voice Outreach has prevented involuntary churn across {customers.filter((c) => c.status === 'RECOVERED').length} merchant accounts.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>First-Call Resolution</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{recoveryRate}%</div>
            </div>
            <div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>AHT (Avg Handling Time)</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--razorpay-blue)' }}>42s</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
        {/* Failure Reason Breakdown */}
        <div className="blueprint-card">
          <h3>
            <ShieldAlert size={16} style={{ color: '#f43f5e' }} />
            Failure Reason Root-Cause Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
            {Object.entries(failureCounts).map(([reason, count]) => {
              const pct = Math.round((count / customers.length) * 100);
              return (
                <div key={reason}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{reason.replace(/_/g, ' ')}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{count} mandates ({pct}%)</span>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #f43f5e 0%, #f59e0b 100%)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mandate Rails Distribution */}
        <div className="blueprint-card">
          <h3>
            <PieChart size={16} style={{ color: 'var(--razorpay-cyan)' }} />
            Payment Rails &amp; Mandate Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
            {Object.entries(mandateCounts).map(([rail, count]) => {
              const pct = Math.round((count / customers.length) * 100);
              return (
                <div key={rail}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{rail.replace('_', ' ')}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{count} accounts ({pct}%)</span>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #3395ff 0%, #00d2ff 100%)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recovery Funnel */}
      <div className="blueprint-card">
        <h3>
          <TrendingUp size={16} style={{ color: '#10b981' }} />
          Autopay Voice Recovery Conversion Funnel
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '14px' }}>
          <div style={{ background: 'rgba(8, 13, 26, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>STAGE 1</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#f43f5e', marginTop: '2px' }}>10 Failed</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Failed recurring debits</div>
          </div>

          <div style={{ background: 'rgba(8, 13, 26, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>STAGE 2</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--razorpay-blue)', marginTop: '2px' }}>
              {customers.filter((c) => c.status !== 'FAILED').length} Engaged
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Contacted via Voice / Link</div>
          </div>

          <div style={{ background: 'rgba(8, 13, 26, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>STAGE 3</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#c084fc', marginTop: '2px' }}>
              {customers.filter((c) => c.status === 'PAYMENT_LINK_SENT' || c.status === 'RECOVERED').length} Links Sent
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>1-Click payment links</div>
          </div>

          <div style={{ background: 'rgba(8, 13, 26, 0.6)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '14px' }}>
            <div style={{ fontSize: '11px', color: '#10b981' }}>STAGE 4</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
              {customers.filter((c) => c.status === 'RECOVERED').length} Salvaged
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Payments captured (200 OK)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
