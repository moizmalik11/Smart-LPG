import React from 'react';
import { Menu, LogOut, Settings, Bell, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar({ session, onMenuToggle, onLogout, onSettingsClick }) {
  const initials = session.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 py-3"
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          id="mobile-menu-btn"
          className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 hover:bg-slate-100"
          style={{ border: '1px solid #e2e8f0', color: '#1e293b' }}
          onClick={onMenuToggle}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title */}
        <div className="hidden lg:block">
          <h1 className="text-base font-bold text-slate-900 leading-tight tracking-tight">
            {session.name}
          </h1>
          <p className="text-[11px] font-semibold" style={{ color: '#4f46e5' }}>
            Smart LPG Management
          </p>
        </div>

        {/* Mobile: show shop name */}
        <div className="lg:hidden">
          <span className="text-sm font-bold text-slate-900">{session.name}</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 hover:bg-slate-100"
          style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all duration-150 border"
              style={{
                background: '#ffffff',
                borderColor: '#cbd5e1',
                borderRadius: '12px',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
            >
              {/* Avatar (Indigo solid) */}
              <div className="w-8 h-8 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: '#4f46e5', borderRadius: '50%' }}>
                {initials}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-slate-800">{session.name}</span>
              <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-52 animate-scale-in"
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              borderRadius: '0.75rem',
              padding: '0.25rem',
            }}
          >
            <DropdownMenuLabel className="px-2 py-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: '#4f46e5', borderRadius: '50%' }}>
                  {initials}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">{session.name}</div>
                  <div className="text-[10px] font-semibold text-slate-400 mt-0.5">Administrator</div>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-slate-100 my-1" />

            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all"
              onClick={onSettingsClick}
            >
              <Settings className="mr-2.5 h-4 w-4 text-indigo-600" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-100 my-1" />

            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
              onClick={onLogout}
            >
              <LogOut className="mr-2.5 h-4 w-4 text-red-500" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
