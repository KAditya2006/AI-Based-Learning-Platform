import React, { useState } from 'react';
import { aiApi, ChatMessage } from '../../api/ai';
import { Send, Bot, User, X, Sparkles } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';

interface LearningAssistantProps {
  onClose: () => void;
  standalone?: boolean;
}

export const LearningAssistant: React.FC<LearningAssistantProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await aiApi.chat(conversationId, userMsg);
      if (!conversationId) setConversationId(res.conversationId);
      setMessages(prev => [...prev, res.reply]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'system', content: 'Failed to connect to AI assistant.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-default)' }}>
      <div style={{
        padding: '16px', background: 'var(--ai-glow-subtle)', borderBottom: '1px solid var(--border-primary)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-lavender)', fontWeight: 600 }}>
          <Sparkles size={18} />
          <span>AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '4px' }}
        >
          <X size={18} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto 0', padding: '16px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent-lavender)'
            }}>
              <Bot size={24} />
            </div>
            <p style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: 500 }}>
              Hi! I'm your AI learning assistant.
            </p>
            <p style={{ fontSize: '13px', lineHeight: 1.5 }}>
              Ask me to explain a concept, summarize material, or generate practice questions based on this course.
            </p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: m.role === 'user' ? 'var(--primary-600)' : m.role === 'assistant' ? 'var(--accent-violet)' : 'var(--error-strong)',
              color: 'white'
            }}>
              {m.role === 'user' ? <User size={14} /> : m.role === 'assistant' ? <Bot size={14} /> : '!'}
            </div>
            <div style={{
              padding: '12px', borderRadius: '12px', maxWidth: '85%', fontSize: '14px', lineHeight: 1.5,
              borderTopRightRadius: m.role === 'user' ? '4px' : '12px',
              borderTopLeftRadius: m.role !== 'user' ? '4px' : '12px',
              background: m.role === 'user' ? 'var(--primary-50)' : m.role === 'assistant' ? 'var(--bg-elevated)' : 'var(--error-bg)',
              color: m.role === 'user' ? 'var(--primary-900)' : 'var(--text-primary)',
              border: `1px solid ${m.role === 'user' ? 'var(--primary-200)' : m.role === 'assistant' ? 'var(--border)' : 'var(--error-border)'}`
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-violet)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot size={14} />
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', borderTopLeftRadius: '4px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Spinner /> AI is thinking...
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid var(--border)', background: 'var(--bg-default)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            style={{
              flex: 1, padding: '10px 16px', borderRadius: '24px', border: '1px solid var(--border)', background: 'var(--bg-elevated)',
              fontSize: '14px', color: 'var(--text-primary)', outline: 'none'
            }}
            placeholder="Ask a question..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
          <button 
            style={{
              width: '40px', height: '40px', borderRadius: '50%', background: (loading || !input.trim()) ? 'var(--bg-elevated)' : 'var(--primary-600)',
              color: (loading || !input.trim()) ? 'var(--text-muted)' : 'white', border: (loading || !input.trim()) ? '1px solid var(--border)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer', transition: 'all 0.2s'
            }}
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            <Send size={16} style={{ marginLeft: '2px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};
