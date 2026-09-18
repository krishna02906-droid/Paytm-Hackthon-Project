import React, { useState } from 'react';
import { Radio, Volume2, Wifi, Battery, Sparkles, X, Play, Music } from 'lucide-react';
import { triggerSoundboxSound } from '../services/api';

export default function SoundboxWidget({ merchant }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastAnnouncement, setLastAnnouncement] = useState('Device ready for instant voice confirmations');

  const playVoiceAnnouncement = async (text, soundType) => {
    setIsPlaying(true);
    setLastAnnouncement(text);

    // Call backend API for record
    try {
      await triggerSoundboxSound({
        sound_type: soundType,
        text: text,
        amount: 20
      });
    } catch (e) {
      console.warn(e);
    }

    // Play synthesis voice
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlaying(false), 2500);
    }
  };

  return (
    <div className="glass-panel" style={{
      padding: '16px 20px',
      borderRadius: 16,
      background: 'linear-gradient(135deg, rgba(0, 41, 112, 0.5) 0%, rgba(16, 25, 45, 0.95) 100%)',
      border: '1px solid rgba(0, 186, 242, 0.3)',
      boxShadow: '0 8px 30px rgba(0, 41, 112, 0.4)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        flexWrap: 'wrap',
        gap: 12
      }}>
        {/* Device Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #002970 0%, #00BAF2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <Radio size={20} color="#FFFFFF" />
            {isPlaying && (
              <span style={{
                position: 'absolute',
                top: -3,
                right: -3,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 8px #10B981'
              }} className="pulse-active" />
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h4 style={{ fontSize: '0.92rem', color: '#FFFFFF' }}>
                Paytm Soundbox 4.0
              </h4>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                4G LTE
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              ID: {merchant?.soundbox_device_id || 'SB4-DEL-98214'} • Audio AI Connected
            </p>
          </div>
        </div>

        {/* Telemetry Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Wifi size={14} color="#10B981" />
            <span>4G High</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Battery size={14} color="#10B981" />
            <span>94%</span>
          </div>
        </div>
      </div>

      {/* Soundwave Simulation Indicator */}
      <div style={{
        padding: '10px 14px',
        borderRadius: 10,
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid var(--border-subtle)',
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Volume2 size={16} color={isPlaying ? 'var(--paytm-cyan)' : 'var(--text-muted)'} className={isPlaying ? 'pulse-active' : ''} />
          <span style={{ fontSize: '0.78rem', color: isPlaying ? 'var(--paytm-cyan)' : 'var(--text-secondary)' }}>
            {lastAnnouncement}
          </span>
        </div>

        {isPlaying && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {[40, 70, 90, 60, 80, 40].map((h, i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  height: `${h * 0.2}px`,
                  background: 'var(--paytm-cyan)',
                  borderRadius: 2
                }}
                className="radar-ring"
              />
            ))}
          </div>
        )}
      </div>

      {/* Audio Announcement Trigger Buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={() => playVoiceAnnouncement('Paytm par bees rupaye prapt hue!', 'PAYMENT_RECEIVED')}
          disabled={isPlaying}
          className="btn-secondary"
          style={{ fontSize: '0.78rem', padding: '6px 12px' }}
        >
          <Play size={13} />
          <span>Play Payment Chime (₹20)</span>
        </button>

        <button
          onClick={() => playVoiceAnnouncement('Paytm Saathi Alert: Sharma Kirana par aaj shaam paayen bees rupaye ki chhoot!', 'PROMO_ANNOUNCEMENT')}
          disabled={isPlaying}
          className="btn-paytm"
          style={{ fontSize: '0.78rem', padding: '6px 12px' }}
        >
          <Sparkles size={13} />
          <span>Broadcast 5–8 PM Promo Announcement</span>
        </button>
      </div>
    </div>
  );
}
