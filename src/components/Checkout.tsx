'use client';

import React, { useState } from 'react';
import { CustomerRecord } from '@/types';
import { audioEffects } from '@/lib/audio';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  X,
  QrCode,
  CreditCard,
  Building,
  CheckCircle,
  Smartphone,
  ArrowRight,
} from 'lucide-react';

interface CheckoutProps {
  customer: CustomerRecord;
  onClose: () => void;
  onPaymentSuccess: (customer: CustomerRecord, paymentDetails: any) => void;
}

export default function Checkout({
  customer,
  onClose,
  onPaymentSuccess,
}: CheckoutProps) {
  const [activeTab, setActiveTab] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [paymentId, setPaymentId] = useState<string>('');

  const handleSimulatePayment = async () => {
    setIsProcessing(true);

    const generatedPayId = `pay_rzp_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    setPaymentId(generatedPayId);

    setTimeout(async () => {
      setIsProcessing(false);
      setIsCompleted(true);

      audioEffects.playPaymentSuccess();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3395ff', '#00e5ff', '#10b981', '#ffffff'],
        });
      } catch {}

      try {
        await fetch('/api/webhooks/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'payment.captured',
            payload: {
              payment: {
                entity: {
                  id: generatedPayId,
                  amount: customer.amount * 100,
                  currency: 'INR',
                  status: 'captured',
                  method: activeTab.toLowerCase(),
                  customer_id: customer.id,
                  email: customer.email,
                  contact: customer.phone,
                },
              },
            },
          }),
        });
      } catch {}

      onPaymentSuccess(customer, {
        paymentId: generatedPayId,
        method: activeTab,
        timestamp: new Date().toISOString(),
      });
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
              <ShieldCheck size={14} style={{ color: '#10b981' }} />
              <span>Razorpay Trusted Business</span>
            </div>
            <div className="checkout-merchant-name">{customer.merchantName}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{customer.planName}</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className="checkout-amount">₹{customer.amount.toLocaleString('en-IN')}</div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                marginTop: '4px',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="checkout-body">
          {isCompleted ? (
            <div style={{ textAlign: 'center', padding: '24px 10px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#ecfdf5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckCircle size={38} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0c2340', marginBottom: '6px' }}>
                Payment Successful!
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '16px' }}>
                ₹{customer.amount} received via {activeTab}. Autopay mandate is re-activated for {customer.merchantName}.
              </p>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '12px',
                  textAlign: 'left',
                  marginBottom: '20px',
                  lineHeight: '1.8',
                }}
              >
                <div><strong>Transaction ID:</strong> <span style={{ fontFamily: 'monospace' }}>{paymentId}</span></div>
                <div><strong>Customer:</strong> {customer.name} ({customer.phone})</div>
                <div><strong>Subscription ID:</strong> {customer.subscriptionId}</div>
                <div><strong>Status:</strong> <span style={{ color: '#10b981', fontWeight: 700 }}>CAPTURED (200 OK)</span></div>
              </div>

              <button
                className="pay-btn-rzp"
                style={{ background: '#10b981' }}
                onClick={onClose}
              >
                Back to Recovery Dashboard
              </button>
            </div>
          ) : (
            <>
              <div className="checkout-method-tabs">
                <div
                  className={`checkout-tab ${activeTab === 'UPI' ? 'active' : ''}`}
                  onClick={() => setActiveTab('UPI')}
                >
                  UPI / QR
                </div>
                <div
                  className={`checkout-tab ${activeTab === 'CARD' ? 'active' : ''}`}
                  onClick={() => setActiveTab('CARD')}
                >
                  Cards
                </div>
                <div
                  className={`checkout-tab ${activeTab === 'NETBANKING' ? 'active' : ''}`}
                  onClick={() => setActiveTab('NETBANKING')}
                >
                  NetBanking
                </div>
              </div>

              {activeTab === 'UPI' && (
                <div>
                  <div className="checkout-upi-box">
                    <div className="qr-placeholder">
                      <QrCode size={100} style={{ color: '#0c2340' }} />
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0c2340' }}>
                      Scan QR with any UPI App
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Google Pay, PhonePe, Paytm, BHIM, CRED
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '18px' }}>
                    <div
                      style={{
                        padding: '10px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: '#0c2340',
                        fontWeight: 600,
                      }}
                    >
                      <Smartphone size={16} style={{ color: '#3395ff' }} />
                      <span>Google Pay</span>
                    </div>
                    <div
                      style={{
                        padding: '10px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: '#0c2340',
                        fontWeight: 600,
                      }}
                    >
                      <Smartphone size={16} style={{ color: '#673ab7' }} />
                      <span>PhonePe</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'CARD' && (
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '14px',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#0c2340' }}>Saved Card</span>
                      <CreditCard size={16} style={{ color: '#3395ff' }} />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '1px' }}>
                      {customer.mandateDetails.bankOrProvider} {customer.mandateDetails.identifier}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Card tokenized as per RBI mandate guidelines.
                  </div>
                </div>
              )}

              {activeTab === 'NETBANKING' && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank) => (
                      <div
                        key={bank}
                        style={{
                          padding: '12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#0c2340',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Building size={14} style={{ color: '#3395ff' }} />
                        <span>{bank}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="pay-btn-rzp"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
              >
                {isProcessing ? (
                  'Authorizing with Bank...'
                ) : (
                  <>
                    Simulate Payment of ₹{customer.amount.toLocaleString('en-IN')}
                    <ArrowRight size={15} style={{ display: 'inline', marginLeft: '6px' }} />
                  </>
                )}
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: '#64748b',
                  marginTop: '12px',
                }}
              >
                <ShieldCheck size={13} style={{ color: '#10b981' }} />
                <span>Secured by Razorpay • PCI-DSS 3.2.1 Level 1 Certified</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
