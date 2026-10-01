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
  Sparkles,
  ExternalLink,
  Volume2,
  VolumeX,
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

  // Initial call sequence: Ringing for 1.8s, then connect and Arya speaks first greeting
  useEffect(() => {
    const stopRing = audioEffects.playRingtone();

    const connectTimer = setTimeout(() => {
      stopRing();
      audioEffects.playConnectChime();
      setCallState('CONNECTED');

      // Update customer status to CALLING
      onCustomerUpdate({
        ...customer,
        status: 'CALLING',
      });

      // Arya speaks initial greeting
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
    }, 2000);

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

  // Handle Speech Recognition for live microphone talking
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
      recognition.lang = 'en-IN';

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

  // Core turn handler: process customer speech/text and generate Arya's response
  const handleUserInput = (inputText: string) => {
    if (!inputText.trim()) return;

    // Stop listening while agent processes
    stopVoiceRecognition();
    if (cancelSpeechRef.current) cancelSpeechRef.current();

    addTranscriptItem('customer', inputText);
    setUserTextInput('');

    // Generate intelligent recovery response
    const agentRes = processCustomerInput(customer, inputText, transcript);
    setActiveAction(agentRes);

    if (agentRes.nextSuggestedReplies?.length) {
      setSuggestedReplies(agentRes.nextSuggestedReplies);
    }

    // Apply any tool actions triggered by Arya
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

    // Speak agent reply
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

    // Save final call logs to customer record
    onCustomerUpdate({
      ...customer,
      callLogs: transcript,
    });

    setTimeout(() => {
      onClose();
    }, 600);
  };

  const toggleMute = () => {
    if (!isMuted) {
      if (cancelSpeechRef.current) cancelSpeechRef.current();
      setIsSpeaking(false);
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleEndCall}>
      <div className="call-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="call-modal-header">
          <div className="call-status-pill">
            <div className="call-status-dot" />
            <span>
              {callState === 'RINGING'
                ? `Calling ${customer.name}...`
                : callState === 'CONNECTED'
                ? 'Call Active • Arya (Razorpay Autopay AI)'
                : 'Call Ended'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleEndCall}>
              <PhoneOff size={14} />
              <span>End Call</span>
            </button>
          </div>
        </div>

        {/* Visualizer / Stage */}
        <div className="call-stage-center">
          <div className="voice-orb-wrapper">
            <div className={`voice-orb ${isSpeaking ? 'speaking' : ''}`}>
              <Sparkles size={36} />
            </div>
            {isSpeaking && (
              <>
                <div className="pulse-wave" />
                <div className="pulse-wave" />
              </>
            )}
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '2px' }}>
            {customer.name}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {customer.merchantName} ({customer.planName}) • ₹{customer.amount.toLocaleString('en-IN')} Overdue
          </p>

          <div className="audio-waves-bar">
            {[14, 22, 10, 26, 18, 12, 24, 16, 20, 10, 24, 18].map((h, i) => (
              <div
                key={i}
                className={`wave-bar ${isSpeaking || isListening ? 'active' : ''}`}
                style={{
                  height: isSpeaking ? `${h}px` : isListening ? `${h * 0.7}px` : '5px',
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>

          <div style={{ fontSize: '12px', color: isSpeaking ? 'var(--neon-cyan)' : isListening ? '#38bdf8' : 'var(--text-muted)' }}>
            {isSpeaking
              ? 'Arya is speaking...'
              : isListening
              ? 'Listening to your microphone... (Speak now)'
              : 'Waiting for your response'}
          </div>
        </div>

        {/* In-Call Action Notification */}
        {activeAction?.actionTaken === 'SEND_PAYMENT_LINK' && (
          <div className="in-call-action-alert">
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#10b981' }}>
                ✓ Razorpay Instant Payment Link Dispatched
              </div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                Sent via WhatsApp/SMS to {customer.phone} for ₹{customer.amount}
              </div>
            </div>
            <button
              className="btn btn-sm"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
              }}
              onClick={() => onOpenCheckout(customer)}
            >
              <ExternalLink size={13} />
              <span>Open &amp; Pay Link</span>
            </button>
          </div>
        )}

        {/* Live Transcript Stream */}
        <div className="transcript-box">
          {transcript.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', padding: '20px' }}>
              Connecting with voice network...
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
            <span className="quick-reply-label">Quick Voice Responses (Click to say):</span>
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

        {/* Input & Microphone Bar */}
        <div className="call-modal-footer">
          <button
            className={`btn btn-sm ${isListening ? 'btn-danger' : 'btn-secondary'}`}
            onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
            title={isListening ? 'Stop Mic' : 'Start Mic Voice Input'}
          >
            {isListening ? <MicOff size={15} /> : <Mic size={15} />}
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
              placeholder="Or type what you want to say to Arya..."
              value={userTextInput}
              onChange={(e) => setUserTextInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={!userTextInput.trim()}>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
