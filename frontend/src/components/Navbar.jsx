import React from 'react';
import { Radio, RefreshCw, Globe, Sparkles, Store, CheckCircle2, Activity, AlertCircle, RotateCcw } from 'lucide-react';

export default function Navbar({
  merchant,
  activeLanguage,
  setLanguage,
  onRefresh,
  loading,
  backendConnected,
  onResetDemo,
  resettingDemo
}) {
  return (
    <header style={{
      background: 'rgba(8, 13, 26, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        {/* Left: Brand & Track */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #002970 0%, #00BAF2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0, 186, 242, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Sparkles size={24} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #FFFFFF 0%, #00BAF2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                PAYTM SAATHI AI
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                Track 1: Merchant Growth AI
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              From Transactions → Insights → Decisions → Actions
            </p>
          </div>
        </div>

        {/* Center: Store Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '6px 14px',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 12,
          border: '1px solid var(--border-subtle)'
        }}>
          <Store size={18} color="var(--paytm-cyan)" />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>
              {merchant?.business_name || 'Sharma Kirana & Superstore'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {merchant?.city || 'Chandni Chowk, Delhi'} • {merchant?.upi_vpa || 'sharmakirana@paytm'}
            </div>
          </div>
        </div>

        {/* Right: Live Backend Status, Soundbox Status, Language, Refresh, Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Backend Status Indicator */}
          {backendConnected ? (
            <div
              title="FastAPI Backend Live on http://127.0.0.1:8000"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 20,
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.4)'
              }}
            >
              <div style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 6px #10B981'
              }} />
              <Activity size={13} color="#10B981" />
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#10B981' }}>
                Backend Live
              </span>
            </div>
          ) : (
            <button
              onClick={onRefresh}
              title="Backend disconnected! Click to reconnect."
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 20,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#EF4444',
                boxShadow: '0 0 6px #EF4444'
              }} />
              <AlertCircle size={13} color="#EF4444" />
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#EF4444' }}>
                Backend Offline (Retry)
              </span>
            </button>
          )}

          {/* Soundbox 4.0 Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 20,
            background: 'rgba(0, 186, 242, 0.1)',
            border: '1px solid rgba(0, 186, 242, 0.3)'
          }}>
            <div style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--paytm-cyan)',
              boxShadow: '0 0 6px var(--paytm-cyan)'
            }} />
            <Radio size={13} color="var(--paytm-cyan)" />
            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--paytm-cyan)' }}>
              Soundbox 4.0 (Online)
            </span>
          </div>

          {/* Language Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '3px',
            borderRadius: 10,
            border: '1px solid var(--border-subtle)'
          }}>
            {['hinglish', 'hindi', 'english'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                style={{
                  padding: '4px 9px',
                  borderRadius: 7,
                  border: 'none',
                  background: activeLanguage === lang ? 'var(--paytm-cyan)' : 'transparent',
                  color: activeLanguage === lang ? '#000000' : 'var(--text-secondary)',
                  fontWeight: activeLanguage === lang ? 700 : 500,
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease'
                }}
              >
                {lang === 'hinglish' ? 'Hinglish' : lang === 'hindi' ? 'हिंदी' : 'English'}
              </button>
            ))}
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={onResetDemo}
            className="btn-secondary"
            style={{ padding: '7px 11px', borderColor: 'rgba(0, 186, 242, 0.35)' }}
            title="Reset demo data to initial state for judges"
            disabled={resettingDemo}
          >
            <RotateCcw size={13} className={resettingDemo ? 'radar-ring' : ''} color="var(--paytm-cyan)" />
            <span style={{ fontSize: '0.76rem', color: 'var(--paytm-cyan)' }}>
              {resettingDemo ? 'Resetting...' : 'Reset Demo'}
            </span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="btn-secondary"
            style={{ padding: '7px 11px' }}
            title="Refresh Store Data"
          >
            <RefreshCw size={13} className={loading ? 'radar-ring' : ''} />
            <span style={{ fontSize: '0.76rem' }}>Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
}
