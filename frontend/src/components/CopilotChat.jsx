import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Bot, User, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendCopilotMessage, executeAction } from '../services/api';

export default function CopilotChat({ language, onActionApproved }) {
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      role: 'assistant',
      message: 'Namaste Ramesh ji! 🙏 Main aapka Paytm Saathi AI hoon. Pichle hafte se aapki sales 14% kam hui hai, khaaskar shaam 5 se 8 baje ke dauraan. Aap mujhse pooch sakte hain: "Meri sales pichle week se kam kyun hai?" ya "Kya karna chahiye?"',
      timestamp: '12:00 PM',
      action_card: null
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [suggestedChips, setSuggestedChips] = useState([
    'Meri sales pichle week se kam kyun hai?',
    'Kya karna chahiye?',
    'Meri sales aaj kaisi rahi?',
    'Stock kab khatam hoga?'
  ]);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = language === 'hindi' ? 'hi-IN' : 'en-IN';

      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      recog.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
    }
  }, [language]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting speech recog:', err);
      }
    }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#🔍💡📊🚀🔊✅]/g, ''));
    utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customText = null) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      message: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const data = await sendCopilotMessage(textToSend, language);
      const assistantMsg = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        message: data.reply,
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action_card: data.action_card
      };
      setMessages((prev) => [...prev, assistantMsg]);
      if (data.suggested_chips && data.suggested_chips.length > 0) {
        setSuggestedChips(data.suggested_chips);
      }
    } catch (err) {
      console.error('Copilot send error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          message: 'Kshama karein, abhi connection mein samasya aayi. Kripya punah prayas karein.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAction = async (card) => {
    try {
      // Trigger confetti animation
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      const res = await executeAction({
        action_type: card.action_type || 'DISCOUNT_CAMPAIGN',
        title: card.title,
        description: card.description,
        target_audience: 'Inactive Customers (14+ Days)',
        payload: {
          coupon_code: card.coupon_code || 'COMEBACK20',
          discount_amount: card.discount_amount || 20,
          target_count: card.target_count || 42
        },
        approved_by: 'Merchant (Ramesh Sharma)'
      });

      // Add execution confirmation card to chat
      const confirmationMsg = {
        id: `exec-${Date.now()}`,
        role: 'assistant',
        message: `✅ Shandar! Aapka anurodh safaltapoorvak execute ho gaya hai.\n\n` +
          `• Action: ${card.title}\n` +
          `• Discount Code: ${card.coupon_code || 'COMEBACK20'}\n` +
          `• Target Audience: 42 Inactive repeat customers ko SMS aur WhatsApp bhej diya gaya hai.\n\n` +
          `Aap 'Action Center' tab mein iski live verification aur recovered sales dekh sakte hain.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action_card: {
          type: 'ACTION_EXECUTED',
          action_id: res.action_id,
          title: card.title,
          status: 'ACTIVE',
          coupon_code: card.coupon_code || 'COMEBACK20',
          reach_count: card.target_count || 42
        }
      };

      setMessages((prev) => [...prev, confirmationMsg]);
      setSuggestedChips(['Result verify karo', 'Meri sales aaj kaisi rahi?', 'Inventory status']);
      if (onActionApproved) onActionApproved(res);
    } catch (err) {
      console.error('Action approval error:', err);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr',
      height: 'calc(100vh - 230px)',
      minHeight: 580,
      background: 'rgba(16, 25, 45, 0.85)',
      backdropFilter: 'blur(20px)',
      borderRadius: 16,
      border: '1px solid var(--border-subtle)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Copilot Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(0, 41, 112, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #00BAF2 0%, #002970 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(0, 186, 242, 0.4)'
          }}>
            <Bot size={22} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Saathi AI Copilot</h3>
              <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Active & Ready</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Understands Hindi, Hinglish & English • Controlled Tool Calling
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Mode: Autonomous Assistant with Merchant Authorization
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: 6
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.72rem',
                color: 'var(--text-muted)'
              }}>
                {isUser ? (
                  <>
                    <span>You (Merchant)</span>
                    <Clock size={12} />
                    <span>{m.timestamp}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} color="var(--paytm-cyan)" />
                    <span style={{ color: 'var(--paytm-cyan)', fontWeight: 600 }}>Saathi Copilot</span>
                    <Clock size={12} />
                    <span>{m.timestamp}</span>
                  </>
                )}
              </div>

              <div style={{
                maxWidth: '82%',
                padding: '14px 18px',
                borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: isUser
                  ? 'linear-gradient(135deg, #002970 0%, #0047BA 100%)'
                  : 'rgba(21, 34, 60, 0.95)',
                border: `1px solid ${isUser ? 'rgba(0, 186, 242, 0.3)' : 'var(--border-subtle)'}`,
                color: '#FFFFFF',
                fontSize: '0.92rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
                boxShadow: isUser ? '0 4px 16px rgba(0, 41, 112, 0.4)' : 'none',
                position: 'relative'
              }}>
                {m.message}

                {/* TTS Speaker icon on assistant replies */}
                {!isUser && (
                  <button
                    onClick={() => speakText(m.message)}
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: 'none',
                      borderRadius: '50%',
                      width: 26,
                      height: 26,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--text-secondary)'
                    }}
                    title="Read Aloud"
                  >
                    {isSpeaking ? <VolumeX size={14} color="#F43F5E" /> : <Volume2 size={14} color="var(--paytm-cyan)" />}
                  </button>
                )}
              </div>

              {/* Action Proposal Card (Slide 5 & 8) */}
              {m.action_card && m.action_card.type === 'ACTION_PROPOSAL' && (
                <div style={{
                  maxWidth: '82%',
                  marginTop: 6,
                  padding: '16px 18px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(0, 186, 242, 0.12) 0%, rgba(0, 41, 112, 0.3) 100%)',
                  border: '1px solid rgba(0, 186, 242, 0.4)',
                  boxShadow: '0 8px 24px rgba(0, 186, 242, 0.15)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                      Recommended Action
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-green)' }}>
                      {m.action_card.potential_gain}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: 4 }}>
                    {m.action_card.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                    {m.action_card.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                    paddingTop: 10,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Requires Human Approval • Controlled Execution
                    </div>

                    <button
                      onClick={() => handleApproveAction(m.action_card)}
                      className="btn-paytm"
                      style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                    >
                      <ShieldCheck size={16} />
                      <span>{m.action_card.button_label || 'Approve & Execute'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Executed Card */}
              {m.action_card && m.action_card.type === 'ACTION_EXECUTED' && (
                <div style={{
                  maxWidth: '82%',
                  marginTop: 6,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle2 size={20} color="#10B981" />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981' }}>
                        {m.action_card.title} — Active & Dispatched
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Coupon: <strong style={{ color: '#FFFFFF' }}>{m.action_card.coupon_code}</strong> • Reach: {m.action_card.reach_count} Merchants/Customers
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>
                    TRACKING LIVE
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            borderRadius: 14,
            background: 'rgba(21, 34, 60, 0.7)',
            maxWidth: 320,
            border: '1px solid var(--border-subtle)'
          }}>
            <Sparkles size={16} className="radar-ring" color="var(--paytm-cyan)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Saathi data analyse kar raha hai...
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips (Slide 8 Demo Flow) */}
      <div style={{
        padding: '10px 20px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(16, 25, 45, 0.95)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        overflowX: 'auto'
      }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          Suggested:
        </span>
        {suggestedChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            disabled={loading}
            style={{
              padding: '5px 12px',
              borderRadius: 20,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(0, 186, 242, 0.25)',
              color: 'var(--paytm-cyan)',
              fontSize: '0.78rem',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(0, 186, 242, 0.15)';
              e.currentTarget.style.borderColor = 'var(--paytm-cyan)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(0, 186, 242, 0.25)';
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form with Voice Mic */}
      <div style={{
        padding: '14px 20px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(8, 13, 26, 0.95)',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
        {/* Voice Input Mic Button */}
        <button
          onClick={toggleMic}
          type="button"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: `1px solid ${isListening ? '#F43F5E' : 'var(--border-subtle)'}`,
            background: isListening ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            color: isListening ? '#F43F5E' : 'var(--paytm-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isListening ? '0 0 16px rgba(244, 63, 94, 0.4)' : 'none'
          }}
          title={isListening ? 'Listening... Click to stop' : 'Click to speak in Hindi/English'}
        >
          {isListening ? <MicOff size={20} className="pulse-active" /> : <Mic size={20} />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isListening ? 'Sun raha hoon... Boliye...' : 'Poochiye: "Meri sales aaj kaisi rahi?" ya type karein...'}
          style={{
            flex: 1,
            padding: '12px 18px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12,
            color: '#FFFFFF',
            fontSize: '0.92rem',
            outline: 'none',
            fontFamily: 'var(--font-body)'
          }}
        />

        {/* Send Button */}
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputValue.trim()}
          className="btn-paytm"
          style={{
            height: 44,
            padding: '0 20px',
            opacity: !inputValue.trim() || loading ? 0.5 : 1
          }}
        >
          <Send size={18} />
          <span>Bhejo</span>
        </button>
      </div>
    </div>
  );
}
