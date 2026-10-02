'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import AgentShowcaseCard from '@/components/AgentShowcaseCard';
import CustomerTable from '@/components/CustomerTable';
import CustomerCard from '@/components/CustomerCard';
import CustomerDrawer from '@/components/CustomerDrawer';
import VoiceAgentsView from '@/components/VoiceAgentsView';
import AnalyticsView from '@/components/AnalyticsView';
import VoiceCallModal from '@/components/VoiceCallModal';
import RazorpayCheckoutModal from '@/components/RazorpayCheckoutModal';
import VapiDialerModal from '@/components/VapiDialerModal';
import ArchitectureModal from '@/components/ArchitectureModal';
import VoiceSettingsModal from '@/components/VoiceSettingsModal';
import { CustomerRecord } from '@/types';
import { INITIAL_CUSTOMERS } from '@/data/mockCustomers';
import { LayoutList, LayoutGrid, Layers, Zap, Server } from 'lucide-react';

export default function Home() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'QUEUE' | 'AGENTS' | 'ANALYTICS' | 'ARCHITECTURE'>('QUEUE');
  const [viewMode, setViewMode] = useState<'TABLE' | 'GRID'>('TABLE');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Inspection Drawer
  const [inspectedCustomer, setInspectedCustomer] = useState<CustomerRecord | null>(null);

  // Modals
  const [activeVoiceCallCustomer, setActiveVoiceCallCustomer] = useState<CustomerRecord | null>(null);
  const [activeCheckoutCustomer, setActiveCheckoutCustomer] = useState<CustomerRecord | null>(null);
  const [activeVapiCustomer, setActiveVapiCustomer] = useState<CustomerRecord | null>(null);
  const [isVapiDialerOpen, setIsVapiDialerOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);

  // Fetch initial customer state from API if available
  useEffect(() => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCustomers(data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Update a single customer record
  const updateCustomer = async (updated: CustomerRecord) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );

    if (inspectedCustomer?.id === updated.id) {
      setInspectedCustomer(updated);
    }

    try {
      await fetch('/api/customers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: updated.id, updates: updated }),
      });
    } catch {}
  };

  // Quick send payment link
  const handleQuickSendLink = (customer: CustomerRecord) => {
    const linkId = `plink_${Math.random().toString(36).substring(2, 9)}`;
    const updated: CustomerRecord = {
      ...customer,
      status: 'PAYMENT_LINK_SENT',
      paymentLinkUrl: `https://rzp.io/i/${linkId}`,
      recoveryNotes: `Payment link dispatched via WhatsApp to ${customer.phone}`,
    };
    updateCustomer(updated);
  };

  // Payment completed callback from Razorpay Checkout Modal
  const handlePaymentSuccess = (customer: CustomerRecord, paymentDetails: any) => {
    const updated: CustomerRecord = {
      ...customer,
      status: 'RECOVERED',
      recoveredAt: new Date().toLocaleTimeString(),
      paymentMethodRecovered: paymentDetails.method,
      recoveryNotes: `Payment of ₹${customer.amount} captured. Payment ID: ${paymentDetails.paymentId}`,
    };
    updateCustomer(updated);
  };

  // Reset demo data to fresh initial state
  const handleResetData = async () => {
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESET' }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCustomers(data.data);
        setInspectedCustomer(null);
      }
    } catch {
      setCustomers(JSON.parse(JSON.stringify(INITIAL_CUSTOMERS)));
      setInspectedCustomer(null);
    }
  };

  // Filter customers by search and status
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.failureReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subscriptionId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'FAILED'
        ? c.status === 'FAILED' || c.status === 'CALLING'
        : c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-layout">
      {/* CallAI Responsive Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenVoiceSettings={() => setIsVoiceSettingsOpen(true)}
        onOpenDialer={() => {
          setActiveVapiCustomer(customers[0]);
          setIsVapiDialerOpen(true);
        }}
        onResetData={handleResetData}
        customerCount={customers.length}
      />

      {/* Main Viewport */}
      <div className="main-viewport">
        {/* Top Header Bar */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenDialer={() => {
            setActiveVapiCustomer(customers[0]);
            setIsVapiDialerOpen(true);
          }}
          onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
          onOpenVoiceSettings={() => setIsVoiceSettingsOpen(true)}
          onResetData={handleResetData}
        />

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {activeTab === 'QUEUE' && (
            <>
              {/* Hero Voice Agent Showcase Card */}
              <AgentShowcaseCard
                sampleCustomer={customers[0]}
                onStartVoiceCall={(c) => setActiveVoiceCallCustomer(c)}
                onOpenVoiceSettings={() => setIsVoiceSettingsOpen(true)}
              />

              {/* CallAI Metric KPI Cards Grid */}
              <StatsCards customers={customers} />

              {/* Filter Toolbar */}
              <div className="toolbar-wrap">
                <div className="filter-group">
                  <button
                    className={`filter-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('ALL')}
                  >
                    All Mandates ({customers.length})
                  </button>
                  <button
                    className={`filter-btn ${statusFilter === 'FAILED' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('FAILED')}
                  >
                    Pending Failure ({customers.filter((c) => c.status === 'FAILED' || c.status === 'CALLING').length})
                  </button>
                  <button
                    className={`filter-btn ${statusFilter === 'PAYMENT_LINK_SENT' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('PAYMENT_LINK_SENT')}
                  >
                    Links Dispatched ({customers.filter((c) => c.status === 'PAYMENT_LINK_SENT').length})
                  </button>
                  <button
                    className={`filter-btn ${statusFilter === 'RETRY_SCHEDULED' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('RETRY_SCHEDULED')}
                  >
                    Retries Set ({customers.filter((c) => c.status === 'RETRY_SCHEDULED').length})
                  </button>
                  <button
                    className={`filter-btn ${statusFilter === 'RECOVERED' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('RECOVERED')}
                  >
                    Recovered ({customers.filter((c) => c.status === 'RECOVERED').length})
                  </button>
                </div>

                <div className="view-toggle-wrap">
                  <button
                    className={`view-btn ${viewMode === 'TABLE' ? 'active' : ''}`}
                    onClick={() => setViewMode('TABLE')}
                    title="Table View (Fintech Density)"
                  >
                    <LayoutList size={15} />
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'GRID' ? 'active' : ''}`}
                    onClick={() => setViewMode('GRID')}
                    title="Grid View"
                  >
                    <LayoutGrid size={15} />
                  </button>
                </div>
              </div>

              {/* Operations Table or Card Grid */}
              {viewMode === 'TABLE' ? (
                <CustomerTable
                  customers={filteredCustomers}
                  selectedCustomerId={inspectedCustomer?.id}
                  onSelectCustomer={(c) => setInspectedCustomer(c)}
                  onStartVoiceCall={(c) => setActiveVoiceCallCustomer(c)}
                  onOpenCheckout={(c) => setActiveCheckoutCustomer(c)}
                  onQuickSendLink={handleQuickSendLink}
                />
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {filteredCustomers.map((cust) => (
                    <CustomerCard
                      key={cust.id}
                      customer={cust}
                      onStartVoiceCall={(c) => setActiveVoiceCallCustomer(c)}
                      onCallViaVapi={(c) => {
                        setActiveVapiCustomer(c);
                        setIsVapiDialerOpen(true);
                      }}
                      onOpenCheckout={(c) => setActiveCheckoutCustomer(c)}
                      onQuickSendLink={handleQuickSendLink}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'AGENTS' && (
            <VoiceAgentsView
              sampleCustomer={customers[0]}
              onStartVoiceCall={(c) => setActiveVoiceCallCustomer(c)}
              onOpenVoiceSettings={() => setIsVoiceSettingsOpen(true)}
            />
          )}

          {activeTab === 'ANALYTICS' && (
            <AnalyticsView customers={customers} />
          )}

          {activeTab === 'ARCHITECTURE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Razorpay Forward Deployed Engineer (FDE) Blueprint
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    End-to-end event-driven architecture, NPCI e-Mandate webhook pipelines, and voice latency optimization.
                  </p>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsArchitectureModalOpen(true)}
                >
                  <Layers size={13} />
                  <span>Open Full Blueprint Modal</span>
                </button>
              </div>

              <div className="blueprint-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Server size={16} style={{ color: 'var(--indigo-primary)' }} />
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    End-to-End Event Flow Architecture
                  </h3>
                </div>
                <div
                  style={{
                    background: '#F8F9FB',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11.5px',
                    color: '#1E293B',
                    overflowX: 'auto',
                    lineHeight: '1.5',
                    whiteSpace: 'pre',
                  }}
                >
{`
+---------------------------------------------------------------------------------------------------+
|                                 RAZORPAY RECURRING BILLING ENGINE                                 |
+---------------------------------------------------------------------------------------------------+
                                                  |
                  (1) Failed Debit Event: 'payment.failed' / 'subscription.pending'
                                                  v
+---------------------------------------------------------------------------------------------------+
|                              CALLAI EVENT INGESTION & DISPATCHER                                  |
|   - Razorpay Webhook Ingestion (/api/webhooks/razorpay)                                           |
|   - Failure Reason Categorization (Insufficient Balance, Mandate Expired, Bank Timeout)           |
|   - RBI Pre-Debit Rule Validation & Smart Scheduling Window (09:00 - 20:00 IST)                   |
+---------------------------------------------------------------------------------------------------+
                                                  |
                     (2) Dispatches Contextual Outbound Recovery Session
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                   VOICE AGENT ORCHESTRATION                                       |
|  Engine A: Telephony Engine (Vapi.ai REST API -> PSTN/SIP Trunk -> Customer Phone)               |
|  Engine B: Interactive Web Voice Agent (WebRTC / Web Speech API -> Browser Mic/Speaker)           |
|  - ASR: Deepgram Nova-2 (Optimized for Indian English & Strict English)                          |
|  - LLM: GPT-4o-mini with Razorpay Autopay Recovery Playbook & Security Guardrails                |
|  - TTS: Natural Conversational Voice (ElevenLabs Aria / Strict EN-US Web Speech)                 |
+---------------------------------------------------------------------------------------------------+
                                                  |
                     (3) In-Call Real-Time Tool Calling & Remediation
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                 RAZORPAY RECOVERY TOOL ACTIONS                                    |
|   [Tool 1: send_payment_link]      -> Generates 1-Click Razorpay Payment Link (WhatsApp/SMS)      |
|   [Tool 2: schedule_retry]         -> Registers Next Auto-Debit in Razorpay Subscriptions Queue    |
|   [Tool 3: update_payment_mandate] -> Dispatches 1-Click Mandate Re-registration Flow             |
|   [Tool 4: escalate_to_human]      -> Pauses Debits & Flags Ticket for High-Touch RM              |
+---------------------------------------------------------------------------------------------------+
                                                  |
                     (4) Customer Pays Link / Retries Mandate
                                                  v
+---------------------------------------------------------------------------------------------------+
|                              SETTLEMENT, WEBSOCKET & RECONCILIATION                               |
|   - Webhook: 'payment.captured' -> Updates Status to RECOVERED                                    |
|   - Real-time Analytics: Salvaged ARR, Churn Prevented, First-Call Resolution (FCR) Rate          |
+---------------------------------------------------------------------------------------------------+
`}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Inspection Drawer */}
      {inspectedCustomer && (
        <CustomerDrawer
          customer={inspectedCustomer}
          onClose={() => setInspectedCustomer(null)}
          onStartVoiceCall={(c) => setActiveVoiceCallCustomer(c)}
          onOpenCheckout={(c) => setActiveCheckoutCustomer(c)}
          onQuickSendLink={handleQuickSendLink}
        />
      )}

      {/* Interactive Softphone Voice Call Modal */}
      {activeVoiceCallCustomer && (
        <VoiceCallModal
          customer={activeVoiceCallCustomer}
          onClose={() => setActiveVoiceCallCustomer(null)}
          onCustomerUpdate={(updated) => {
            updateCustomer(updated);
            setActiveVoiceCallCustomer(updated);
          }}
          onOpenCheckout={(cust) => {
            setActiveVoiceCallCustomer(null);
            setActiveCheckoutCustomer(cust);
          }}
        />
      )}

      {/* Voice Configuration & Test Modal */}
      {isVoiceSettingsOpen && (
        <VoiceSettingsModal onClose={() => setIsVoiceSettingsOpen(false)} />
      )}

      {/* Simulated Razorpay Checkout Modal */}
      {activeCheckoutCustomer && (
        <RazorpayCheckoutModal
          customer={activeCheckoutCustomer}
          onClose={() => setActiveCheckoutCustomer(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Vapi Outbound Phone Caller Modal */}
      {isVapiDialerOpen && (
        <VapiDialerModal
          customers={customers}
          selectedCustomer={activeVapiCustomer}
          onClose={() => setIsVapiDialerOpen(false)}
          onCallTriggered={(res) => {
            if (activeVapiCustomer) {
              updateCustomer({
                ...activeVapiCustomer,
                status: 'CALLING',
                vapiCallId: res.callId,
              });
            }
          }}
        />
      )}

      {/* Architecture & FDE System Design Blueprint Modal */}
      {isArchitectureModalOpen && (
        <ArchitectureModal onClose={() => setIsArchitectureModalOpen(false)} />
      )}
    </div>
  );
}
