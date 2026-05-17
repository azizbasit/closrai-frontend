'use client';

import { useEffect, useState } from 'react';
import { 
  Plus, 
  Bot, 
  Cpu, 
  Mic, 
  Settings,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Loader2
} from 'lucide-react';
import { agentsApi } from '@/lib/api';

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await agentsApi.getAll();
        setAgents(response.data);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

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
        <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
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
              <button className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors border-r border-gray-100">
                Training
              </button>
              <button className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors">
                Configure
              </button>
            </div>
          </div>
        ))}

        {/* Create New Placeholder */}
        <button className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-6 hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
          <div className="rounded-full bg-gray-50 p-3 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors mb-3">
            <Plus className="h-8 w-8" />
          </div>
          <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Add New Agent</p>
          <p className="text-xs text-gray-400 mt-1">Deploy a new AI personality</p>
        </button>
      </div>
    </div>
  );
}

