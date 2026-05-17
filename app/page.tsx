import Link from 'next/link';
import { Bot, Zap, Shield, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="text-2xl font-black text-blue-600 tracking-tighter">
          ClosrAI
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
          <Link 
            href="/dashboard" 
            className="rounded-full bg-blue-600 px-6 py-2.5 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Go to Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-20 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 mb-8">
            <Zap className="h-4 w-4" />
            <span>AI Sales Revolution is here</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8">
            Your AI Agent that <br />
            <span className="text-blue-600">Actually Closes.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Automate your entire sales funnel with AI that handles inbound calls, 
            qualifies leads, and books appointments 24/7.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto rounded-xl bg-gray-900 px-8 py-4 text-lg font-bold text-white hover:bg-gray-800 transition-all shadow-xl"
            >
              Start Free Trial
            </Link>
            <button className="w-full sm:w-auto rounded-xl border border-gray-200 px-8 py-4 text-lg font-bold text-gray-900 hover:bg-gray-50 transition-all">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="max-w-7xl mx-auto px-8 py-24 bg-gray-50/50 rounded-[3rem]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">AI Voice Agent</h3>
              <p className="text-gray-500 leading-relaxed">
                Natural-sounding AI that handles objections and talks just like a human sales rep.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-100">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Secure & Reliable</h3>
              <p className="text-gray-500 leading-relaxed">
                Enterprise-grade security with detailed logs and full control over agent knowledge.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-100">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Lead Intelligence</h3>
              <p className="text-gray-500 leading-relaxed">
                Automatically score leads based on conversation quality and booking probability.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© 2024 ClosrAI. All rights reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
            <a href="#" className="hover:text-gray-600">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
