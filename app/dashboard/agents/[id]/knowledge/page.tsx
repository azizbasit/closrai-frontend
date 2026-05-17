'use client';

import { useEffect, useState, use } from 'react';
import { 
  FileText, 
  Globe, 
  File, 
  Plus, 
  Trash2, 
  Loader2,
  ChevronLeft,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { v1Api } from '@/lib/api';

export default function AgentKnowledgePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [agent, setAgent] = useState<any>(null);
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKb, setNewKb] = useState({ title: '', content_type: 'text', content: '' });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentRes, kbRes] = await Promise.all([
          v1Api.agents.getOne(id),
          v1Api.agents.getKnowledge(id)
        ]);
        setAgent(agentRes.data);
        setKnowledge(kbRes.data);
      } catch (error) {
        console.error('Failed to fetch agent knowledge:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const response = await v1Api.agents.addKnowledge(id, newKb);
      setKnowledge([...knowledge, response.data]);
      setShowAddModal(false);
      setNewKb({ title: '', content_type: 'text', content: '' });
    } catch (error) {
      console.error('Failed to add knowledge:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (kbId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await v1Api.agents.deleteKnowledge(kbId);
      setKnowledge(knowledge.filter(k => k.id !== kbId));
    } catch (error) {
      console.error('Failed to delete knowledge:', error);
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
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Link 
          href="/dashboard/agents" 
          className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{agent?.name} - Knowledge Base</h1>
          <p className="text-sm text-gray-500">Manage the documents and data your AI agent uses to learn.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Status Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Training Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Documents</span>
                <span className="font-bold text-gray-900">{knowledge.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Size</span>
                <span className="font-bold text-gray-900">1.2 MB</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="inline-flex items-center text-green-600 font-bold">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  Synced
                </span>
              </div>
            </div>
            <button className="w-full mt-6 bg-blue-50 text-blue-600 font-bold py-2.5 rounded-xl hover:bg-blue-100 transition-all text-sm">
              Re-sync Agent
            </button>
          </div>

          <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-xl shadow-blue-100">
            <h3 className="font-bold mb-2">How it works</h3>
            <p className="text-xs opacity-80 leading-relaxed">
              AI agents use RAG (Retrieval-Augmented Generation) to search through these documents during calls. The more detailed your knowledge base, the better your agent performs.
            </p>
          </div>
        </div>

        {/* Documents List */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Documents</h3>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Document</span>
            </button>
          </div>

          <div className="space-y-3">
            {knowledge.length > 0 ? (
              knowledge.map((doc) => (
                <div key={doc.id} className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 bg-gray-50 rounded-lg text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                      {doc.content_type === 'pdf' ? <File className="h-5 w-5" /> : 
                       doc.content_type === 'url' ? <Globe className="h-5 w-5" /> : 
                       <FileText className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{doc.title}</h4>
                      <p className="text-[10px] text-gray-500 uppercase font-medium tracking-wider">{doc.content_type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border-2 border-dashed border-gray-100 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-300" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">No documents yet</h4>
                <p className="text-sm text-gray-500 mb-6">Add documents to help your agent learn about your business.</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Upload your first document
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Add Knowledge</h3>
              <p className="text-sm text-gray-500 mb-8">Choose how you want to add information to your agent.</p>
              
              <form onSubmit={handleAdd} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g., Pricing Guide 2024"
                    value={newKb.title}
                    onChange={(e) => setNewKb({...newKb, title: e.target.value})}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Content Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['text', 'url', 'pdf'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewKb({...newKb, content_type: type})}
                        className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                          newKb.content_type === type 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                            : 'bg-white text-gray-600 border-gray-100 hover:border-blue-200'
                        }`}
                      >
                        {type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {newKb.content_type === 'url' ? 'Website URL' : newKb.content_type === 'pdf' ? 'File Upload' : 'Text Content'}
                  </label>
                  {newKb.content_type === 'pdf' ? (
                    <div className="border-2 border-dashed border-gray-100 rounded-xl p-8 text-center hover:border-blue-200 transition-all cursor-pointer">
                      <p className="text-sm text-gray-500">Click to upload PDF or drag and drop</p>
                    </div>
                  ) : (
                    <textarea 
                      required
                      placeholder={newKb.content_type === 'url' ? 'https://example.com/pricing' : 'Paste your business info here...'}
                      rows={4}
                      value={newKb.content}
                      onChange={(e) => setNewKb({...newKb, content: e.target.value})}
                      className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  )}
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
                    <span>{adding ? 'Adding...' : 'Add Knowledge'}</span>
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
