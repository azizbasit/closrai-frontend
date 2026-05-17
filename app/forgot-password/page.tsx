'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { PublicRoute } from '@/components/AuthWrapper';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);
    try {
      await authApi.forgotPassword(email);
      setStatus({ type: 'success', message: 'If an account exists with that email, we have sent a reset link.' });
    } catch (error: any) {
      let message = 'Something went wrong. Please try again later.';
      if (error.response?.status === 404) {
        message = 'The password reset service is temporarily unavailable.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (!error.response) {
        message = 'Cannot connect to the server. Please check your connection.';
      }
      
      setStatus({ 
        type: 'error', 
        message: message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {status && <Alert message={status.message} type={status.type} onClose={() => setStatus(null)} />}
            
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Send reset link
            </Button>

            <div className="text-center">
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 text-sm">
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PublicRoute>
  );
}
