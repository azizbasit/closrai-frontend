'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { PublicRoute } from '@/components/AuthWrapper';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    business_name: '',
    business_website: '',
    industry: '',
    phone_number: '',
  });
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Register your Business
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Get started with ClosrAI for your company. Already have an account?{' '}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <Alert message={error} type="error" onClose={clearError} />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-700 uppercase tracking-wider border-b pb-1">Personal Details</p>
                <Input
                  label="Full Name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
                <Input
                  label="Password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  required
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-700 uppercase tracking-wider border-b pb-1">Business Details</p>
                <Input
                  label="Business Name"
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  placeholder="ClosrAI Corp"
                />
                <Input
                  label="Business Website"
                  type="url"
                  value={formData.business_website}
                  onChange={(e) => setFormData({ ...formData, business_website: e.target.value })}
                  placeholder="https://example.com"
                />
                <Input
                  label="Industry"
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="SaaS / Real Estate"
                />
                <Input
                  label="Phone Number"
                  type="text"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Business Account
            </Button>
          </form>
        </div>
      </div>
    </PublicRoute>
  );
}
