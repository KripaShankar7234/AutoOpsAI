import React, { useState } from 'react';
import axios from 'axios';
import { Send, Bot, TerminalSquare } from 'lucide-react';


const API_BASE = 'http://localhost:5000/api';

export default function ManagerChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your AI Manager. Ask me anything about project tasks, overdues, or team workloads.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (overrideMsg = null) => {
    const userMsg = overrideMsg || input.trim();
    if (!userMsg) return;

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // Command interception
      let queryPayload = userMsg;
      if (userMsg.startsWith('/')) {
        if (userMsg.includes('analyze')) queryPayload = "Analyze this project in 2 sentences.";
        else if (userMsg.includes('risks')) queryPayload = "List all risks and their suggested actions.";
        else if (userMsg.includes('prioritize')) queryPayload = "What are the top 3 highest priority tasks right now?";
      }

      const res = await axios.post(`${API_BASE}/chat`, { query: queryPayload });
      const reply = res.data.reply || 'No direct reply received.';
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      const errMsg = err.response?.data?.error || 'Failed to reach backend API.';
      setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${errMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
      <div className="bg-brand-50 border-b border-brand-100 p-4 shrink-0">
        <h2 className="text-lg font-semibold text-brand-900 flex items-center gap-2">
          <Bot className="w-5 h-5 text-brand-600" />
          AI Manager Chat
        </h2>
        <p className="text-sm text-brand-700">Ask questions about your project status</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-brand-600 text-white rounded-br-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
            }`}>
              {typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 text-slate-500 rounded-lg rounded-bl-none p-3 text-sm shadow-sm flex items-center gap-2">
               <Bot className="w-4 h-4 animate-bounce" /> Analyzing project data...
            </div>
          </div>
        )}
      </div>

      {/* Command suggestion strip */}
      <div className="bg-slate-50 px-4 py-2 flex gap-2 border-t border-slate-200 overflow-x-auto no-scrollbar shrink-0">
         <button onClick={() => sendMessage('/analyze project')} className="shrink-0 flex items-center gap-1 text-xs bg-white text-slate-600 border border-slate-200 px-2 py-1 rounded hover:bg-brand-50 hover:text-brand-600 transition-colors">
            <TerminalSquare className="w-3 h-3"/> /analyze project
         </button>
         <button onClick={() => sendMessage('/show risks')} className="shrink-0 flex items-center gap-1 text-xs bg-white text-slate-600 border border-slate-200 px-2 py-1 rounded hover:bg-brand-50 hover:text-brand-600 transition-colors">
            <TerminalSquare className="w-3 h-3"/> /show risks
         </button>
         <button onClick={() => sendMessage('/prioritize tasks')} className="shrink-0 flex items-center gap-1 text-xs bg-white text-slate-600 border border-slate-200 px-2 py-1 rounded hover:bg-brand-50 hover:text-brand-600 transition-colors">
            <TerminalSquare className="w-3 h-3"/> /prioritize tasks
         </button>
      </div>

      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-sans"
            placeholder="e.g., Which tasks are overdue?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-brand-600 text-white rounded-md hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
