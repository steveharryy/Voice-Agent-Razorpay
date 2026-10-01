'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import CustomerCard from '@/components/CustomerCard';
import VoiceCallModal from '@/components/VoiceCallModal';
import RazorpayCheckoutModal from '@/components/RazorpayCheckoutModal';
import VapiDialerModal from '@/components/VapiDialerModal';
import ArchitectureModal from '@/components/ArchitectureModal';
import VapiConfigModal from '@/components/VapiConfigModal';
import { CustomerRecord } from '@/types';
import { INITIAL_CUSTOMERS } from '@/data/mockCustomers';
import { Search, Filter, ShieldCheck, Zap, Info } from 'lucide-react';

export default function Home() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [mandateFilter, setMandateFilter] = useState<string>('ALL');

  // Modals
  const [activeVoiceCallCustomer, setActiveVoiceCallCustomer] = useState<CustomerRecord | null>(null);
  const [activeCheckoutCustomer, setActiveCheckoutCustomer] = useState<CustomerRecord | null>(null);
  const [activeVapiCustomer, setActiveVapiCustomer] = useState<CustomerRecord | null>(null);
  const [isVapiDialerOpen, setIsVapiDialerOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isVapiConfigOpen, setIsVapiConfigOpen] = useState(false);

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

    // Sync with backend API
    try {
      await fetch('/api/customers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: updated.id, updates: updated }),
      });
    } catch {}
  };

  // Quick send payment link directly from card
  const handleQuickSendLink = (customer: CustomerRecord) => {
    const linkId = `plink_${Math.random().toString(36).substring(2, 9)}`;
    const updated: CustomerRecord = {
      ...customer,
      status: 'PAYMENT_LINK_SENT',
      paymentLinkUrl: `https://rzp.io/i/${linkId}`,
      recoveryNotes: `Payment link dispatched via WhatsApp/SMS to ${customer.phone}`,
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
      }
    } catch {
      setCustomers(JSON.parse(JSON.stringify(INITIAL_CUSTOMERS)));
    }
  };

  // Filter customers by search, status, and mandate type
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.failureReason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'FAILED'
        ? c.status === 'FAILED' || c.status === 'CALLING'
        : c.status === statusFilter;

    const matchesMandate =
      mandateFilter === 'ALL' ? true : c.mandateType === mandateFilter;

    return matchesSearch && matchesStatus && matchesMandate;
  });

  return (
    <main className="app-container">
      {/* Top Header */}
      <Header
        onOpenDialer={() => {
          setActiveVapiCustomer(customers[0]);
          setIsVapiDialerOpen(true);
        }}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenVapiConfig={() => setIsVapiConfigOpen(true)}
        onResetData={handleResetData}
      />

      {/* KPI Performance Metrics */}
      <StatsCards customers={customers} />

      {/* Control Bar: Search & Filters */}
      <div className="control-bar">
        <div className="search-filter-wrap">
          <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: '34px' }}
              placeholder="Search by customer, merchant, failure..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses ({customers.length})</option>
              <option value="FAILED">Pending Failure ({customers.filter((c) => c.status === 'FAILED' || c.status === 'CALLING').length})</option>
              <option value="PAYMENT_LINK_SENT">Link Sent ({customers.filter((c) => c.status === 'PAYMENT_LINK_SENT').length})</option>
              <option value="RETRY_SCHEDULED">Retry Scheduled ({customers.filter((c) => c.status === 'RETRY_SCHEDULED').length})</option>
              <option value="RECOVERED">Recovered ({customers.filter((c) => c.status === 'RECOVERED').length})</option>
            </select>

            <select
              className="filter-select"
              value={mandateFilter}
              onChange={(e) => setMandateFilter(e.target.value)}
            >
              <option value="ALL">All Mandates</option>
              <option value="UPI_AUTOPAY">UPI Autopay</option>
              <option value="E_NACH">e-NACH (NetBanking)</option>
              <option value="CREDIT_CARD">Credit Cards</option>
              <option value="DEBIT_CARD">Debit Cards</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={14} style={{ color: 'var(--neon-cyan)' }} />
          <span>Showing <strong>{filteredCustomers.length}</strong> customer records</span>
        </div>
      </div>

      {/* 10 Customer Record Cards */}
      <div className="customers-grid">
        {filteredCustomers.map((cust) => (
          <CustomerCard
            key={cust.id}
            customer={cust}
            onStartVoiceCall={(customer) => setActiveVoiceCallCustomer(customer)}
            onCallViaVapi={(customer) => {
              setActiveVapiCustomer(customer);
              setIsVapiDialerOpen(true);
            }}
            onOpenCheckout={(customer) => setActiveCheckoutCustomer(customer)}
            onQuickSendLink={handleQuickSendLink}
          />
        ))}
      </div>

      {/* Interactive Web Voice Agent Modal */}
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

      {/* Vapi Assistant JSON Configuration Export Modal */}
      {isVapiConfigOpen && (
        <VapiConfigModal onClose={() => setIsVapiConfigOpen(false)} />
      )}
    </main>
  );
}
