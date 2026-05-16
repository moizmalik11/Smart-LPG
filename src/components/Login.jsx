import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, LogIn, Flame } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      setError('Please enter your credentials');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        try {
          localStorage.setItem('lpg_logged_in', 'true');
        } catch (e) {
          console.error('localStorage error:', e);
        }
        setError('');
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError('Invalid username or password');
        setIsLoading(false);
      }
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #050510 0%, #0d0520 40%, #130824 70%, #050510 100%)' }}>

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full animate-blob"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)', top: '-15%', left: '-10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full animate-blob animation-delay-2000"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', bottom: '-15%', right: '-10%' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full animate-blob animation-delay-4000"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-md animate-fade-in-up z-10">

        {/* Outer glow ring */}
        <div className="absolute -inset-px rounded-3xl opacity-60"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.5), rgba(236,72,153,0.4), rgba(59,130,246,0.3))', filter: 'blur(12px)' }} />

        {/* Card */}
        <div className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04))',
            backdropFilter: 'blur(32px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}>

          {/* Top accent bar */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #3b82f6)' }} />

          <div className="p-8 sm:p-10">
            {/* Logo + branding */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="absolute inset-0 rounded-2xl blur-xl opacity-60"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }} />
                <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center animate-float-slow"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 8px 32px rgba(139,92,246,0.4)' }}>
                  <Flame className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Smart LPG</h1>
              <p className="text-sm font-medium" style={{ color: 'rgba(167,139,250,0.8)' }}>Management System</p>
            </div>

            {/* Welcome text */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-1">Welcome back</h2>
              <p className="text-sm" style={{ color: 'rgba(148,163,184,0.8)' }}>Sign in to access your dashboard</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl animate-shake"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(239,68,68,0.25)' }}>
                  <Lock className="w-3 h-3 text-red-400" />
                </div>
                <span className="text-sm font-medium text-red-300">{error}</span>
              </div>
            )}

            {/* Username field */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'rgba(203,213,225,0.9)' }}>
                  Username
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors duration-200"
                    style={{ color: 'rgba(148,163,184,0.6)', width: '18px', height: '18px' }} />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter username"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onFocus={e => {
                      e.target.style.border = '1px solid rgba(139,92,246,0.6)';
                      e.target.style.background = 'rgba(139,92,246,0.08)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)';
                    }}
                    onBlur={e => {
                      e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                      e.target.style.background = 'rgba(255,255,255,0.06)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'rgba(203,213,225,0.9)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'rgba(148,163,184,0.6)', width: '18px', height: '18px' }} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onFocus={e => {
                      e.target.style.border = '1px solid rgba(139,92,246,0.6)';
                      e.target.style.background = 'rgba(139,92,246,0.08)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)';
                    }}
                    onBlur={e => {
                      e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                      e.target.style.background = 'rgba(255,255,255,0.06)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
                    style={{ color: 'rgba(148,163,184,0.5)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(167,139,250,0.9)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(148,163,184,0.5)'}
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Sign in button */}
            <button
              id="login-btn"
              onClick={handleLogin}
              disabled={isLoading}
              className="relative w-full py-3.5 rounded-xl font-semibold text-white text-sm overflow-hidden group transition-all duration-200 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #be185d)',
                boxShadow: '0 8px 24px rgba(124,58,237,0.35)',
              }}
              onMouseEnter={e => !isLoading && (e.currentTarget.style.boxShadow = '0 12px 32px rgba(124,58,237,0.55)')}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,58,237,0.35)'}
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </span>
            </button>

            {/* Demo credentials */}
            <div className="mt-6 p-4 rounded-xl text-center"
              style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <p className="text-xs font-semibold mb-2.5 uppercase tracking-widest"
                style={{ color: 'rgba(167,139,250,0.7)' }}>Demo Credentials</p>
              <div className="flex items-center justify-center gap-5">
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3" style={{ color: 'rgba(167,139,250,0.8)' }} />
                  <code className="text-xs font-bold text-purple-300">admin</code>
                </div>
                <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3" style={{ color: 'rgba(236,72,153,0.8)' }} />
                  <code className="text-xs font-bold text-pink-300">admin</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center mt-6 text-xs" style={{ color: 'rgba(100,116,139,0.7)' }}>
          Smart LPG Store Management System &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}