import React, { useState } from 'react';
import { aiApi, ChatMessage } from '../../api/ai';
import { Send, Bot, User, X } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

interface LearningAssistantProps {
  onClose: () => void;
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
    <div className="flex flex-col h-full bg-white border-l border-neutral-200">
      <div className="p-4 border-b border-neutral-200 flex justify-between items-center bg-primary-50">
        <div className="flex items-center gap-2 text-primary-700 font-semibold">
          <Bot size={20} />
          <span>AI Learning Assistant</span>
        </div>
        <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="text-center text-neutral-500 my-auto text-sm">
            <Bot size={32} className="mx-auto mb-2 text-primary-300" />
            <p>Hi! I'm your AI learning assistant. Ask me to explain a concept or summarize this material.</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              m.role === 'user' ? 'bg-primary-600 text-white' : 
              m.role === 'assistant' ? 'bg-green-600 text-white' : 'bg-neutral-200 text-neutral-600'
            }`}>
              {m.role === 'user' ? <User size={16} /> : m.role === 'assistant' ? <Bot size={16} /> : '!'}
            </div>
            <div className={`p-3 rounded-lg max-w-[80%] text-sm ${
              m.role === 'user' ? 'bg-primary-50 border border-primary-100 text-neutral-800' :
              m.role === 'assistant' ? 'bg-neutral-50 border border-neutral-200 text-neutral-800' : 'bg-red-50 text-red-800'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-500 text-sm flex items-center gap-2">
              <Spinner /> AI is thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-neutral-200">
        <div className="flex gap-2">
          <input 
            type="text" 
            className="flex-1 border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            placeholder="Ask a question..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
          <button 
            className="bg-primary-600 text-white rounded-md p-2 hover:bg-primary-700 disabled:opacity-50"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
