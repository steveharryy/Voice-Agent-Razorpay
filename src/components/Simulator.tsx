'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CustomerRecord, CallLogItem } from '@/types';
import {
  generateInitialGreeting,
  processCustomerInput,
  AgentResponse,
} from '@/lib/agent';
import { speakText, audioEffects } from '@/lib/audio';
import {
  Mic,
  MicOff,
  PhoneOff,
  Send,
  ExternalLink,
  Volume2,
  VolumeX,
  Radio,
} from 'lucide-react';

interface SimulatorProps {
  customer: CustomerRecord;
  onClose: () => void;
  onCustomerUpdate: (updated: CustomerRecord) => void;
  onOpenCheckout: (customer: CustomerRecord) => void;
}

export default function Simulator({
  customer,
  onClose,
  onCustomerUpdate,
  onOpenCheckout,
}: SimulatorProps) {
  const [callState, setCallState] = useState<'RINGING' | 'CONNECTED' | 'ENDED'>('RINGING');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [transcript, setTranscript] = useState<CallLogItem[]>(customer.callLogs || []);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([
    'Yes, speaking',
    'Why did my payment fail?',
    'Send me the WhatsApp payment link',
    'Can you retry tomorrow?',
  ]);
  const [userTextInput, setUserTextInput] = useState('');
  const [activeAction, setActiveAction] = useState<AgentResponse | null>(null);
  const [hasSpeechRec, setHasSpeechRec] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const cancelSpeechRef = useRef<(() => void) | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasRec = !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
      setHasSpeechRec(hasRec);
    }
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (callState === 'CONNECTED') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState]);

  useEffect(() => {
    audioEffects.getContext();

    const stopRing = audioEffects.playRingtone();

    const connectTimer = setTimeout(() => {
      stopRing();
      audioEffects.playConnectChime();
      setCallState('CONNECTED');

      onCustomerUpdate({
        ...customer,
        status: 'CALLING',
      });

      const greeting = generateInitialGreeting(customer);
      addTranscriptItem('agent', greeting);

      if (!isMuted) {
        cancelSpeechRef.current = speakText(
          greeting,
          () => setIsSpeaking(true),
          () => {
            setIsSpeaking(false);
            startVoiceRecognition();
          }
        );
      }
    }, 900);

    return () => {
      stopRing();
      clearTimeout(connectTimer);
      if (cancelSpeechRef.current) cancelSpeechRef.current();
      stopVoiceRecognition();
    };
  }, []);

  const addTranscriptItem = (sender: 'agent' | 'customer' | 'system', message: string) => {
    const newItem: CallLogItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      sender,
      message,
    };
    setTranscript((prev) => [...prev, newItem]);
  };

  const startVoiceRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setHasSpeechRec(false);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        if (speechResult) {
          handleUserInput(speechResult);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      setIsListening(false);
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleUserInput = (inputText: string) => {
    if (!inputText.trim()) return;

    stopVoiceRecognition();
    if (cancelSpeechRef.current) cancelSpeechRef.current();

    addTranscriptItem('customer', inputText);
    setUserTextInput('');

    const agentRes = processCustomerInput(customer, inputText, transcript);
    setActiveAction(agentRes);

    if (agentRes.nextSuggestedReplies?.length) {
      setSuggestedReplies(agentRes.nextSuggestedReplies);
    }

    if (agentRes.actionTaken === 'SEND_PAYMENT_LINK') {
      const linkUrl = agentRes.actionDetails?.paymentLinkUrl || `https://rzp.io/i/plink_${customer.id}`;
      onCustomerUpdate({
        ...customer,
        status: 'PAYMENT_LINK_SENT',
        paymentLinkUrl: linkUrl,
      });
    } else if (agentRes.actionTaken === 'SCHEDULE_RETRY') {
      onCustomerUpdate({
        ...customer,
        status: 'RETRY_SCHEDULED',
        scheduledRetryDate: agentRes.actionDetails?.retryDate || 'Tomorrow 10:00 AM IST',
      });
    } else if (agentRes.actionTaken === 'ESCALATE_TO_HUMAN') {
      onCustomerUpdate({
        ...customer,
        status: 'ESCALATED',
        recoveryNotes: agentRes.actionDetails?.reason,
      });
    }

    setTimeout(() => {
      addTranscriptItem('agent', agentRes.replyText);

      if (!isMuted) {
        cancelSpeechRef.current = speakText(
          agentRes.replyText,
          () => setIsSpeaking(true),
          () => {
            setIsSpeaking(false);
            if (!agentRes.isCallCompleted) {
              startVoiceRecognition();
            }
          }
        );
      }
    }, 250);
  };

  const handleEndCall = () => {
    audioEffects.playHangupTone();
    if (cancelSpeechRef.current) cancelSpeechRef.current();
    stopVoiceRecognition();
    setCallState('ENDED');

    onCustomerUpdate({
      ...customer,
      callLogs: transcript,
    });

    setTimeout(() => {
      onClose();
    }, 400);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay" onClick={handleEndCall}>
      <div className="call-modal" onClick={(e) => e.stopPropagation()}>
        <div className="call-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: callState === 'CONNECTED' ? '#10B981' : '#F59E0B',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {callState === 'RINGING'
                ? `Calling ${customer.name}...`
                : callState === 'CONNECTED'
                ? 'Call Active • Arya (AI Recovery Specialist)'
                : 'Call Disconnected'}
            </span>

            {callState === 'CONNECTED' && (
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginLeft: '4px' }}>
                {formatTimer(callDuration)}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--status-success-text)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
              <Radio size={11} />
              <span>Strict English</span>
            </span>

            <button
              className="btn btn-secondary btn-sm"
              style={{ padding: '5px 8px' }}
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>

            <button
              className="btn btn-sm"
              style={{ background: '#DC2626', color: '#fff', fontWeight: 600 }}
              onClick={handleEndCall}
              title="Hang up call"
            >
              <PhoneOff size={12} />
              <span>End Call</span>
            </button>
          </div>
        </div>

        <div className="call-stage-box">
          <div style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {customer.name}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {customer.merchantName} ({customer.planName}) • ₹{customer.amount.toLocaleString('en-IN')} Due
          </div>

          <div className="audio-freq-bars">
            {[8, 16, 6, 18, 12, 8, 16, 10, 14, 6, 16, 10].map((h, i) => (
              <div
                key={i}
                className={`freq-bar ${isSpeaking || isListening ? 'active' : ''}`}
                style={{
                  height: isSpeaking ? `${h}px` : isListening ? `${h * 0.6}px` : '4px',
                  animationDelay: `${i * 0.07}s`,
                }}
              />
            ))}
          </div>

          <div
            style={{
              fontSize: '11.5px',
              color: isSpeaking ? 'var(--indigo-primary)' : isListening ? 'var(--status-info-text)' : 'var(--text-secondary)',
              fontWeight: 500,
            }}
          >
            {isSpeaking
              ? 'Arya is speaking in English...'
              : isListening
              ? 'Listening to microphone... (Speak now)'
              : 'Waiting for response — Click any suggested reply below or speak'}
          </div>
        </div>

        {activeAction?.actionTaken === 'SEND_PAYMENT_LINK' && (
          <div
            style={{
              margin: '0 20px 10px',
              background: 'var(--status-success-bg)',
              border: '1px solid var(--status-success-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--status-success-text)' }}>
                ✓ Razorpay 1-Click Payment Link Dispatched
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Sent via WhatsApp/SMS to {customer.phone} for ₹{customer.amount.toLocaleString('en-IN')}
              </div>
            </div>
            <button
              className="btn btn-sm"
              style={{ background: '#10B981', color: '#fff', fontWeight: 600, padding: '7px 12px' }}
              onClick={() => onOpenCheckout(customer)}
              title="Test payment on Razorpay Checkout"
            >
              <ExternalLink size={12} />
              <span>Open Checkout (Pay Now)</span>
            </button>
          </div>
        )}

        <div className="transcript-container">
          {transcript.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px', padding: '14px' }}>
              Connecting with voice network...
            </div>
          ) : (
            transcript.map((item) => (
              <div key={item.id} className="transcript-item">
                <div
                  className={`transcript-speaker ${
                    item.sender === 'agent' ? 'speaker-agent' : 'speaker-customer'
                  }`}
                >
                  <span>{item.sender === 'agent' ? 'Arya (AI)' : 'You (Customer)'}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 400 }}>
                    {item.timestamp}
                  </span>
                </div>
                <div className="transcript-bubble">{item.message}</div>
              </div>
            ))
          )}
          <div ref={transcriptEndRef} />
        </div>

        {callState === 'CONNECTED' && (
          <div className="chips-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.4px' }}>
                Instant Replies (Click to speak):
              </span>
              {!hasSpeechRec && (
                <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                  (Click any reply or type below)
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {suggestedReplies.map((reply, idx) => (
                <button
                  key={idx}
                  className="chip-btn"
                  onClick={() => handleUserInput(reply)}
                >
                  "{reply}"
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="call-modal-footer">
          <button
            className={`btn btn-sm ${isListening ? 'btn-primary' : 'btn-secondary'}`}
            style={{ background: isListening ? '#DC2626' : undefined }}
            onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
            title={isListening ? 'Stop Mic' : 'Start Mic Voice Input'}
          >
            {isListening ? <MicOff size={13} /> : <Mic size={13} />}
            <span>{isListening ? 'Listening...' : 'Mic Speak'}</span>
          </button>

          <form
            style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}
            onSubmit={(e) => {
              e.preventDefault();
              handleUserInput(userTextInput);
            }}
          >
            <input
              type="text"
              className="voice-input-field"
              placeholder="Or type customer reply in English..."
              value={userTextInput}
              onChange={(e) => setUserTextInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={!userTextInput.trim()}>
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
