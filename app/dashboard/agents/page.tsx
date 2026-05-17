'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Bot, 
  Cpu, 
  Mic, 
  Settings,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Loader2,
  BookOpen
} from 'lucide-react';
import { v1Api } from '@/lib/api';

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', personality: '', system_prompt: '', is_active: true });
  const [adding, setAdding] = useState(false);

  const fetchAgents = async () => {
    try {
      const response = await v1Api.agents.getAll();
      setAgents(response.data);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await v1Api.agents.create(newAgent);
      await fetchAgents();
      setShowAddModal(false);
      setNewAgent({ name: '', personality: '', system_prompt: '', is_active: true });
    } catch (error) {
      console.error('Failed to add agent:', error);
    } finally {
      setAdding(false);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">AI Sales Agents</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Agent</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {agents.map((agent) => (
          <div key={agent.id} className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${agent.is_active ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                  <Bot className="h-6 w-6" />
                </div>
                <button className={`text-2xl ${agent.is_active ? 'text-blue-500' : 'text-gray-300'}`}>
                  {agent.is_active ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">{agent.name}</h3>
              <p className="text-sm text-gray-500 mb-4 truncate">{agent.personality}</p>
              
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex items-center text-sm text-gray-600">
                  <Mic className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{agent.voice_id || 'Default Voice'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Cpu className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{agent.provider || 'AI Provider'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ShieldCheck className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Model: {agent.model || 'gpt-4o'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex border-t border-gray-50 bg-gray-50/50">
              <Link 
                href={`/dashboard/agents/${agent.id}/knowledge`}
                className="flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors border-r border-gray-100"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Knowledge
              </Link>
              <Link 
                href={`/dashboard/agents/${agent.id}/configure`}
                className="flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Link>
            </div>
          </div>
        ))}

        {/* Create New Placeholder */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-6 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
        >
          <div className="rounded-full bg-gray-50 p-3 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors mb-3">
            <Plus className="h-8 w-8" />
          </div>
          <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Add New Agent</p>
          <p className="text-xs text-gray-400 mt-1">Deploy a new AI personality</p>
        </button>
      </div>

      {/* Add Agent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create AI Agent</h3>
              <p className="text-sm text-gray-500 mb-8">Deploy a new AI personality to handle your calls.</p>
              
              <form onSubmit={handleAddAgent} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Agent Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Sales Closer Pro"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Personality Summary</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Professional and persuasive"
                    value={newAgent.personality}
                    onChange={(e) => setNewAgent({...newAgent, personality: e.target.value})}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Initial System Prompt</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Define how the agent should behave..."
                    value={newAgent.system_prompt}
                    onChange={(e) => setNewAgent({...newAgent, system_prompt: e.target.value})}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={adding}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {adding && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>{adding ? 'Creating...' : 'Create Agent'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

