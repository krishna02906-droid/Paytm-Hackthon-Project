import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, Clock, Sparkles, RefreshCw, ArrowUpRight, 
  TrendingUp, AlertCircle, FileText, Truck, Navigation, Send, Radio, 
  Calendar, Check, MapPin, PackageCheck, FileCheck, Wifi, Cpu
} from 'lucide-react';
import { verifyAction } from '../services/api';
import confetti from 'canvas-confetti';

function getTimelineSteps(act) {
  if (act.tracking_timeline && act.tracking_timeline.length > 0) {
    return act.tracking_timeline;
  }
  const isVerified = act.status === 'VERIFIED';
  const createdDate = act.created_date || '19 Sep 2026';
  const createdTime = act.created_time || '10:35 AM';
  const eta = act.delivery_eta || (act.action_type === 'RESTOCK_PO' ? `${createdDate}, 04:00 PM` : `${createdDate}, 08:00 PM`);
  const verifiedTime = act.verified_at || `${createdDate}, ${act.action_type === 'RESTOCK_PO' ? '04:00 PM' : '08:15 PM'}`;

  if (act.action_type === 'RESTOCK_PO') {
    return [
      {
        stage: 'PO Generated & Approved',
        description: 'Merchant authorized order for Metro Wholesalers',
        date: createdDate,
        time: createdTime,
        status: 'COMPLETED'
      },
      {
        stage: 'Dispatched by Supplier',
        description: 'Metro Wholesalers North Delhi packed & dispatched',
        date: createdDate,
        time: '11:10 AM',
        status: 'COMPLETED'
      },
      {
        stage: 'In Transit (Paytm FastDelivery)',
        description: 'Van DL-1L-4492 in transit via Chandni Chowk route',
        date: createdDate,
        time: '01:30 PM',
        status: isVerified ? 'COMPLETED' : 'ACTIVE'
      },
      {
        stage: 'Out for Delivery',
        description: 'Driver assigned for final store drop-off',
        date: createdDate,
        time: '03:30 PM',
        status: isVerified ? 'COMPLETED' : 'PENDING'
      },
      {
        stage: 'Delivered & Stocked',
        description: '50 pkts Milk & 15 bags Atta stocked in store',
        date: createdDate,
        time: isVerified ? verifiedTime : '04:00 PM (Est.)',
        status: isVerified ? 'COMPLETED' : 'PENDING'
      }
    ];
  } else if (act.action_type === 'SOUNDBOX_ANNOUNCEMENT') {
    return [
      {
        stage: 'Voice Promo Approved',
        description: 'Merchant scheduled Soundbox 4.0 announcement',
        date: createdDate,
        time: createdTime,
        status: 'COMPLETED'
      },
      {
        stage: 'Audio Pushed to Cloud',
        description: 'Hinglish audio snippet generated & uploaded',
        date: createdDate,
        time: '10:37 AM',
        status: 'COMPLETED'
      },
      {
        stage: 'Device 4G Synced',
        description: 'Paytm Soundbox 4.0 (ID: SB4-DEL-98214) online',
        date: createdDate,
        time: '10:40 AM',
        status: 'COMPLETED'
      },
      {
        stage: 'Peak Window Airing',
        description: 'Airing every 15 mins during 5:00 PM – 8:00 PM rush',
        date: createdDate,
        time: '05:00 PM – 08:00 PM',
        status: isVerified ? 'COMPLETED' : 'ACTIVE'
      },
      {
        stage: 'Broadcast Telemetry Verified',
        description: '32 voice plays logged via device telemetry',
        date: createdDate,
        time: isVerified ? verifiedTime : '08:00 PM (Est.)',
        status: isVerified ? 'COMPLETED' : 'PENDING'
      }
    ];
  } else {
    // DISCOUNT_CAMPAIGN
    return [
      {
        stage: 'Campaign Authorized',
        description: `Targeted voucher '${act.discount_code || 'COMEBACK20'}' approved`,
        date: createdDate,
        time: createdTime,
        status: 'COMPLETED'
      },
      {
        stage: 'SMS & WhatsApp Dispatched',
        description: `${act.reach_count || 42} inactive customers notified with voucher`,
        date: createdDate,
        time: '10:38 AM',
        status: 'COMPLETED'
      },
      {
        stage: 'Soundbox Telemetry Synced',
        description: 'Soundbox QR code mapped to auto-detect voucher redemption',
        date: createdDate,
        time: '10:42 AM',
        status: 'COMPLETED'
      },
      {
        stage: 'Peak Rush Active Window',
        description: 'Customers redeeming ₹20 voucher on orders ₹150+',
        date: createdDate,
        time: '05:00 PM – 08:00 PM',
        status: isVerified ? 'COMPLETED' : 'ACTIVE'
      },
      {
        stage: 'Telemetry Verified Lift',
        description: `Verified ${act.redemptions_count || '18+'} redemptions & recovered sales`,
        date: createdDate,
        time: isVerified ? verifiedTime : '08:15 PM (Est.)',
        status: isVerified ? 'COMPLETED' : 'PENDING'
      }
    ];
  }
}

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {actions.map((act) => {
          const isVerified = act.status === 'VERIFIED';
          const isActive = act.status === 'ACTIVE';
          const timelineSteps = getTimelineSteps(act);

          return (
            <div
              key={act.id}
              className="glass-panel"
              style={{
                padding: '20px 24px',
                borderLeft: `4px solid ${isVerified ? '#10B981' : 'var(--paytm-cyan)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}
            >
              {/* Header Row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 6 }}>
                    <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF' }}>{act.title}</h4>
                    
                    {isActive ? (
                      <span className="badge badge-cyan" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--paytm-cyan)' }} className="radar-ring" />
                        LIVE TRACKING ACTIVE
                      </span>
                    ) : (
                      <span className="badge badge-green" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <CheckCircle2 size={12} />
                        VERIFIED IMPACT
                      </span>
                    )}

                    {act.discount_code && (
                      <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                        CODE: {act.discount_code}
                      </span>
                    )}

                    {/* Timestamp Badge */}
                    <span style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-secondary)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '3px 8px',
                      borderRadius: 6,
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <Calendar size={11} color="var(--paytm-cyan)" />
                      <span>{act.created_at || '19 Sep 2026, 10:35 AM'}</span>
                    </span>
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
                      style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                    >
                      <RefreshCw size={14} className={verifyingId === act.id ? 'radar-ring' : ''} />
                      <span>{verifyingId === act.id ? 'Verifying Telemetry...' : 'Verify Live Impact ⚡'}</span>
                    </button>
                  )}
                  {isVerified && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {act.action_type === 'RESTOCK_PO' ? 'Prevented Stockout Loss' : 'Revenue Lift'}
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }}>
                        +₹{(act.revenue_lift ?? 0).toLocaleString('en-IN')}
                      </div>
                      {act.verified_at && (
                        <div style={{ fontSize: '0.68rem', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                          <Clock size={10} />
                          <span>Verified: {act.verified_at}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Metrics Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 12,
                padding: '12px 16px',
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
                  <span style={{ color: 'var(--text-muted)' }}>
                    {act.action_type === 'RESTOCK_PO' ? 'Recipient: ' : act.action_type === 'SOUNDBOX_ANNOUNCEMENT' ? 'Channel: ' : 'Audience Reach: '}
                  </span>
                  <strong style={{ color: '#FFFFFF' }}>
                    {act.action_type === 'RESTOCK_PO' ? (act.target_audience || 'Supplier (Metro Wholesalers)') : act.action_type === 'SOUNDBOX_ANNOUNCEMENT' ? 'Soundbox 4.0 (4G Audio)' : `${act.reach_count} recipients`}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {act.action_type === 'RESTOCK_PO' ? 'Live Delivery Status: ' : act.action_type === 'SOUNDBOX_ANNOUNCEMENT' ? 'Broadcast Status: ' : 'Redemptions: '}
                  </span>
                  <strong style={{ color: isVerified ? '#10B981' : 'var(--paytm-cyan)' }}>
                    {act.action_type === 'RESTOCK_PO'
                      ? (isVerified ? `Delivered & Restocked` : `In Transit (ETA: ${act.delivery_eta || '19 Sep 2026, 04:00 PM'})`)
                      : act.action_type === 'SOUNDBOX_ANNOUNCEMENT'
                      ? (isVerified ? '32 Plays Logged' : `Airing Promo (${act.delivery_eta || '19 Sep 2026, 05:00 PM – 08:00 PM'})`)
                      : (isVerified ? `${act.redemptions_count} redeemed` : `Active Window (${act.delivery_eta || '19 Sep 2026, 05:00 PM – 08:00 PM'})`)}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {isVerified ? 'Verified Date & Time: ' : 'Target ETA Date & Time: '}
                  </span>
                  <strong style={{ color: isVerified ? '#10B981' : '#FFFFFF' }}>
                    {isVerified ? (act.verified_at || act.created_at) : (act.delivery_eta || '19 Sep 2026, 04:00 PM')}
                  </strong>
                </div>
              </div>

              {/* Live Tracking Multi-Stage Timeline Stepper */}
              <div style={{
                background: 'rgba(0, 41, 112, 0.15)',
                border: '1px solid rgba(0, 186, 242, 0.18)',
                borderRadius: 12,
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 8,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingBottom: 10
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: isVerified ? '#10B981' : 'var(--paytm-cyan)'
                    }} className={isVerified ? '' : 'radar-ring'} />
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: isVerified ? '#10B981' : 'var(--paytm-cyan)',
                      textTransform: 'uppercase'
                    }}>
                      {isVerified ? 'Live Telemetry Audit • Completed & Verified' : 'Live Tracking Telemetry • Real-Time Progress'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={12} color="var(--paytm-cyan)" />
                    <span>Triggered: <strong style={{ color: '#FFFFFF' }}>{act.created_at || '19 Sep 2026, 10:35 AM'}</strong></span>
                    <span>•</span>
                    <span>Expected: <strong style={{ color: '#10B981' }}>{act.delivery_eta || '19 Sep 2026, 04:00 PM'}</strong></span>
                  </div>
                </div>

                {/* Horizontal Milestones */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                  gap: 12,
                  position: 'relative'
                }}>
                  {timelineSteps.map((step, idx) => {
                    const isStepDone = step.status === 'COMPLETED';
                    const isStepActive = step.status === 'ACTIVE';

                    return (
                      <div
                        key={idx}
                        style={{
                          background: isStepActive 
                            ? 'rgba(0, 186, 242, 0.08)' 
                            : isStepDone 
                            ? 'rgba(16, 185, 129, 0.05)' 
                            : 'rgba(255, 255, 255, 0.01)',
                          border: isStepActive 
                            ? '1px solid var(--paytm-cyan)' 
                            : isStepDone 
                            ? '1px solid rgba(16, 185, 129, 0.25)' 
                            : '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: 10,
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                          position: 'relative'
                        }}
                      >
                        {/* Step Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            background: isStepDone ? '#10B981' : isStepActive ? 'var(--paytm-cyan)' : 'rgba(255, 255, 255, 0.1)',
                            color: isStepDone || isStepActive ? '#080D1A' : 'var(--text-muted)'
                          }}>
                            {isStepDone ? <Check size={13} strokeWidth={3} /> : idx + 1}
                          </div>

                          <span style={{
                            fontSize: '0.66rem',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: isStepDone ? 'rgba(16, 185, 129, 0.15)' : isStepActive ? 'rgba(0, 186, 242, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                            color: isStepDone ? '#10B981' : isStepActive ? 'var(--paytm-cyan)' : 'var(--text-muted)'
                          }}>
                            {isStepDone ? 'DONE' : isStepActive ? 'ACTIVE NOW' : 'PENDING'}
                          </span>
                        </div>

                        {/* Step Title */}
                        <div style={{
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: isStepDone ? '#FFFFFF' : isStepActive ? 'var(--paytm-cyan)' : 'var(--text-secondary)',
                          lineHeight: 1.3
                        }}>
                          {step.stage}
                        </div>

                        {/* Proper Date & Time Display */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: isStepDone ? '#A7F3D0' : isStepActive ? '#7DD3FC' : 'var(--text-muted)',
                          background: 'rgba(0, 0, 0, 0.25)',
                          padding: '3px 6px',
                          borderRadius: 5,
                          width: 'fit-content'
                        }}>
                          <Clock size={11} />
                          <span>{step.date} • {step.time}</span>
                        </div>

                        {/* Step Description */}
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                          {step.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Verification Audit Note */}
              {act.verification_notes && (
                <div style={{
                  fontSize: '0.8rem',
                  color: isVerified ? '#A7F3D0' : 'var(--text-secondary)',
                  background: isVerified ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: isVerified ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-subtle)',
                  padding: '10px 14px',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <ShieldCheck size={16} color={isVerified ? '#10B981' : 'var(--paytm-cyan)'} />
                  <span>{act.verification_notes}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

