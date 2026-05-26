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
      style={{ background: '#f1f5f9' }}>

      {/* Grid pattern (Subtle slate grid) */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(15,23,42,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

      {/* Login card */}
      <div className="relative w-full max-w-md animate-fade-in-up z-10">

        {/* Card */}
        <div className="relative rounded-2xl overflow-hidden border"
          style={{
            background: '#ffffff',
            borderColor: '#e2e8f0',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>

          {/* Top accent bar (Solid Indigo brand accent) */}
          <div className="h-1.5 w-full" style={{ background: '#4f46e5' }} />

          <div className="p-8 sm:p-10">
            {/* Logo + branding */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-3">
                <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: '#4f46e5', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)' }}>
                  <Flame className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-0.5">Smart LPG</h1>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Management System</p>
            </div>

            {/* Welcome text */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Welcome back</h2>
              <p className="text-xs font-semibold text-slate-400">Sign in to access your dashboard</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl animate-shake"
                style={{ background: '#fee2e2', border: '1px solid #fca5a5' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#ef4444' }}>
                  <Lock className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-red-700">{error}</span>
              </div>
            )}

            {/* Username field */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2 tracking-wider">
                  Username
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 text-slate-400"
                    style={{ width: '18px', height: '18px' }} />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter username"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-150"
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                    }}
                    onFocus={e => {
                      e.target.style.border = '1px solid #4f46e5';
                      e.target.style.background = '#f5f3ff';
                      e.target.style.boxShadow = '0 0 0 1px #4f46e5';
                    }}
                    onBlur={e => {
                      e.target.style.border = '1px solid #cbd5e1';
                      e.target.style.background = '#f8fafc';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2 tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    style={{ width: '18px', height: '18px' }} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-150"
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                    }}
                    onFocus={e => {
                      e.target.style.border = '1px solid #4f46e5';
                      e.target.style.background = '#f5f3ff';
                      e.target.style.boxShadow = '0 0 0 1px #4f46e5';
                    }}
                    onBlur={e => {
                      e.target.style.border = '1px solid #cbd5e1';
                      e.target.style.background = '#f8fafc';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-all duration-150 text-slate-400 hover:text-indigo-600"
                  >
                    {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Sign in button */}
            <button
              id="login-btn"
              onClick={handleLogin}
              disabled={isLoading}
              className="relative w-full py-3.5 rounded-xl font-bold text-white text-sm overflow-hidden transition-all duration-150 disabled:opacity-60 hover:bg-indigo-700 shadow-sm"
              style={{
                background: '#4f46e5',
              }}
            >
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
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
            <div className="mt-6 p-4 rounded-xl text-center border"
              style={{ background: '#f5f3ff', borderColor: '#e0e7ff' }}>
              <p className="text-[10px] font-bold mb-2 uppercase tracking-widest text-indigo-500">Demo Credentials</p>
              <div className="flex items-center justify-center gap-5">
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3 text-indigo-500" />
                  <code className="text-xs font-bold text-slate-800">admin</code>
                </div>
                <div className="w-px h-4 bg-indigo-200" />
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-indigo-500" />
                  <code className="text-xs font-bold text-slate-800">admin</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          Smart LPG Store &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}