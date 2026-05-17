'use client';

import { useEffect, useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  Phone, 
  Clock, 
  Play, 
  FileText,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { conversationsApi } from '@/lib/api';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await conversationsApi.getAll();
        setConversations(response.data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter(conv => 
    conv.lead?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lead?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.agent?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold text-gray-900">Conversations & Logs</h1>
        <div className="flex space-x-2">
          <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Export Logs
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-blue-600 p-4 text-white shadow-sm">
          <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Success Rate</p>
          <p className="text-2xl font-bold mt-1">94.2%</p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Duration</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">4:12</p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Talk Time</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">124h 30m</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 p-4 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <div key={conv.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${conv.type === 'call' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                      {conv.type === 'call' ? <Phone className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-gray-900">
                          {conv.lead?.first_name} {conv.lead?.last_name}
                        </h4>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{conv.agent?.name || 'AI Agent'}</span>
                      </div>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(conv.created_at).toLocaleString()}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="font-medium mr-1">Duration:</span>
                          {conv.duration || '0:00'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      conv.status === 'completed' ? 'bg-green-50 text-green-700' :
                      conv.status === 'ongoing' ? 'bg-blue-50 text-blue-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {conv.status}
                    </span>
                    
                    <div className="flex items-center space-x-2 border-l border-gray-100 pl-4">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Listen Recording">
                        <Play className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Transcript">
                        <FileText className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Open CRM">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">
              No conversations found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

