import React, { useState } from 'react';
import { Users, UserX, Award, HeartHandshake, Send, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { executeAction } from '../services/api';
import confetti from 'canvas-confetti';

export default function CustomerRetention({ customerData, onCampaignLaunched }) {
  const [launching, setLaunching] = useState(false);
  const [campaignSuccess, setCampaignSuccess] = useState(null);

  if (!customerData) {
    return <div className="glass-panel" style={{ padding: 30 }}>Loading customer intelligence...</div>;
  }

  const { total_analyzed, inactive_count, active_count, vip_count, potential_recovered_revenue, inactive_list } = customerData;

  const handleLaunchComeback = async () => {
    setLaunching(true);
    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      const res = await executeAction({
        action_type: 'DISCOUNT_CAMPAIGN',
        title: '₹20 Inactive Customer Comeback Campaign',
        description: `Automated SMS & WhatsApp discount voucher dispatched to ${inactive_count} inactive repeat customers.`,
        target_audience: 'Customers Inactive for 14+ Days',
        payload: {
          coupon_code: 'COMEBACK20',
          discount_amount: 20,
          min_order_value: 150,
          target_count: inactive_count
        },
        approved_by: 'Merchant (Ramesh Sharma)'
      });

      setCampaignSuccess(`✅ Safalta! ₹20 Comeback Offer sabhi ${inactive_count} inactive customers ko bhej diya gaya hai!`);
      setTimeout(() => setCampaignSuccess(null), 6000);
      if (onCampaignLaunched) onCampaignLaunched(res);
    } catch (err) {
      console.error('Error launching campaign:', err);
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Retention Summary Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16
      }}>
        <div className="glass-panel" style={{ padding: '18px 20px', borderLeft: '4px solid #F43F5E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Inactive (14+ Days)</span>
            <UserX size={18} color="#F43F5E" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#F43F5E', marginBottom: 4 }}>
            {inactive_count} Customers
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            High churn risk • Missing evening rush
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', borderLeft: '4px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Regulars</span>
            <Users size={18} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#10B981', marginBottom: 4 }}>
            {active_count} Customers
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Visited in last 0–3 days
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', borderLeft: '4px solid #8B5CF6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>High-Value VIPs</span>
            <Award size={18} color="#8B5CF6" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#8B5CF6', marginBottom: 4 }}>
            {vip_count} Customers
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Avg Spend: ₹4,200+
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', borderLeft: '4px solid var(--paytm-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Recoverable Revenue</span>
            <Sparkles size={18} color="var(--paytm-cyan)" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--paytm-cyan)', marginBottom: 4 }}>
            ₹{(potential_recovered_revenue ?? 0).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Estimated weekly recovery
          </div>
        </div>
      </div>

      {/* Action Trigger Banner */}
      <div style={{
        padding: '20px 24px',
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(0, 186, 242, 0.15) 0%, rgba(0, 41, 112, 0.3) 100%)',
        border: '1px solid rgba(0, 186, 242, 0.4)',
        boxShadow: '0 8px 30px rgba(0, 186, 242, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>AI Retention Engine</span>
            <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF' }}>Launch ₹20 Comeback Campaign</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Automatically sends targeted SMS: <em>"Sharma Kirana par aapka intezaar hai! Shaam 5–8 baje paayein ₹20 chhoot (Code: COMEBACK20)."</em>
          </p>
        </div>

        <button
          onClick={handleLaunchComeback}
          disabled={launching}
          className="btn-paytm"
          style={{ padding: '12px 22px', fontSize: '0.9rem' }}
        >
          <ShieldCheck size={18} />
          <span>{launching ? 'Broadcasting...' : `Approve & Launch to ${inactive_count} Customers`}</span>
        </button>
      </div>

      {campaignSuccess && (
        <div style={{
          padding: '12px 18px',
          borderRadius: 12,
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#10B981',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <CheckCircle2 size={18} />
          <span>{campaignSuccess}</span>
        </div>
      )}

      {/* Inactive Customers Table */}
      <div className="glass-panel" style={{ padding: 20, overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: 14 }}>
          Target Cohort: Inactive Customers (14+ Days Without Visit)
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Customer Name</th>
              <th style={{ padding: '12px 16px' }}>Phone</th>
              <th style={{ padding: '12px 16px' }}>Days Inactive</th>
              <th style={{ padding: '12px 16px' }}>Lifetime Spend</th>
              <th style={{ padding: '12px 16px' }}>Total Visits</th>
              <th style={{ padding: '12px 16px' }}>Churn Risk</th>
              <th style={{ padding: '12px 16px' }}>Typical Visit Hour</th>
            </tr>
          </thead>
          <tbody>
            {(inactive_list || []).map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#FFFFFF', fontSize: '0.88rem' }}>
                  {c.name}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {c.phone}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
                    {c.days_inactive} Days Ago
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600 }}>
                  ₹{(c.total_spend ?? 0).toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {c.total_visits} orders
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 45, height: 6, background: '#334155', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${c.churn_risk_pct}%`, height: '100%', background: '#F43F5E' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#F43F5E', fontWeight: 600 }}>
                      {c.churn_risk_pct}%
                    </span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: 'var(--paytm-cyan)' }}>
                  {c.preferred_hour}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
