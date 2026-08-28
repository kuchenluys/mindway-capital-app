import React from 'react';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-blue-500/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-blue-400">💎 Mindway Capital</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-4">
            Trading Inteligente con <span className="text-blue-400">IA</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Predicciones, análisis técnico y comunidad de traders en una plataforma
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition">
            Comenzar Gratis
          </button>
        </div>

        {/* Status Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Phase 1 */}
          <div className="bg-slate-800/50 border border-green-500/50 rounded-lg p-6">
            <h3 className="text-green-400 font-bold text-lg mb-2">✅ Phase 1</h3>
            <p className="text-gray-300 mb-3">QA Testing</p>
            <div className="text-sm text-gray-400">
              <p>✓ Backend: 100%</p>
              <p>✓ Frontend: 89%</p>
              <p>✓ Tests: 91% passing</p>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="bg-slate-800/50 border border-yellow-500/50 rounded-lg p-6">
            <h3 className="text-yellow-400 font-bold text-lg mb-2">⏳ Phase 2</h3>
            <p className="text-gray-300 mb-3">AWS Infrastructure</p>
            <div className="text-sm text-gray-400">
              <p>→ RDS PostgreSQL</p>
              <p>→ ElastiCache Redis</p>
              <p>→ EC2 Instances</p>
            </div>
          </div>

          {/* Launch */}
          <div className="bg-slate-800/50 border border-blue-500/50 rounded-lg p-6">
            <h3 className="text-blue-400 font-bold text-lg mb-2">🚀 Launch</h3>
            <p className="text-gray-300 mb-3">Week 4-5</p>
            <div className="text-sm text-gray-400">
              <p>→ Production deployment</p>
              <p>→ Go live</p>
              <p>→ Marketing launch</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-blue-400 mb-4">🎯 Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li>✓ AI Price Predictions</li>
              <li>✓ Trading Signals (BUY/SELL/HOLD)</li>
              <li>✓ Backtesting Engine</li>
              <li>✓ Real-time WebSocket Updates</li>
              <li>✓ TradingView Integration</li>
              <li>✓ Leaderboards & Gamification</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-blue-400 mb-4">📱 Platforms</h3>
            <ul className="space-y-2 text-gray-300">
              <li>✓ Web App (React 18)</li>
              <li>✓ iOS App (App Store)</li>
              <li>✓ Android App (Play Store)</li>
              <li>✓ REST API</li>
              <li>✓ WebSocket Real-time</li>
              <li>✓ Admin Dashboard</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-slate-700 text-center text-gray-400">
          <p>Mindway Capital v1.0.0 • Phase 1 Complete ✅ • Ready for Phase 2</p>
          <p className="mt-2 text-sm">Environment: Development | Status: Running ✅</p>
        </div>
      </main>
    </div>
  );
}
