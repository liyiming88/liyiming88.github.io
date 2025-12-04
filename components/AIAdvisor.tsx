import React, { useState } from 'react';
import { UserProfile, FinancialGoal } from '../types';
import { generateFinancialAdvice } from '../services/geminiService';
import { MessageSquare, Send, Sparkles, Loader2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { THEME_COLOR } from '../constants';

interface AIAdvisorProps {
  user: UserProfile;
  goals: FinancialGoal[];
  isOpen: boolean;
  onClose: () => void;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ user, goals, isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse(null);
    const result = await generateFinancialAdvice(user, goals, query);
    setResponse(result);
    setLoading(false);
  };

  const handleQuickInsight = async () => {
    setLoading(true);
    setQuery("Give me a general assessment.");
    const result = await generateFinancialAdvice(user, goals);
    setResponse(result);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200 transform transition-transform duration-300 ease-in-out">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#f8fafc]">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-[#12805c] rounded-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-bold text-gray-800">PlanView Advisor</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-500">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {!response && !loading && (
          <div className="text-center py-10 space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 inline-block">
                <Sparkles className="w-8 h-8 text-[#12805c] mx-auto mb-2" />
                <p className="text-gray-600 text-sm">
                I can analyze your current plan and suggest improvements based on market data and your risk profile.
                </p>
            </div>
            <button 
                onClick={handleQuickInsight}
                className="text-sm font-medium text-[#12805c] hover:underline"
            >
                Generate Comprehensive Review
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <Loader2 className="w-8 h-8 text-[#12805c] animate-spin" />
            <p className="text-sm text-gray-500 animate-pulse">Analyzing portfolio...</p>
          </div>
        )}

        {response && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="prose prose-sm prose-emerald max-w-none text-gray-700">
                <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask about retirement, taxes, etc..."
            className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#12805c] focus:border-transparent text-sm"
          />
          <button
            onClick={handleAsk}
            disabled={!query.trim() || loading}
            className="absolute right-2 top-2 p-1.5 bg-[#12805c] text-white rounded-md disabled:opacity-50 hover:bg-[#0e6045] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
            AI generated content is for informational purposes only and does not constitute financial advice.
        </p>
      </div>
    </div>
  );
};

export default AIAdvisor;