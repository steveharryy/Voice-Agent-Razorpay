'use client';

import React, { useState, useEffect } from 'react';
import {
  getAvailableEnglishVoices,
  getSelectedVoice,
  setSelectedVoiceURI,
  speakText,
} from '@/lib/audio';
import { INITIAL_CUSTOMERS } from '@/data/customers';
import { buildVapiAssistantConfig } from '@/data/customers';
import { Volume2, Check, Play, X, Sliders, ShieldCheck, Settings as SettingsIcon, Copy } from 'lucide-react';

export interface VoiceSettingsProps {
  onClose: () => void;
}

export function VoiceSettingsModal({ onClose }: VoiceSettingsProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedUri, setSelectedUri] = useState<string>('');
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  useEffect(() => {
    const updateVoices = () => {
      const englishList = getAvailableEnglishVoices();
      setVoices(englishList);
      const current = getSelectedVoice();
      if (current) {
        setSelectedUri(current.voiceURI);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const handleSelect = (uri: string) => {
    setSelectedUri(uri);
    setSelectedVoiceURI(uri);
  };

  const handleTestVoice = (uri?: string) => {
    if (uri) handleSelect(uri);
    setIsPlayingTest(true);

    const testText = "Hello! I am Arya from Razorpay Autopay Support. I will be using this clear English voice for all customer calls.";
    speakText(
      testText,
      () => setIsPlayingTest(true),
      () => setIsPlayingTest(false)
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="call-modal" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div className="call-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={16} style={{ color: 'var(--indigo-primary)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Audio & Voice Settings</h3>
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
              background: 'var(--status-success-bg)',
              border: '1px solid var(--status-success-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <ShieldCheck size={16} style={{ color: 'var(--status-success-text)', flexShrink: 0 }} />
            <div style={{ fontSize: '12px', color: 'var(--status-success-text)', fontWeight: 500 }}>
              <strong>Strict English Filter Active:</strong> Only verified English voices are loaded. Non-English voices (Bengali, Hindi) are completely blocked.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Detected English Voices ({voices.length})
            </label>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleTestVoice()}
              disabled={isPlayingTest}
            >
              <Play size={12} />
              <span>{isPlayingTest ? 'Speaking...' : 'Test Current Voice'}</span>
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              maxHeight: '280px',
              overflowY: 'auto',
              paddingRight: '2px',
            }}
          >
            {voices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                Detecting browser English voices...
              </div>
            ) : (
              voices.map((v) => {
                const isSelected = v.voiceURI === selectedUri;
                return (
                  <div
                    key={v.voiceURI}
                    onClick={() => handleSelect(v.voiceURI)}
                    style={{
                      background: isSelected ? 'var(--indigo-subtle)' : '#FFFFFF',
                      border: `1px solid ${isSelected ? 'var(--indigo-primary)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: isSelected ? 'var(--indigo-primary)' : 'var(--text-primary)' }}>
                        {v.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Language: {v.lang} {v.default ? '• System Default' : ''}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '3px 7px', fontSize: '11px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestVoice(v.voiceURI);
                        }}
                        title="Hear voice preview"
                      >
                        <Volume2 size={12} />
                      </button>
                      {isSelected && <Check size={14} style={{ color: 'var(--indigo-primary)' }} />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ marginTop: '18px', textAlign: 'right' }}>
            <button className="btn btn-primary btn-sm" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface VapiConfigModalProps {
  onClose: () => void;
}

export function VapiConfigModal({ onClose }: VapiConfigModalProps) {
  const [copied, setCopied] = useState(false);
  const sampleCustomer = INITIAL_CUSTOMERS[0];
  const config = buildVapiAssistantConfig(sampleCustomer);
  const jsonString = JSON.stringify(config, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="call-modal"
        style={{ maxWidth: '780px', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="call-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SettingsIcon size={16} style={{ color: 'var(--indigo-primary)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Vapi Assistant Configuration Payload
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Import this JSON directly into <a href="https://dashboard.vapi.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--indigo-primary)', fontWeight: 600 }}>Vapi Dashboard</a> to create the Razorpay Autopay Recovery Assistant.
            </p>
            <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
              {copied ? <Check size={13} style={{ color: 'var(--status-success-text)' }} /> : <Copy size={13} />}
              <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>
          </div>

          <div
            style={{
              background: '#F8F9FB',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              maxHeight: '440px',
              overflowY: 'auto',
            }}
          >
            <pre style={{ color: '#1E293B', fontSize: '11.5px', fontFamily: 'var(--font-mono)', lineHeight: '1.5' }}>
              {jsonString}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceSettingsModal;
