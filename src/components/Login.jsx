import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, LogIn, Flame, Store, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Login({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  
  // Shared & Form state fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Signup state fields
  const [shopName, setShopName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Feedback status
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError('Please enter your credentials');
      return;
    }
    setIsLoading(true);
    setError('');

    // Transform username into Supabase email format automatically
    const email = username.includes('@') ? username.trim() : `${username.trim().toLowerCase()}@smartlpg.com`;

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        setError(authError.message === 'Invalid login credentials' ? 'Invalid username or password' : authError.message);
        setIsLoading(false);
      } else {
        setError('');
        if (onLoginSuccess) onLoginSuccess();
      }
    } catch (err) {
      setError('System connection error. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!shopName.trim() || !username.trim() || !password || !confirmPassword) {
      setError('Please fill in all signup fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters for safety');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    // Format username to standard smartlpg system email format
    const email = `${username.trim().toLowerCase()}@smartlpg.com`;

    try {
      // 1. Sign up user via Supabase auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
        return;
      }

      if (data && data.user) {
        // 2. Create profile row in shops table
        const { error: profileError } = await supabase
          .from('shops')
          .insert({
            id: data.user.id,
            name: shopName.trim(),
            owner_name: '',
            phone: '',
            address: '',
            per_kg_rate: 0
          });

        if (profileError) {
          setError(`Profile Error: ${profileError.message}`);
          setIsLoading(false);
          return;
        }

        // 3. Create default cylinder stock item in inventory table
        const { error: inventoryError } = await supabase
          .from('inventory')
          .insert({
            shop_id: data.user.id,
            cylinder_type: '45kg',
            filled: 10,
            empty: 0
          });

        if (inventoryError) {
          setError(`Inventory Initialization Error: ${inventoryError.message}`);
          setIsLoading(false);
          return;
        }

        setError('');
        setSuccess('Account registered successfully! Redirecting...');
        
        setTimeout(() => {
          setIsLoading(false);
          if (onLoginSuccess) onLoginSuccess();
        }, 1000);
      } else {
        setError('Verification link pending or registration failed.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Signup server failure. Please try again.');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (activeTab === 'login') handleLogin();
      else handleSignUp();
    }
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

      {/* Auth card */}
      <div className="relative w-full max-w-md animate-fade-in-up z-10">

        {/* Card wrapper */}
        <div className="relative overflow-hidden border animate-scale-up"
          style={{
            background: '#ffffff',
            borderColor: '#cbd5e1',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 10px 20px -8px rgba(0, 0, 0, 0.06)'
          }}>

          {/* Top brand accent bar */}
          <div className="h-1.5 w-full" style={{ background: '#4f46e5' }} />

          <div className="p-7 sm:p-9">
            {/* Logo + branding */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-2">
                <div className="relative w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: '#4f46e5', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)' }}>
                  <Flame className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mb-0.5">Smart LPG</h1>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Management System</p>
            </div>

            {/* Sliding Tab Toggle Bar */}
            <div className="flex bg-slate-100 p-1 mb-6 border" style={{ borderRadius: '14px' }}>
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 text-xs font-bold transition-all duration-150 active:scale-95 ${
                  activeTab === 'login' ? 'text-indigo-600 bg-white shadow-sm border border-slate-200' : 'text-slate-500'
                }`}
                style={{ borderRadius: '10px' }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('signup'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 text-xs font-bold transition-all duration-150 active:scale-95 ${
                  activeTab === 'signup' ? 'text-indigo-600 bg-white shadow-sm border border-slate-200' : 'text-slate-500'
                }`}
                style={{ borderRadius: '10px' }}
              >
                Create Account
              </button>
            </div>

            {/* Success state block */}
            {success && (
              <div className="mb-5 flex items-center gap-3 px-4 py-3 animate-fade-in"
                style={{ background: '#d1fae5', border: '1px solid #a7f3d0', borderRadius: '14px' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#10b981' }}>
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-semibold text-emerald-800">{success}</span>
              </div>
            )}

            {/* Error state block */}
            {error && (
              <div className="mb-5 flex items-center gap-3 px-4 py-3 animate-shake"
                style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '14px' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#ef4444' }}>
                  <Lock className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-red-700">{error}</span>
              </div>
            )}

            {/* Tab: SIGN IN Form */}
            {activeTab === 'login' ? (
              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2 tracking-wider">
                    Username
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      style={{ width: '18px', height: '18px' }} />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your username"
                      className="w-full pl-10 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-150"
                      style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px' }}
                      onFocus={e => {
                        e.target.style.borderColor = '#4f46e5';
                        e.target.style.background = '#f5f3ff';
                        e.target.style.boxShadow = '0 0 0 1px #4f46e5';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = '#cbd5e1';
                        e.target.style.background = '#f8fafc';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
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
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-150"
                      style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px' }}
                      onFocus={e => {
                        e.target.style.borderColor = '#4f46e5';
                        e.target.style.background = '#f5f3ff';
                        e.target.style.boxShadow = '0 0 0 1px #4f46e5';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = '#cbd5e1';
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

                {/* Submit button */}
                <button
                  id="login-btn"
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full py-3.5 mt-2 font-bold text-white text-sm transition-all duration-150 disabled:opacity-60 hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2 animate-pulse-subtle"
                  style={{ background: '#4f46e5', borderRadius: '14px' }}
                >
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
                </button>
              </div>
            ) : (
              /* Tab: CREATE ACCOUNT Form */
              <div className="space-y-4">
                {/* Shop Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2 tracking-wider">
                    LPG Shop Name
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      style={{ width: '18px', height: '18px' }} />
                    <input
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="e.g. Mashallah Gas Co."
                      className="w-full pl-10 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-150"
                      style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px' }}
                      onFocus={e => {
                        e.target.style.borderColor = '#4f46e5';
                        e.target.style.background = '#f5f3ff';
                        e.target.style.boxShadow = '0 0 0 1px #4f46e5';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = '#cbd5e1';
                        e.target.style.background = '#f8fafc';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2 tracking-wider">
                    Select Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      style={{ width: '18px', height: '18px' }} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Choose username"
                      className="w-full pl-10 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-150"
                      style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px' }}
                      onFocus={e => {
                        e.target.style.borderColor = '#4f46e5';
                        e.target.style.background = '#f5f3ff';
                        e.target.style.boxShadow = '0 0 0 1px #4f46e5';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = '#cbd5e1';
                        e.target.style.background = '#f8fafc';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2 tracking-wider">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      style={{ width: '18px', height: '18px' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-12 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-150"
                      style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px' }}
                      onFocus={e => {
                        e.target.style.borderColor = '#4f46e5';
                        e.target.style.background = '#f5f3ff';
                        e.target.style.boxShadow = '0 0 0 1px #4f46e5';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = '#cbd5e1';
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2 tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      style={{ width: '18px', height: '18px' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Repeat password"
                      className="w-full pl-10 pr-12 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-150"
                      style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px' }}
                      onFocus={e => {
                        e.target.style.borderColor = '#4f46e5';
                        e.target.style.background = '#f5f3ff';
                        e.target.style.boxShadow = '0 0 0 1px #4f46e5';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = '#cbd5e1';
                        e.target.style.background = '#f8fafc';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Submit Signup Button */}
                <button
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className="w-full py-3.5 mt-2 font-bold text-white text-sm transition-all duration-150 disabled:opacity-60 hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2"
                  style={{ background: '#4f46e5', borderRadius: '14px' }}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Sign Up & Log In
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer copyright */}
        <p className="text-center mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          Smart LPG Store &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}