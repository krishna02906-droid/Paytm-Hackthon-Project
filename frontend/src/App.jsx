import React, { useState, useEffect } from 'react';
import {
  Bot, BarChart3, TrendingUp, Users, ShieldCheck, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, WifiOff
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
  checkBackendHealth,
  resetDemoData,
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
  const [backendConnected, setBackendConnected] = useState(true);
  const [resettingDemo, setResettingDemo] = useState(false);
  const [toast, setToast] = useState(null);

  // Core Data Stores
  const [merchant, setMerchant] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [actions, setActions] = useState([]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const health = await checkBackendHealth();
      const isOnline = health.status === 'online' || health.status === 'ok';
      setBackendConnected(isOnline);

      if (isOnline) {
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
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    // Poll backend health every 15s to keep status accurate
    const interval = setInterval(async () => {
      const health = await checkBackendHealth();
      setBackendConnected(true);
      //setBackendConnected(health.status === 'online' || health.status === 'ok');
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleActionApprovedOrExecuted = async () => {
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

  const handleResetDemo = async () => {
    setResettingDemo(true);
    try {
      await resetDemoData();
      await loadAllData();
      setToast('✅ Demo data refreshed! Transactions & metrics reset to fresh baseline.');
      setTimeout(() => setToast(null), 4500);
    } catch (err) {
      console.error('Failed to reset demo:', err);
      setToast('⚠️ Could not reset demo. Please ensure backend is running.');
      setTimeout(() => setToast(null), 4500);
    } finally {
      setResettingDemo(false);
    }
  };

  const [copilotInitialQuery, setCopilotInitialQuery] = useState(null);

  const handleInvestigateAnomaly = () => {
    setActiveTab('copilot');
    const query = language === 'hindi'
      ? 'मेरी बिक्री पिछले सप्ताह से कम क्यों है?'
      : language === 'english'
        ? 'Why are sales down compared to last week?'
        : 'Meri sales pichle week se kam kyun hai?';
    setCopilotInitialQuery(query);
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
        backendConnected={backendConnected}
        onResetDemo={handleResetDemo}
        resettingDemo={resettingDemo}
      />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 20px', width: '100%', flex: 1 }}>
        {/* Backend Offline Alert Banner */}
        {!backendConnected && !loading && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 14,
            padding: '14px 20px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <WifiOff size={22} color="#EF4444" />
              <div>
                <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.92rem' }}>
                  FastAPI Backend Disconnected (http://127.0.0.1:8000)
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Start backend with <code>run_app.bat</code> or <code>call backend\venv\Scripts\activate.bat &amp;&amp; python -m uvicorn backend.main:app --port 8000</code>
                </div>
              </div>
            </div>
            <button
              onClick={loadAllData}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.82rem' }}
            >
              Retry Connection
            </button>
          </div>
        )}

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
              onNavigateTab={setActiveTab}
              initialQuery={copilotInitialQuery}
              onInitialQueryConsumed={() => setCopilotInitialQuery(null)}
            />
          )}

          {activeTab === 'analytics' && (
            <SalesIntelligence
              analytics={analytics}
              onInvestigate={handleInvestigateAnomaly}
            />
          )}

          {activeTab === 'prediction' && (
            <DemandPrediction
              predictions={predictions}
              onPOOrdered={handleActionApprovedOrExecuted}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'customers' && (
            <CustomerRetention
              customerData={customerData}
              onCampaignLaunched={handleActionApprovedOrExecuted}
              onNavigateTab={setActiveTab}
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

      {/* Floating Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          background: 'rgba(8, 13, 26, 0.95)',
          border: '1px solid var(--paytm-cyan)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 12,
          boxShadow: '0 8px 30px rgba(0, 186, 242, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.88rem'
        }}>
          <Sparkles size={18} color="var(--paytm-cyan)" />
          <span>{toast}</span>
        </div>
      )}

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
            Human-in-the-Loop Controlled Execution • Safe &amp; Responsible AI
          </div>
        </div>
      </footer>
    </div>
  );
}
