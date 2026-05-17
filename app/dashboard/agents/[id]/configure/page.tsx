'use client';

import { useEffect, useState, use } from 'react';
import { 
  Bot, 
  Save, 
  Loader2, 
  ChevronLeft, 
  Mic, 
  Cpu, 
  MessageSquare,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { v1Api } from '@/lib/api';

export default function AgentConfigurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await v1Api.agents.getOne(id);
        setAgent(response.data);
      } catch (error) {
        console.error('Failed to fetch agent:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await v1Api.agents.update(id, agent);
      setMessage('Agent configuration saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save agent:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <Link 
          href="/dashboard/agents" 
          className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configure {agent?.name}</h1>
          <p className="text-sm text-gray-500">Fine-tune your AI agent's behavior and personality.</p>
        </div>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center text-green-700 text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Core Identity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-gray-900">Agent Identity</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Agent Name</label>
                <input 
                  required
                  type="text" 
                  value={agent?.name || ''} 
                  onChange={(e) => setAgent({...agent, name: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Personality Summary</label>
                <input 
                  type="text" 
                  placeholder="e.g. Professional, friendly, and persuasive"
                  value={agent?.personality || ''} 
                  onChange={(e) => setAgent({...agent, personality: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">System Prompt (The "Brain")</label>
              <textarea 
                rows={8}
                placeholder="You are a professional sales agent for ClosrAI. Your goal is to..."
                value={agent?.system_prompt || ''} 
                onChange={(e) => setAgent({...agent, system_prompt: e.target.value})}
                className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:border-blue-500 focus:outline-none font-mono"
              />
              <p className="text-[10px] text-gray-400">This is the core instruction set for the AI. Be specific about its role, tone, and goals.</p>
            </div>
          </div>
        </div>

        {/* Voice & Provider */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center space-x-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Mic className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-gray-900">Voice & Provider</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Voice ID (ElevenLabs)</label>
                <input 
                  type="text" 
                  placeholder="e.g. pMskz9dnLg7W9P0OBUMy"
                  value={agent?.voice_id || ''} 
                  onChange={(e) => setAgent({...agent, voice_id: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Status</label>
                <div className="flex items-center space-x-4 h-[46px]">
                  <button 
                    type="button"
                    onClick={() => setAgent({...agent, is_active: !agent.is_active})}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                      agent?.is_active 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${agent?.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-xs font-bold">{agent?.is_active ? 'Active' : 'Inactive'}</span>
                  </button>
                  <p className="text-[10px] text-gray-400">Toggle to enable or disable this agent in production.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center text-amber-600 bg-amber-50 px-4 py-2 rounded-lg text-xs font-medium border border-amber-100">
            <AlertCircle className="h-3.5 w-3.5 mr-2" />
            Changes will take effect immediately for new conversations.
          </div>
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
