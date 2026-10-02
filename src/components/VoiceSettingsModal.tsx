'use client';

import React, { useState, useEffect } from 'react';
import {
  getAvailableEnglishVoices,
  getSelectedVoice,
  setSelectedVoiceURI,
  speakText,
} from '@/lib/audioUtils';
import { Volume2, Check, Play, X, Sliders, ShieldCheck } from 'lucide-react';

interface VoiceSettingsModalProps {
  onClose: () => void;
}

export default function VoiceSettingsModal({ onClose }: VoiceSettingsModalProps) {
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
      <div className="call-modal" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="call-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} style={{ color: 'var(--brand-blue)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Audio &amp; Voice Configuration</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '8px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <ShieldCheck size={18} style={{ color: '#10b981', flexShrink: 0 }} />
            <div style={{ fontSize: '12.5px', color: '#cbd5e1' }}>
              <strong>Strict English Filter Active:</strong> Regional non-English voices (Bengali, Hindi) have been blocked. Only verified English voices are shown below.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>
              Select Active English Voice ({voices.length} Available)
            </label>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleTestVoice()}
              disabled={isPlayingTest}
            >
              <Play size={13} />
              <span>{isPlayingTest ? 'Speaking...' : 'Test Current Voice'}</span>
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxHeight: '300px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {voices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
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
                      background: isSelected ? 'rgba(51, 149, 255, 0.15)' : 'rgba(12, 23, 44, 0.6)',
                      border: `1px solid ${isSelected ? 'var(--brand-blue)' : 'var(--border-subtle)'}`,
                      borderRadius: '8px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: isSelected ? '#fff' : '#cbd5e1' }}>
                        {v.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Language: {v.lang} {v.default ? '• Default OS Voice' : ''}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestVoice(v.voiceURI);
                        }}
                        title="Hear voice preview"
                      >
                        <Volume2 size={12} />
                      </button>
                      {isSelected && <Check size={16} style={{ color: 'var(--brand-blue)' }} />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
