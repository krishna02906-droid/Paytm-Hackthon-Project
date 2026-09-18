import React, { useState, useEffect } from 'react';
import {
  Bot, BarChart3, TrendingUp, Users, ShieldCheck, Sparkles, AlertTriangle, ArrowRight, CheckCircle2
} from 'lucide-react';

import Navbar from './components/Navbar';
import StepperLoop from './components/StepperLoop';
import CopilotChat from './components/CopilotChat';
import SalesIntelligence from './components/SalesIntelligence';
import DemandPrediction from './components/DemandPrediction';
import CustomerRetention from './components/CustomerRetention';
import ActionCenter from './components/ActionCenter';
import SoundboxWidget from './components/SoundboxWidget';

import {
  fetchMerchantProfile,
  fetchOverviewAnalytics,
  fetchDemandPredictions,
  fetchCustomerIntelligence,
  fetchActions
} from './services/api';

export default function App() {
  const [language, setLanguage] = useState('hinglish');
  const [activeTab, setActiveTab] = useState('copilot');
  const [loading, setLoading] = useState(true);

  // Core Data Stores
  const [merchant, setMerchant] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [actions, setActions] = useState([]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [m, a, p, c, acts] = await Promise.all([
        fetchMerchantProfile(),
        fetchOverviewAnalytics(),
        fetchDemandPredictions(),
        fetchCustomerIntelligence(),
        fetchActions()
      ]);
      setMerchant(m);
      setAnalytics(a);
      setPredictions(p);
      setCustomerData(c);
      setActions(acts);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleActionApprovedOrExecuted = async () => {
    // Refresh actions & analytics
    try {
      const [acts, a] = await Promise.all([
        fetchActions(),
        fetchOverviewAnalytics()
      ]);
      setActions(acts);
      setAnalytics(a);
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'copilot', label: 'AI Merchant Copilot', icon: Bot, badge: 'Interactive' },
    { id: 'analytics', label: 'Sales Intelligence', icon: BarChart3, badge: analytics?.anomaly ? 'Alert' : null, badgeColor: 'badge-rose' },
    { id: 'prediction', label: 'Demand Prediction (ML)', icon: TrendingUp, badge: 'Scikit-Learn' },
    { id: 'customers', label: 'Customer Retention', icon: Users, badge: customerData ? `${customerData.inactive_count} Inactive` : null, badgeColor: 'badge-amber' },
    { id: 'actions', label: 'Action Center & Verification', icon: ShieldCheck, badge: `${actions.length} Actions`, badgeColor: 'badge-green' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        merchant={merchant}
        activeLanguage={language}
        setLanguage={setLanguage}
        onRefresh={loadAllData}
        loading={loading}
      />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 20px', width: '100%', flex: 1 }}>
        {/* Visual Closed-Loop Pipeline Stepper */}
        <StepperLoop activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Navigation Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 14,
          marginBottom: 24,
          overflowX: 'auto'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 12,
                  border: isCurrent ? '1px solid var(--paytm-cyan)' : '1px solid var(--border-subtle)',
                  background: isCurrent ? 'rgba(0, 186, 242, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  color: isCurrent ? 'var(--paytm-cyan)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.88rem',
                  fontWeight: isCurrent ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.18s ease'
                }}
              >
                <Icon size={18} color={isCurrent ? 'var(--paytm-cyan)' : 'var(--text-secondary)'} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`badge ${tab.badgeColor || 'badge-cyan'}`}
                    style={{ fontSize: '0.65rem', padding: '2px 8px' }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          {activeTab === 'copilot' && (
            <CopilotChat
              language={language}
              onActionApproved={handleActionApprovedOrExecuted}
            />
          )}

          {activeTab === 'analytics' && (
            <SalesIntelligence
              analytics={analytics}
              onInvestigate={() => setActiveTab('copilot')}
            />
          )}

          {activeTab === 'prediction' && (
            <DemandPrediction
              predictions={predictions}
              onPOOrdered={handleActionApprovedOrExecuted}
            />
          )}

          {activeTab === 'customers' && (
            <CustomerRetention
              customerData={customerData}
              onCampaignLaunched={handleActionApprovedOrExecuted}
            />
          )}

          {activeTab === 'actions' && (
            <ActionCenter
              actions={actions}
              onActionVerified={handleActionApprovedOrExecuted}
            />
          )}
        </div>

        {/* Floating Soundbox Hardware Dock */}
        <div style={{ marginTop: 28 }}>
          <SoundboxWidget merchant={merchant} />
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(8, 13, 26, 0.95)',
        padding: '16px 24px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div>
            <strong style={{ color: '#FFFFFF' }}>Paytm Saathi AI</strong> • Track 1 — Merchant Growth AI • <em>Every Merchant Deserves an AI Business Partner</em>
          </div>
          <div>
            Human-in-the-Loop Controlled Execution • Safe & Responsible AI
          </div>
        </div>
      </footer>
    </div>
  );
}
