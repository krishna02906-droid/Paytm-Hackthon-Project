import React from 'react';
import { Radio, RefreshCw, Globe, Sparkles, Store, CheckCircle2 } from 'lucide-react';

export default function Navbar({ merchant, activeLanguage, setLanguage, onRefresh, loading }) {
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

        {/* Right: Soundbox Status, Language, Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Soundbox 4.0 Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            borderRadius: 20,
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 8px #10B981'
            }} />
            <Radio size={14} color="#10B981" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10B981' }}>
              Soundbox 4.0 (4G Online)
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
                  padding: '4px 10px',
                  borderRadius: 7,
                  border: 'none',
                  background: activeLanguage === lang ? 'var(--paytm-cyan)' : 'transparent',
                  color: activeLanguage === lang ? '#000000' : 'var(--text-secondary)',
                  fontWeight: activeLanguage === lang ? 700 : 500,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease'
                }}
              >
                {lang === 'hinglish' ? 'Hinglish' : lang === 'hindi' ? 'हिंदी' : 'English'}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="btn-secondary"
            style={{ padding: '8px 12px' }}
            title="Refresh Store Data"
          >
            <RefreshCw size={14} className={loading ? 'radar-ring' : ''} />
            <span style={{ fontSize: '0.78rem' }}>Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
}
