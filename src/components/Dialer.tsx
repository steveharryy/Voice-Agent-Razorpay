'use client';

import React, { useState, useEffect } from 'react';
import { CustomerRecord } from '@/types';
import { PhoneCall, ShieldAlert, CheckCircle2, Key, X } from 'lucide-react';

interface DialerProps {
  customers: CustomerRecord[];
  selectedCustomer: CustomerRecord | null;
  onClose: () => void;
  onCallTriggered?: (res: any) => void;
}

export default function Dialer({
  customers,
  selectedCustomer,
  onClose,
  onCallTriggered,
}: DialerProps) {
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
      <div className="call-modal" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
        <div className="call-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneCall size={16} style={{ color: 'var(--indigo-primary)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Vapi Outbound Telephony Engine
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px' }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          <div
            style={{
              background: 'var(--status-warning-bg)',
              border: '1px solid var(--status-warning-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '18px',
            }}
          >
            <ShieldAlert size={16} style={{ color: 'var(--status-warning-text)', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: 'var(--status-warning-text)', lineHeight: '1.45' }}>
              <strong>Compliance Notice:</strong> As instructed in the Razorpay assignment, enter ONLY a phone number you personally control or have explicit verified permission to call.
            </div>
          </div>

          <form onSubmit={handleDial} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Your Destination Phone Number (E.164 Format)
              </label>
              <input
                type="tel"
                placeholder="+919876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="voice-input-field"
                style={{ width: '100%', padding: '10px 12px', fontSize: '13.5px' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
                Example: +91 for India followed by your 10-digit number.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Select Customer Scenario for Call Context
              </label>
              <select
                value={chosenCustomerId}
                onChange={(e) => setChosenCustomerId(e.target.value)}
                className="voice-input-field"
                style={{ width: '100%', padding: '10px 12px', fontSize: '13px' }}
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.merchantName} ({c.planName}) • ₹{c.amount} ({c.failureReason.replace(/_/g, ' ')})
                  </option>
                ))}
              </select>
            </div>

            {selectedCust && (
              <div
                style={{
                  background: 'var(--indigo-subtle)',
                  border: '1px solid var(--indigo-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  fontSize: '12px',
                  color: 'var(--indigo-primary)',
                  lineHeight: '1.45',
                }}
              >
                <strong>Arya's Opening Line:</strong> "Hello {selectedCust.name}! This is Arya calling from Razorpay on behalf of {selectedCust.merchantName} regarding your ₹{selectedCust.amount} recurring charge..."
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={() => setShowKeyConfig(!showKeyConfig)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--indigo-primary)',
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
                  background: '#F8F9FB',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 500 }}>
                    VAPI_API_KEY (from dashboard.vapi.ai)
                  </label>
                  <input
                    type="password"
                    placeholder="e.g. 5d89f2a4-xxxx-xxxx"
                    value={vapiApiKey}
                    onChange={(e) => setVapiApiKey(e.target.value)}
                    className="voice-input-field"
                    style={{ width: '100%', padding: '8px 10px', fontSize: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 500 }}>
                    VAPI_PHONE_NUMBER_ID (Purchased or imported in Vapi)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3cb89a1-xxxx-xxxx"
                    value={vapiPhoneId}
                    onChange={(e) => setVapiPhoneId(e.target.value)}
                    className="voice-input-field"
                    style={{ width: '100%', padding: '8px 10px', fontSize: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 500 }}>
                    VAPI_ASSISTANT_ID (Optional: if blank, inline configuration is used)
                  </label>
                  <input
                    type="text"
                    placeholder="Optional assistant ID"
                    value={vapiAssistantId}
                    onChange={(e) => setVapiAssistantId(e.target.value)}
                    className="voice-input-field"
                    style={{ width: '100%', padding: '8px 10px', fontSize: '12px' }}
                  />
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Tip: You can also specify these in your <code style={{ color: 'var(--indigo-primary)', background: '#EEF2F6', padding: '1px 4px', borderRadius: '3px' }}>.env.local</code> file!
                </div>
              </div>
            )}

            {errorMsg && (
              <div
                style={{
                  background: 'var(--status-danger-bg)',
                  border: '1px solid var(--status-danger-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  color: 'var(--status-danger-text)',
                  fontSize: '12.5px',
                }}
              >
                {errorMsg}
              </div>
            )}

            {callResponse && (
              <div
                style={{
                  background: 'var(--status-success-bg)',
                  border: '1px solid var(--status-success-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-success-text)', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                  <CheckCircle2 size={16} />
                  <span>Call Dispatch Request Accepted!</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                  {callResponse.message}
                </div>
                {callResponse.callId && (
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                    Call ID: {callResponse.callId} • Status: {callResponse.status}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', justifyContent: 'center', padding: '11px', marginTop: '4px' }}
            >
              {isLoading ? (
                'Connecting to Vapi Telephony...'
              ) : (
                <>
                  <PhoneCall size={15} />
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
