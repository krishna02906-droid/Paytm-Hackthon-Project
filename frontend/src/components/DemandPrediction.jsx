import React, { useState } from 'react';
import { Package, AlertCircle, TrendingUp, CheckCircle, ShoppingCart, Truck, Clock } from 'lucide-react';
import { executeAction } from '../services/api';
import confetti from 'canvas-confetti';

export default function DemandPrediction({ predictions, onPOOrdered }) {
  const [orderingSku, setOrderingSku] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!predictions || predictions.length === 0) {
    return <div className="glass-panel" style={{ padding: 30 }}>Loading demand forecasts...</div>;
  }

  const handleOrderRestock = async (item) => {
    setOrderingSku(item.sku);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      const res = await executeAction({
        action_type: 'RESTOCK_PO',
        title: `PO for ${item.name}`,
        description: `Dispatched automatic reorder of ${item.suggested_reorder_qty} ${item.unit} to wholesale distributor.`,
        target_audience: 'Supplier (Metro Wholesalers North Delhi)',
        payload: {
          sku: item.sku,
          reorder_qty: item.suggested_reorder_qty,
          estimated_cost: item.cost_price * item.suggested_reorder_qty
        },
        approved_by: 'Merchant (Ramesh Sharma)'
      });

      setSuccessMsg(`✅ Purchase Order for ${item.name} (${item.suggested_reorder_qty} ${item.unit}) successfully dispatched to distributor!`);
      setTimeout(() => setSuccessMsg(null), 5000);
      if (onPOOrdered) onPOOrdered(res);
    } catch (err) {
      console.error('Error ordering PO:', err);
    } finally {
      setOrderingSku(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Overview Banner */}
      <div className="glass-panel" style={{
        padding: '18px 24px',
        background: 'linear-gradient(135deg, rgba(0, 41, 112, 0.4) 0%, rgba(16, 25, 45, 0.9) 100%)',
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
            background: 'rgba(0, 186, 242, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={22} color="var(--paytm-cyan)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF' }}>Predictive ML Demand Forecasting</h3>
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>Scikit-Learn Regression</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Analyzes historical velocity, weekly seasonality, and lead times to calculate exact stockout ETA.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            padding: '8px 14px',
            borderRadius: 10,
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            fontSize: '0.78rem',
            color: '#F43F5E',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <AlertCircle size={14} />
            <span>2 Products at Critical Stockout Risk</span>
          </div>
        </div>
      </div>

      {successMsg && (
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
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Demand Forecast Table */}
      <div className="glass-panel" style={{ padding: 20, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 16px' }}>Product & Category</th>
              <th style={{ padding: '12px 16px' }}>Current Stock</th>
              <th style={{ padding: '12px 16px' }}>Daily Demand</th>
              <th style={{ padding: '12px 16px' }}>Next 7-Day ML Forecast</th>
              <th style={{ padding: '12px 16px' }}>Stockout ETA</th>
              <th style={{ padding: '12px 16px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((p) => {
              const isCritical = p.stockout_status === 'CRITICAL';
              const isWarning = p.stockout_status === 'WARNING';

              return (
                <tr
                  key={p.sku}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    background: isCritical ? 'rgba(244, 63, 94, 0.04)' : 'transparent',
                    transition: 'background 0.15s ease'
                  }}
                >
                  {/* Name & Category */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.88rem' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      SKU: {p.sku} • {p.category}
                    </div>
                  </td>

                  {/* Stock */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{
                      fontWeight: 700,
                      color: isCritical ? '#F43F5E' : isWarning ? '#F59E0B' : '#FFFFFF',
                      fontSize: '0.92rem'
                    }}>
                      {p.current_stock} {p.unit}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Reorder at: {p.reorder_point} {p.unit}
                    </div>
                  </td>

                  {/* Daily Demand */}
                  <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    ~{p.historical_daily_avg} {p.unit}/day
                  </td>

                  {/* 7-Day Forecast & Sparkline */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 24, marginBottom: 4 }}>
                      {(p.daily_forecast || []).map((val, i) => (
                        <div
                          key={i}
                          style={{
                            width: 6,
                            height: `${Math.min(100, (val / 30) * 100)}%`,
                            background: 'var(--paytm-cyan)',
                            borderRadius: '2px 2px 0 0',
                            opacity: 0.8
                          }}
                          title={`Day ${i + 1}: ${val} ${p.unit}`}
                        />
                      ))}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Total 7d: <strong>{p.predicted_next_7d_total} {p.unit}</strong>
                    </div>
                  </td>

                  {/* Stockout Status */}
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge ${isCritical ? 'badge-rose' : isWarning ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: '0.72rem' }}>
                      <Clock size={12} />
                      {p.days_of_stock_remaining <= 1.0 ? 'Stockout Today!' : `${p.days_of_stock_remaining} Days Left`}
                    </span>
                  </td>

                  {/* Reorder Button */}
                  <td style={{ padding: '14px 16px' }}>
                    {p.reorder_suggested ? (
                      <button
                        onClick={() => handleOrderRestock(p)}
                        disabled={orderingSku === p.sku}
                        className={isCritical ? 'btn-paytm' : 'btn-secondary'}
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        <Truck size={14} />
                        <span>Reorder {p.suggested_reorder_qty} {p.unit}</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Stock Healthy
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
