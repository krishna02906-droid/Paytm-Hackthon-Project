import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Clock, Sparkles, RefreshCw, ArrowUpRight, TrendingUp, AlertCircle, FileText } from 'lucide-react';
import { verifyAction } from '../services/api';
import confetti from 'canvas-confetti';

export default function ActionCenter({ actions, onActionVerified }) {
  const [verifyingId, setVerifyingId] = useState(null);

  if (!actions) {
    return <div className="glass-panel" style={{ padding: 30 }}>Loading action center...</div>;
  }

  const handleVerify = async (actionId) => {
    setVerifyingId(actionId);
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      const res = await verifyAction(actionId);
      if (onActionVerified) onActionVerified(res);
    } catch (err) {
      console.error('Error verifying action:', err);
    } finally {
      setVerifyingId(null);
    }
  };

  // Compute total recovered revenue across verified actions
  const totalLift = actions.reduce((acc, a) => acc + (a.revenue_lift || 0), 0);
  const totalRedemptions = actions.reduce((acc, a) => acc + (a.redemptions_count || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Principle Banner */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(0, 41, 112, 0.3) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={24} color="#10B981" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF' }}>Controlled AI Tools & Live Verification</h3>
              <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>HUMAN-IN-THE-LOOP</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              AI gets controlled access to actions—never unrestricted access. Every action is approved by the merchant and verified via telemetry.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Recovered Revenue</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981' }}>
              +₹{totalLift.toLocaleString('en-IN')}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Voucher Redemptions</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--paytm-cyan)' }}>
              {totalRedemptions} visits
            </div>
          </div>
        </div>
      </div>

      {/* Action Logs List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {actions.map((act) => {
          const isVerified = act.status === 'VERIFIED';
          const isActive = act.status === 'ACTIVE';

          return (
            <div
              key={act.id}
              className="glass-panel"
              style={{
                padding: '18px 22px',
                borderLeft: `4px solid ${isVerified ? '#10B981' : 'var(--paytm-cyan)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <h4 style={{ fontSize: '1rem', color: '#FFFFFF' }}>{act.title}</h4>
                    <span className={`badge ${isVerified ? 'badge-green' : 'badge-cyan'}`} style={{ fontSize: '0.68rem' }}>
                      {isVerified ? 'VERIFIED IMPACT' : 'ACTIVE & RUNNING'}
                    </span>
                    {act.discount_code && (
                      <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                        CODE: {act.discount_code}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {act.description}
                  </p>
                </div>

                {/* Right CTA / Metrics */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {isActive && (
                    <button
                      onClick={() => handleVerify(act.id)}
                      disabled={verifyingId === act.id}
                      className="btn-success"
                      style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                    >
                      <RefreshCw size={14} className={verifyingId === act.id ? 'radar-ring' : ''} />
                      <span>{verifyingId === act.id ? 'Verifying...' : 'Verify Live Impact'}</span>
                    </button>
                  )}
                  {isVerified && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Revenue Lift</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10B981' }}>
                        +₹{act.revenue_lift.toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Metrics Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.78rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Approved By: </span>
                  <strong style={{ color: '#FFFFFF' }}>{act.approved_by}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Audience Reach: </span>
                  <strong style={{ color: '#FFFFFF' }}>{act.reach_count} recipients</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Redemptions: </span>
                  <strong style={{ color: isVerified ? '#10B981' : 'var(--text-secondary)' }}>
                    {act.redemptions_count} customers
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Triggered At: </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{act.created_at}</span>
                </div>
              </div>

              {/* Verification Audit Note */}
              {act.verification_notes && (
                <div style={{
                  fontSize: '0.78rem',
                  color: isVerified ? '#A7F3D0' : 'var(--text-secondary)',
                  background: isVerified ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                  padding: isVerified ? '8px 12px' : 0,
                  borderRadius: 8
                }}>
                  {act.verification_notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
