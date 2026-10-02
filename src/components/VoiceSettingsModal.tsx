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
      <div className="call-modal" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div className="call-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={16} style={{ color: 'var(--indigo-primary)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Audio &amp; Voice Settings</h3>
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
