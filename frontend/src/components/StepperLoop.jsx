import React from 'react';
import { Mic, BarChart3, TrendingUp, Lightbulb, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function StepperLoop({ activeTab, setActiveTab }) {
  const steps = [
    {
      id: 'copilot',
      label: 'UNDERSTAND',
      subtext: 'Voice, Hindi/Hinglish & Context',
      icon: Mic,
      color: '#00BAF2',
      bgGlow: 'rgba(0, 186, 242, 0.15)'
    },
    {
      id: 'analytics',
      label: 'ANALYSE',
      subtext: 'Sales, 5–8 PM Slump, Basket',
      icon: BarChart3,
      color: '#38BDF8',
      bgGlow: 'rgba(56, 189, 248, 0.15)'
    },
    {
      id: 'prediction',
      label: 'PREDICT',
      subtext: 'ML Demand & Churn Risk',
      icon: TrendingUp,
      color: '#F59E0B',
      bgGlow: 'rgba(245, 158, 11, 0.15)'
    },
    {
      id: 'copilot',
      label: 'RECOMMEND',
      subtext: 'Personalised Next-Best Action',
      icon: Lightbulb,
      color: '#A855F7',
      bgGlow: 'rgba(168, 85, 247, 0.15)'
    },
    {
      id: 'actions',
      label: 'ACT (APPROVE)',
      subtext: 'Controlled AI Tools Execution',
      icon: ShieldCheck,
      color: '#10B981',
      bgGlow: 'rgba(16, 185, 129, 0.15)'
    },
    {
      id: 'actions',
      label: 'VERIFY',
      subtext: 'Track Redemption & ROI',
      icon: CheckCircle2,
      color: '#06B6D4',
      bgGlow: 'rgba(6, 182, 212, 0.15)'
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: 24 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        flexWrap: 'wrap',
        gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--paytm-cyan)'
          }}>
            THE SAATHI CLOSED LOOP
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            • Not just a dashboard: An AI that Understands → Recommends → Acts → Verifies
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Click any step to inspect
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 10,
        position: 'relative'
      }}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = activeTab === step.id;
          return (
            <div
              key={idx}
              onClick={() => setActiveTab(step.id)}
              style={{
                cursor: 'pointer',
                padding: '12px 14px',
                borderRadius: 12,
                background: isSelected ? step.bgGlow : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isSelected ? step.color : 'var(--border-subtle)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: isSelected ? step.color : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={18} color={isSelected ? '#000000' : step.color} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: isSelected ? step.color : '#FFFFFF',
                  letterSpacing: '0.04em'
                }}>
                  {idx + 1}. {step.label}
                </div>
                <div style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}>
                  {step.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
