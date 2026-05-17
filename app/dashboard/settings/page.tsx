'use client';

import { useEffect, useState } from 'react';
import { 
  User, 
  Key, 
  Bell, 
  Shield, 
  Save,
  Loader2,
  CheckCircle2,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  AlertTriangle,
  Building2,
  Globe,
  Briefcase,
  Phone
} from 'lucide-react';
import { v1Api } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

const SUPPORTED_PROVIDERS = [
  { id: 'vapi', name: 'Vapi', url: 'https://dashboard.vapi.ai' },
  { id: 'openai', name: 'OpenAI', url: 'https://platform.openai.com/api-keys' },
  { id: 'elevenlabs', name: 'ElevenLabs', url: 'https://elevenlabs.io/app/settings/api-keys' },
  { id: 'deepgram', name: 'Deepgram', url: 'https://console.deepgram.com' },
  { id: 'anthropic', name: 'Anthropic', url: 'https://console.anthropic.com/settings/keys' },
];

export default function SettingsPage() {
  const [data, setData] = useState<any>(null);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Integration form state
  const [newIntegration, setNewIntegration] = useState({ provider: '', api_key: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  
  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [integrationToDelete, setIntegrationToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [profileRes, integrationsRes] = await Promise.all([
        v1Api.settings.getProfile(),
        v1Api.integrations.getAll()
      ]);
      setData(profileRes.data);
      setIntegrations(integrationsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setError('Failed to load settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await v1Api.settings.updateProfile(data.user);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIntegration.provider || !newIntegration.api_key) return;
    
    setSaving(true);
    setError('');
    try {
      await v1Api.integrations.create(newIntegration);
      await fetchSettings();
      setNewIntegration({ provider: '', api_key: '' });
      setShowAddForm(false);
      setMessage('Integration added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Failed to add integration:', error);
      setError(error.response?.data?.message || 'Failed to add integration.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (integration: any) => {
    setIntegrationToDelete(integration);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteIntegration = async () => {
    if (!integrationToDelete) return;
    
    setIsDeleting(true);
    try {
      await v1Api.integrations.delete(integrationToDelete.id);
      setIntegrations(integrations.filter(i => i.id !== integrationToDelete.id));
      setMessage('Integration deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
      setIsDeleteModalOpen(false);
      setIntegrationToDelete(null);
    } catch (error) {
      console.error('Failed to delete integration:', error);
      setError('Failed to delete integration.');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Business Profile', icon: Building2 },
    { id: 'api-keys', name: 'Integrations', icon: Key },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your business account and configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'text-gray-600 hover:bg-white hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {message && (
            <div className="bg-green-50 border-b border-green-100 p-4 flex items-center text-green-700 text-sm">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-b border-red-100 p-4 flex items-center text-red-700 text-sm">
              <div className="h-4 w-4 mr-2 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px]">!</div>
              {error}
            </div>
          )}

          <div className="p-8">
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-8">
                {/* Personal Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase">Full Name</label>
                      <input 
                        type="text" 
                        value={data?.user?.name || ''} 
                        onChange={(e) => setData({...data, user: {...data.user, name: e.target.value}})}
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase">Email Address</label>
                      <input 
                        type="email" 
                        value={data?.user?.email || ''} 
                        onChange={(e) => setData({...data, user: {...data.user, email: e.target.value}})}
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Section */}
                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                    Business Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase">Business Name</label>
                      <input 
                        type="text" 
                        value={data?.user?.business_name || ''} 
                        onChange={(e) => setData({...data, user: {...data.user, business_name: e.target.value}})}
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase">Website</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                          type="url" 
                          value={data?.user?.business_website || ''} 
                          onChange={(e) => setData({...data, user: {...data.user, business_website: e.target.value}})}
                          className="w-full rounded-xl border border-gray-200 p-3 pl-10 text-sm focus:border-blue-500 focus:outline-none"
                          placeholder="https://"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase">Industry</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                          type="text" 
                          value={data?.user?.industry || ''} 
                          onChange={(e) => setData({...data, user: {...data.user, industry: e.target.value}})}
                          className="w-full rounded-xl border border-gray-200 p-3 pl-10 text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                          type="text" 
                          value={data?.user?.phone_number || ''} 
                          onChange={(e) => setData({...data, user: {...data.user, phone_number: e.target.value}})}
                          className="w-full rounded-xl border border-gray-200 p-3 pl-10 text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex justify-end">
                  <button 
                    type="submit"
                    disabled={saving}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span>Save Profile</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'api-keys' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Third-party Integrations</h3>
                  {SUPPORTED_PROVIDERS.length > integrations.length && (
                    <button 
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="flex items-center space-x-2 text-blue-600 text-sm font-bold hover:text-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add New</span>
                    </button>
                  )}
                </div>

                {showAddForm && (
                  <form onSubmit={handleAddIntegration} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase">Provider</label>
                        <select 
                          value={newIntegration.provider}
                          onChange={(e) => setNewIntegration({...newIntegration, provider: e.target.value})}
                          className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none bg-white"
                          required
                        >
                          <option value="">Select a provider</option>
                          {SUPPORTED_PROVIDERS
                            .filter(p => !integrations.some(i => i.provider === p.id))
                            .map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))
                          }
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase">API Key</label>
                        <input 
                          type="password"
                          value={newIntegration.api_key}
                          onChange={(e) => setNewIntegration({...newIntegration, api_key: e.target.value})}
                          placeholder="Enter your API key"
                          className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button 
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center"
                      >
                        {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Save Integration
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {integrations.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                      <p className="text-gray-500 text-sm">No integrations configured yet.</p>
                    </div>
                  ) : (
                    integrations.map((integration) => (
                      <div key={integration.id} className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between hover:border-blue-100 transition-colors">
                        <div className="flex items-center space-x-4 overflow-hidden">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold uppercase text-xs">
                            {integration.provider.substring(0, 2)}
                          </div>
                          <div className="overflow-hidden">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-bold text-gray-900 capitalize truncate">{integration.provider}</p>
                              {SUPPORTED_PROVIDERS.find(p => p.id === integration.provider)?.url && (
                                <a 
                                  href={SUPPORTED_PROVIDERS.find(p => p.id === integration.provider)?.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-blue-600 flex-shrink-0"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            <p className="text-xs font-mono text-gray-400 truncate">{integration.masked_key}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleDeleteClick(integration)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-4 bg-blue-50 rounded-xl text-blue-800 text-xs leading-relaxed">
                  <strong>Security Note:</strong> Your API keys are encrypted before storage and never sent to the browser. Only a masked version is shown for identification.
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                {Object.entries(data?.notifications || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-bold text-gray-900 capitalize">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-gray-500">Receive alerts via email for this activity.</p>
                    </div>
                    <button className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none" />
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-50">
                  <button className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteIntegration}
              isLoading={isDeleting}
            >
              Delete Integration
            </Button>
          </>
        }
      >
        <div className="flex items-center space-x-3 text-gray-600">
          <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Are you sure you want to delete this integration?</p>
            <p className="text-sm">
              This will permanently remove the <span className="font-bold capitalize">{integrationToDelete?.provider}</span> connection.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
