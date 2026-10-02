'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import CustomerTable from '@/components/CustomerTable';
import CustomerCard from '@/components/CustomerCard';
import CustomerDrawer from '@/components/CustomerDrawer';
import AnalyticsView from '@/components/AnalyticsView';
import VoiceCallModal from '@/components/VoiceCallModal';
import RazorpayCheckoutModal from '@/components/RazorpayCheckoutModal';
import VapiDialerModal from '@/components/VapiDialerModal';
import ArchitectureModal from '@/components/ArchitectureModal';
import VoiceSettingsModal from '@/components/VoiceSettingsModal';
import { CustomerRecord } from '@/types';
import { INITIAL_CUSTOMERS } from '@/data/mockCustomers';
import { Search, Filter, LayoutList, LayoutGrid, BarChart2, ShieldCheck, Activity } from 'lucide-react';

export default function Home() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'QUEUE' | 'ANALYTICS' | 'AUDIT'>('QUEUE');
  const [viewMode, setViewMode] = useState<'TABLE' | 'GRID'>('TABLE');

  // Inspection Drawer
  const [inspectedCustomer, setInspectedCustomer] = useState<CustomerRecord | null>(null);

  // Modals
  const [activeVoiceCallCustomer, setActiveVoiceCallCustomer] = useState<CustomerRecord | null>(null);
  const [activeCheckoutCustomer, setActiveCheckoutCustomer] = useState<CustomerRecord | null>(null);
  const [activeVapiCustomer, setActiveVapiCustomer] = useState<CustomerRecord | null>(null);
  const [isVapiDialerOpen, setIsVapiDialerOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
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
    <main className="app-shell">
      {/* Top Application Chrome */}
      <Header
        onOpenDialer={() => {
          setActiveVapiCustomer(customers[0]);
          setIsVapiDialerOpen(true);
        }}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenVoiceSettings={() => setIsVoiceSettingsOpen(true)}
        onResetData={handleResetData}
      />

      {/* KPI Performance Metrics Strip */}
      <StatsCards customers={customers} />

      {/* Workspace Tabs */}
      <div className="workspace-header">
        <div className="workspace-tabs">
          <button
            className={`tab-btn ${activeTab === 'QUEUE' ? 'active' : ''}`}
            onClick={() => setActiveTab('QUEUE')}
          >
            <span>Recovery Action Queue</span>
            <span className="tab-count-badge">{customers.length}</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'ANALYTICS' ? 'active' : ''}`}
            onClick={() => setActiveTab('ANALYTICS')}
          >
            <BarChart2 size={14} />
            <span>Recovery Analytics &amp; Churn</span>
          </button>
        </div>

        {/* View mode toggle (Table vs Grid) only in Queue */}
        {activeTab === 'QUEUE' && (
          <div className="view-mode-toggle">
            <button
              className={`view-mode-btn ${viewMode === 'TABLE' ? 'active' : ''}`}
              onClick={() => setViewMode('TABLE')}
              title="Table View (Fintech Density)"
            >
              <LayoutList size={15} />
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'GRID' ? 'active' : ''}`}
              onClick={() => setViewMode('GRID')}
              title="Card Grid View"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        )}
      </div>

      {activeTab === 'QUEUE' ? (
        <>
          {/* Filter & Search Toolbar */}
          <div className="toolbar-row">
            <div className="search-wrap">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search customers, subscription IDs, failure codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-pills">
              <button
                className={`filter-pill-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setStatusFilter('ALL')}
              >
                All Mandates ({customers.length})
              </button>
              <button
                className={`filter-pill-btn ${statusFilter === 'FAILED' ? 'active' : ''}`}
                onClick={() => setStatusFilter('FAILED')}
              >
                Pending Failure ({customers.filter((c) => c.status === 'FAILED' || c.status === 'CALLING').length})
              </button>
              <button
                className={`filter-pill-btn ${statusFilter === 'PAYMENT_LINK_SENT' ? 'active' : ''}`}
                onClick={() => setStatusFilter('PAYMENT_LINK_SENT')}
              >
                Links Dispatched ({customers.filter((c) => c.status === 'PAYMENT_LINK_SENT').length})
              </button>
              <button
                className={`filter-pill-btn ${statusFilter === 'RETRY_SCHEDULED' ? 'active' : ''}`}
                onClick={() => setStatusFilter('RETRY_SCHEDULED')}
              >
                Retries Set ({customers.filter((c) => c.status === 'RETRY_SCHEDULED').length})
              </button>
              <button
                className={`filter-pill-btn ${statusFilter === 'RECOVERED' ? 'active' : ''}`}
                onClick={() => setStatusFilter('RECOVERED')}
              >
                Recovered ({customers.filter((c) => c.status === 'RECOVERED').length})
              </button>
            </div>
          </div>

          {/* Table View or Grid View */}
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
      ) : (
        <AnalyticsView customers={customers} />
      )}

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

      {/* Interactive Softphone Voice Call Modal (Strictly English Voice) */}
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
      {isArchitectureOpen && (
        <ArchitectureModal onClose={() => setIsArchitectureOpen(false)} />
      )}
    </main>
  );
}
