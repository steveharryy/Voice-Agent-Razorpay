'use client';

import React, { useState, useEffect } from 'react';
import { CustomerRecord } from '@/types';
import { PhoneCall, ShieldAlert, CheckCircle2, Key, HelpCircle, X, ExternalLink } from 'lucide-react';

interface VapiDialerModalProps {
  customers: CustomerRecord[];
  selectedCustomer: CustomerRecord | null;
  onClose: () => void;
  onCallTriggered?: (res: any) => void;
}

export default function VapiDialerModal({
  customers,
  selectedCustomer,
  onClose,
  onCallTriggered,
}: VapiDialerModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [chosenCustomerId, setChosenCustomerId] = useState(
    selectedCustomer?.id || customers[0]?.id || 'cust_001'
  );
  const [vapiApiKey, setVapiApiKey] = useState('');
  const [vapiPhoneId, setVapiPhoneId] = useState('');
  const [vapiAssistantId, setVapiAssistantId] = useState('');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [callResponse, setCallResponse] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load saved phone number or keys from localStorage
  useEffect(() => {
    const savedPhone = localStorage.getItem('rzp_test_phone');
    if (savedPhone) setPhoneNumber(savedPhone);

    const savedKey = localStorage.getItem('rzp_vapi_key');
    if (savedKey) setVapiApiKey(savedKey);

    const savedPhoneId = localStorage.getItem('rzp_vapi_phone_id');
    if (savedPhoneId) setVapiPhoneId(savedPhoneId);

    const savedAssistantId = localStorage.getItem('rzp_vapi_assistant_id');
    if (savedAssistantId) setVapiAssistantId(savedAssistantId);
  }, []);

  const handleDial = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setCallResponse(null);

    if (!phoneNumber.trim()) {
      setErrorMsg('Please enter a valid phone number (e.g. +919876543210)');
      return;
    }

    // Persist for convenience
    localStorage.setItem('rzp_test_phone', phoneNumber);
    if (vapiApiKey) localStorage.setItem('rzp_vapi_key', vapiApiKey);
    if (vapiPhoneId) localStorage.setItem('rzp_vapi_phone_id', vapiPhoneId);
    if (vapiAssistantId) localStorage.setItem('rzp_vapi_assistant_id', vapiAssistantId);

    setIsLoading(true);

    try {
      const res = await fetch('/api/vapi/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: chosenCustomerId,
          phoneNumber: phoneNumber.trim(),
          vapiApiKey: vapiApiKey.trim() || undefined,
          vapiPhoneNumberId: vapiPhoneId.trim() || undefined,
          vapiAssistantId: vapiAssistantId.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to place call');
      } else {
        setCallResponse(data);
        onCallTriggered?.(data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCust = customers.find((c) => c.id === chosenCustomerId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="call-modal" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="call-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneCall size={18} style={{ color: 'var(--brand-blue)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Vapi Outbound Telephony Engine</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Important Permission Banner as required by assignment */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '8px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <ShieldAlert size={18} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: '#fcd34d', lineHeight: '1.4' }}>
              <strong>Compliance Notice:</strong> As instructed in the Razorpay assignment, enter ONLY a phone number you personally control or have explicit verified permission to call.
            </div>
          </div>

          <form onSubmit={handleDial} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Phone Number Input */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
                Your Destination Phone Number (E.164 Format)
              </label>
              <input
                type="tel"
                placeholder="+919876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(12, 23, 44, 0.8)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  padding: '11px 14px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                Example: +91 for India followed by 10-digit number.
              </span>
            </div>

            {/* Select Customer Scenario */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
                Select Customer Scenario for Call Context
              </label>
              <select
                value={chosenCustomerId}
                onChange={(e) => setChosenCustomerId(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(12, 23, 44, 0.8)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  padding: '11px 14px',
                  color: '#fff',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.merchantName} ({c.planName}) • ₹{c.amount} ({c.failureReason})
                  </option>
                ))}
              </select>
            </div>

            {/* Customer preview pill */}
            {selectedCust && (
              <div
                style={{
                  background: 'rgba(51, 149, 255, 0.08)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '12px',
                  color: '#93c5fd',
                }}
              >
                <strong>Arya's Opening Line:</strong> "Hello {selectedCust.name}! This is Arya calling from Razorpay on behalf of {selectedCust.merchantName} regarding your ₹{selectedCust.amount} recurring charge..."
              </div>
            )}

            {/* Vapi API credentials toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowKeyConfig(!showKeyConfig)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--brand-blue)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: 0,
                }}
              >
                <Key size={13} />
                <span>{showKeyConfig ? 'Hide Vapi API Settings' : 'Configure Custom Vapi API Key & Phone ID'}</span>
              </button>
            </div>

            {showKeyConfig && (
              <div
                style={{
                  background: 'rgba(8, 15, 30, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                    VAPI_API_KEY (from dashboard.vapi.ai)
                  </label>
                  <input
                    type="password"
                    placeholder="e.g. 5d89f2a4-xxxx-xxxx"
                    value={vapiApiKey}
                    onChange={(e) => setVapiApiKey(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(12, 23, 44, 0.9)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: '12.5px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                    VAPI_PHONE_NUMBER_ID (Purchased or imported in Vapi)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3cb89a1-xxxx-xxxx"
                    value={vapiPhoneId}
                    onChange={(e) => setVapiPhoneId(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(12, 23, 44, 0.9)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: '12.5px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                    VAPI_ASSISTANT_ID (Optional: if blank, inline assistant configuration is used)
                  </label>
                  <input
                    type="text"
                    placeholder="Optional assistant ID"
                    value={vapiAssistantId}
                    onChange={(e) => setVapiAssistantId(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(12, 23, 44, 0.9)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: '12.5px',
                    }}
                  />
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Tip: You can also specify these in your <code style={{ color: '#38bdf8' }}>.env.local</code> file!
                </div>
              </div>
            )}

            {errorMsg && (
              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  color: '#fda4af',
                  fontSize: '12.5px',
                }}
              >
                {errorMsg}
              </div>
            )}

            {callResponse && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6ee7b7', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                  <CheckCircle2 size={16} />
                  <span>Call Dispatch Request Accepted!</span>
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                  {callResponse.message}
                </div>
                {callResponse.callId && (
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', fontFamily: 'monospace' }}>
                    Call ID: {callResponse.callId} • Status: {callResponse.status}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '4px' }}
            >
              {isLoading ? (
                'Connecting to Vapi Telephony...'
              ) : (
                <>
                  <PhoneCall size={16} />
                  <span>Initiate Outbound Call</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
