'use client';

import { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Loader2
} from 'lucide-react';
import { leadsApi } from '@/lib/api';

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await leadsApi.getAll();
        setLeads(response.data);
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => 
    lead.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
        <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads by name, email or phone..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Lead</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Score</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Source</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Added Date</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600">
                        {lead.first_name?.[0] || 'L'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{lead.first_name} {lead.last_name}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Mail className="h-3 w-3" />
                          <span>{lead.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${
                      lead.status === 'qualified' ? 'bg-green-50 text-green-700 border-green-100' :
                      lead.status === 'disqualified' ? 'bg-red-50 text-red-700 border-red-100' :
                      'bg-gray-50 text-gray-700 border-gray-100'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-16 rounded-full bg-gray-100 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            (lead.lead_score || 0) >= 80 ? 'bg-green-500' :
                            (lead.lead_score || 0) >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${lead.lead_score || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">{lead.lead_score || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lead.source || 'Direct'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button className="text-gray-400 hover:text-blue-600">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-blue-600">
                        <Calendar className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

