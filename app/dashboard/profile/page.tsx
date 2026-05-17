'use client';

import { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Building2, 
  Save,
  Loader2,
  CheckCircle2,
  Camera
} from 'lucide-react';
import { v1Api } from '@/lib/api';

export default function ProfilePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await v1Api.settings.getProfile();
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await v1Api.settings.updateProfile(data.user);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-sm text-gray-500">Manage your personal information and public profile.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {message && (
          <div className="bg-green-50 border-b border-green-100 p-4 flex items-center text-green-700 text-sm">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {message}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="h-24 w-24 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-2xl border-2 border-dashed border-blue-200 group-hover:bg-blue-100 transition-colors">
                {data?.user?.name?.charAt(0) || 'U'}
              </div>
              <button 
                type="button"
                className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-600 hover:text-blue-600 transition-all"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Profile Picture</h3>
              <p className="text-sm text-gray-500">Click the icon to upload a new avatar.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>Full Name</span>
              </label>
              <input 
                type="text" 
                value={data?.user?.name || ''} 
                onChange={(e) => setData({...data, user: {...data.user, name: e.target.value}})}
                placeholder="John Doe"
                className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-50/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>Email Address</span>
              </label>
              <input 
                type="email" 
                value={data?.user?.email || ''} 
                onChange={(e) => setData({...data, user: {...data.user, email: e.target.value}})}
                placeholder="john@example.com"
                className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-50/50 transition-all"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span>Company Name</span>
              </label>
              <input 
                type="text" 
                value={data?.user?.company || ''} 
                onChange={(e) => setData({...data, user: {...data.user, company: e.target.value}})}
                placeholder="ClosrAI Inc."
                className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-50/50 transition-all"
              />
            </div>
          </div>

          <div className="pt-8 border-t border-gray-50 flex justify-end items-center space-x-4">
            <button 
              type="button"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
