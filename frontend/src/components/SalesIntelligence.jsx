import React from 'react';
import { TrendingDown, TrendingUp, AlertTriangle, Clock, CreditCard, ShoppingBag, ArrowUpRight, DollarSign } from 'lucide-react';

export default function SalesIntelligence({ analytics, onInvestigate }) {
  if (!analytics) return <div className="glass-panel" style={{ padding: 30 }}>Loading sales data...</div>;

  const { today, weekly_comparison, hourly_trends, payment_methods, top_selling_products, anomaly } = analytics;
  const isDown = weekly_comparison.revenue_change_pct < 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Anomaly Detection Alert Card (Directly from Slide 5) */}
      {anomaly && (
        <div style={{
          padding: '18px 22px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          boxShadow: '0 8px 30px rgba(244, 63, 94, 0.15)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(244, 63, 94, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle size={24} color="#F43F5E" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF' }}>{anomaly.title}</h3>
                <span className="badge badge-rose" style={{ fontSize: '0.68rem' }}>AI DETECTED</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                Saathi Root Cause Analysis (Confidence: {anomaly.confidence_score}):
              </p>
              <ul style={{
                fontSize: '0.82rem',
                color: '#E2E8F0',
                paddingLeft: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}>
                <li><strong style={{ color: '#F43F5E' }}>Primary Driver:</strong> {anomaly.root_cause_1}</li>
                <li><strong style={{ color: '#F59E0B' }}>Secondary Driver:</strong> {anomaly.root_cause_2}</li>
              </ul>
            </div>
          </div>

          <button
            onClick={onInvestigate}
            className="btn-paytm"
            style={{
              padding: '10px 18px',
              fontSize: '0.85rem',
              alignSelf: 'center'
            }}
          >
            <span>Ask Saathi What To Do</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16
      }}>
        {/* Today's Sales */}
        <div className="glass-panel" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Today's Revenue</span>
            <DollarSign size={18} color="var(--paytm-cyan)" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
            ₹{(today?.revenue ?? 0).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>
            +6.4% vs same time yesterday
          </div>
        </div>

        {/* Today's Orders */}
        <div className="glass-panel" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Today's Transactions</span>
            <ShoppingBag size={18} color="#A855F7" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
            {today?.orders ?? 0} orders
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Avg Basket: ₹{today?.avg_ticket ?? 0}
          </div>
        </div>

        {/* 7-Day Revenue Comparison */}
        <div className="glass-panel" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>7-Day Revenue Change</span>
            {isDown ? <TrendingDown size={18} color="#F43F5E" /> : <TrendingUp size={18} color="#10B981" />}
          </div>
          <div style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: isDown ? '#F43F5E' : '#10B981',
            marginBottom: 4
          }}>
            {weekly_comparison?.revenue_change_pct ?? 0}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            ₹{(weekly_comparison?.curr_week_revenue ?? 0).toLocaleString('en-IN')} vs ₹{(weekly_comparison?.prev_week_revenue ?? 0).toLocaleString('en-IN')}
          </div>
        </div>

        {/* Evening Peak Slump */}
        <div className="glass-panel" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Evening Slump (5–8 PM)</span>
            <Clock size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#F59E0B', marginBottom: 4 }}>
            {weekly_comparison?.evening_drop_pct ?? 0}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Decline concentrated in evening hours
          </div>
        </div>
      </div>

      {/* Hourly Comparison Chart & Diagnostics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: 20
      }}>
        {/* Hourly Trend Visual Bar Chart */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '1rem', color: '#FFFFFF' }}>Hourly Sales Comparison (Avg Daily)</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Comparing Current Week vs Previous Week (Highlights 5:00 PM – 8:00 PM Slump)
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.72rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, background: 'var(--paytm-cyan)', borderRadius: 2 }} /> Current Week
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, background: '#475569', borderRadius: 2 }} /> Prev Week
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, background: '#F59E0B', borderRadius: 2 }} /> 5-8 PM Gap
              </span>
            </div>
          </div>

          {/* Bar Visualization */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            height: 220,
            paddingTop: 20,
            paddingBottom: 25,
            borderBottom: '1px solid var(--border-subtle)',
            position: 'relative'
          }}>
            {hourly_trends.map((item, idx) => {
              const maxVal = 2500;
              const currHeight = Math.min(100, (item.current_week_avg / maxVal) * 100);
              const prevHeight = Math.min(100, (item.prev_week_avg / maxVal) * 100);
              const isSlump = item.is_evening_slump;

              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                    position: 'relative'
                  }}
                  title={`${item.hour}: Current ₹${item.current_week_avg} vs Prev ₹${item.prev_week_avg}`}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, width: '100%', justifyContent: 'center' }}>
                    {/* Previous Week Bar */}
                    <div style={{
                      width: '40%',
                      height: `${prevHeight}%`,
                      background: '#334155',
                      borderRadius: '3px 3px 0 0',
                      transition: 'height 0.3s ease'
                    }} />
                    {/* Current Week Bar */}
                    <div style={{
                      width: '40%',
                      height: `${currHeight}%`,
                      background: isSlump ? '#F59E0B' : 'var(--paytm-cyan)',
                      borderRadius: '3px 3px 0 0',
                      boxShadow: isSlump ? '0 0 8px rgba(245, 158, 11, 0.4)' : 'none',
                      transition: 'height 0.3s ease'
                    }} />
                  </div>
                  <span style={{
                    position: 'absolute',
                    bottom: -22,
                    fontSize: '0.65rem',
                    color: isSlump ? '#F59E0B' : 'var(--text-muted)',
                    fontWeight: isSlump ? 700 : 400
                  }}>
                    {item.hour.split(':')[0]}h
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 30,
            padding: '10px 14px',
            borderRadius: 10,
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            fontSize: '0.78rem',
            color: '#FDE68A',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Clock size={16} color="#F59E0B" />
            <span>Notice the 17:00 – 20:00 (5–8 PM) slump: Previous week averaged ~₹2,150/hr, current week dropped to ~₹1,420/hr.</span>
          </div>
        </div>

        {/* Top Selling Products & Payment Methods */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Top Products */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <h3 style={{ fontSize: '0.95rem', color: '#FFFFFF', marginBottom: 12 }}>
              Best-Selling Products (This Week)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {top_selling_products.map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'rgba(0, 186, 242, 0.15)',
                      color: 'var(--paytm-cyan)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      #{i + 1}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFFFFF' }}>
                      {p.name}
                    </span>
                  </div>
                  <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                    {p.units_sold} sold
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <h3 style={{ fontSize: '0.95rem', color: '#FFFFFF', marginBottom: 12 }}>
              Payment Mode Share (Paytm Rails)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {payment_methods.map((pm, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{pm.method}</span>
                    <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{pm.share_pct}% ({pm.count} txns)</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255, 255, 255, 0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      width: `${pm.share_pct}%`,
                      height: '100%',
                      background: pm.method.includes('Soundbox') ? 'var(--paytm-cyan)' : '#8B5CF6',
                      borderRadius: 3
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
