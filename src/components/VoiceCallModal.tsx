'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CustomerRecord, CallLogItem } from '@/types';
import {
  generateInitialGreeting,
  processCustomerInput,
  AgentResponse,
} from '@/lib/recoveryAgent';
import { speakText, audioEffects } from '@/lib/audioUtils';
import {
  Mic,
  MicOff,
  PhoneOff,
  Send,
  ExternalLink,
  Volume2,
  VolumeX,
  Radio,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';

interface VoiceCallModalProps {
  customer: CustomerRecord;
  onClose: () => void;
  onCustomerUpdate: (updated: CustomerRecord) => void;
  onOpenCheckout: (customer: CustomerRecord) => void;
}

export default function VoiceCallModal({
  customer,
  onClose,
  onCustomerUpdate,
  onOpenCheckout,
}: VoiceCallModalProps) {
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

  const recognitionRef = useRef<any>(null);
  const cancelSpeechRef = useRef<(() => void) | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Call duration counter
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

  // Initial call sequence: Ringing for 1.8s, then connect and Arya speaks first greeting
  useEffect(() => {
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
    }, 1800);

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
    if (!SpeechRecognitionClass) return;

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
    }, 400);
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
    }, 500);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay" onClick={handleEndCall}>
      <div className="call-modal" onClick={(e) => e.stopPropagation()}>
        {/* Softphone Header */}
        <div className="call-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="call-status-pill">
              <div className="call-status-dot" />
              <span>
                {callState === 'RINGING'
                  ? `Dialing ${customer.name}...`
                  : callState === 'CONNECTED'
                  ? 'Connected with Arya'
                  : 'Call Disconnected'}
              </span>
            </div>

            {callState === 'CONNECTED' && (
              <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                {formatTimer(callDuration)}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Radio size={11} />
              <span>HD Audio (EN-US)</span>
            </span>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>

            <button className="btn btn-sm" style={{ background: '#f43f5e', color: '#fff' }} onClick={handleEndCall}>
              <PhoneOff size={13} />
              <span>End Call</span>
            </button>
          </div>
        </div>

        {/* Softphone Stage / Customer Meta */}
        <div className="call-stage-center">
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
            {customer.name}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {customer.merchantName} ({customer.planName}) • ₹{customer.amount.toLocaleString('en-IN')} Due
          </div>

          {/* Minimalist Stereo Audio Frequency Bars */}
          <div className="audio-frequency-meter">
            {[10, 18, 8, 22, 14, 10, 20, 12, 16, 8, 20, 14].map((h, i) => (
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

          <div style={{ fontSize: '11.5px', color: isSpeaking ? 'var(--razorpay-blue)' : isListening ? 'var(--razorpay-cyan)' : 'var(--text-muted)' }}>
            {isSpeaking
              ? 'Arya is speaking in English...'
              : isListening
              ? 'Listening to your microphone... (Speak now)'
              : 'Waiting for response'}
          </div>
        </div>

        {/* Real-time In-Call Action Notice */}
        {activeAction?.actionTaken === 'SEND_PAYMENT_LINK' && (
          <div className="in-call-action-alert">
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>
                ✓ Razorpay Instant Payment Link Dispatched
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Sent via WhatsApp/SMS to {customer.phone}
              </div>
            </div>
            <button
              className="btn btn-sm"
              style={{ background: '#10b981', color: '#fff' }}
              onClick={() => onOpenCheckout(customer)}
            >
              <ExternalLink size={12} />
              <span>Open Checkout</span>
            </button>
          </div>
        )}

        {/* Live Conversation Transcript Feed */}
        <div className="transcript-box">
          {transcript.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', padding: '16px' }}>
              Establishing secure encrypted voice connection...
            </div>
          ) : (
            transcript.map((item) => (
              <div key={item.id} className="transcript-entry">
                <div
                  className={`speaker-badge ${
                    item.sender === 'agent' ? 'speaker-agent' : 'speaker-customer'
                  }`}
                >
                  <span>{item.sender === 'agent' ? 'Arya (Razorpay AI)' : 'You (Customer)'}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400 }}>
                    {item.timestamp}
                  </span>
                </div>
                <div className="transcript-text">{item.message}</div>
              </div>
            ))
          )}
          <div ref={transcriptEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {callState === 'CONNECTED' && (
          <div className="quick-replies-wrap">
            <span className="quick-reply-label">Quick Suggestions (Click to speak):</span>
            <div className="quick-chips-row">
              {suggestedReplies.map((reply, idx) => (
                <button
                  key={idx}
                  className="quick-chip"
                  onClick={() => handleUserInput(reply)}
                >
                  "{reply}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Voice Input Bar */}
        <div className="call-modal-footer">
          <button
            className={`btn btn-sm ${isListening ? 'btn-danger' : 'btn-secondary'}`}
            onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
            title={isListening ? 'Stop Mic' : 'Start Mic Voice Input'}
          >
            {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            <span>{isListening ? 'Listening...' : 'Speak'}</span>
          </button>

          <form
            className="voice-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleUserInput(userTextInput);
            }}
          >
            <input
              type="text"
              className="voice-text-input"
              placeholder="Or type what you want to say to Arya in English..."
              value={userTextInput}
              onChange={(e) => setUserTextInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={!userTextInput.trim()}>
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
