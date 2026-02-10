import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('lpg_logged_in', 'true');
        }
      } catch (e) {
        console.error('localStorage error:', e);
      }
      setError('');
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setError('Invalid username or password');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl -top-48 -left-48 animate-blob"></div>
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl -bottom-48 -right-48 animate-blob animation-delay-2000"></div>
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-4000"></div>
        <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-pink-500/25 to-rose-500/25 rounded-full blur-3xl top-1/4 right-1/4 animate-blob animation-delay-6000"></div>
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/20 rounded-full animate-float"
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md animate-slide-up">
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-3xl blur-2xl opacity-75 animate-gradient"></div>
        
        <div className="relative bg-white/10 backdrop-blur-3xl border border-white/30 rounded-3xl shadow-2xl p-8 hover:shadow-purple-500/30 transition-all duration-500 hover:scale-[1.01] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:via-white/5 before:to-transparent before:pointer-events-none">
          {/* Logo/Header */}
          <div className="text-center mb-10 relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-2xl mb-5 shadow-2xl shadow-purple-500/60 animate-float-slow relative before:absolute before:-inset-1 before:bg-gradient-to-br before:from-purple-500 before:via-pink-500 before:to-blue-500 before:rounded-2xl before:blur-md before:opacity-50 before:animate-pulse">
              <Lock className="w-12 h-12 text-white drop-shadow-2xl relative z-10" />
            </div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-3 drop-shadow-2xl tracking-tight">Welcome Back</h1>
            <p className="text-purple-200/90 text-lg font-medium">Sign in to access your dashboard</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            {error && (
              <div className="bg-gradient-to-r from-red-500/30 to-pink-500/30 backdrop-blur-xl border border-red-400/60 text-red-100 px-5 py-4 rounded-2xl text-sm shadow-2xl animate-shake relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent"></div>
                <span className="flex items-center gap-3 relative z-10">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">{error}</span>
                </span>
              </div>
            )}

            {/* Username Input */}
            <div className="relative z-10 group">
              <label className="block text-sm font-bold text-white/95 mb-3 tracking-wide">
                Username
              </label>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition duration-300"></div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-purple-300 group-focus-within:text-purple-200 transition-all duration-300 group-focus-within:scale-110" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl text-white placeholder-purple-200/60 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all shadow-xl hover:shadow-2xl hover:bg-white/15"
                    placeholder="Enter your username"
                  />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="relative z-10 group">
              <label className="block text-sm font-bold text-white/95 mb-3 tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition duration-300"></div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-purple-300 group-focus-within:text-purple-200 transition-all duration-300 group-focus-within:scale-110" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-14 py-4 bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl text-white placeholder-purple-200/60 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all shadow-xl hover:shadow-2xl hover:bg-white/15"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-300 hover:text-purple-100 transition-all duration-300 hover:scale-110"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm relative z-10">
              <label className="flex items-center text-white/90 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/40 bg-white/10 text-purple-500 focus:ring-2 focus:ring-purple-400 focus:ring-offset-0 cursor-pointer transition-all" />
                <span className="ml-3 group-hover:text-white transition-all font-medium">Remember me</span>
              </label>
              <a href="#" className="text-purple-300 hover:text-purple-100 transition-all font-semibold hover:underline underline-offset-2">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <div className="relative z-10 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 group-hover:blur-lg"></div>
              <button
                onClick={handleLogin}
                className="relative w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-bold py-5 rounded-2xl shadow-2xl shadow-purple-500/50 transition-all transform hover:scale-[1.02] hover:shadow-purple-500/70 active:scale-95 backdrop-blur-sm border border-white/30"
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-lg tracking-wide">Sign In</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="relative z-10 text-center text-sm text-purple-200/80 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-center gap-2 mb-3">
                <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-bold text-white/95 text-base tracking-wide">Demo Credentials</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-white/80">Username:</span>
                  <span className="text-purple-300 font-bold bg-white/10 px-3 py-1 rounded-lg">admin</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-white/80">Password:</span>
                  <span className="text-pink-300 font-bold bg-white/10 px-3 py-1 rounded-lg">admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}