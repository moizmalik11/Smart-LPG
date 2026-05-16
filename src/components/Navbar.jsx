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
        background: 'rgba(8,6,24,0.85)',
        backdropFilter: 'blur(24px) saturate(160%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          id="mobile-menu-btn"
          className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
          onClick={onMenuToggle}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title */}
        <div className="hidden lg:block">
          <h1 className="text-lg font-bold text-white leading-tight tracking-tight">
            {session.name}
          </h1>
          <p className="text-xs font-medium" style={{ color: 'rgba(139,92,246,0.8)' }}>
            Smart LPG Management
          </p>
        </div>

        {/* Mobile: show shop name */}
        <div className="lg:hidden">
          <span className="text-sm font-bold text-white">{session.name}</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notification bell placeholder */}
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(148,163,184,0.7)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.12)'; e.currentTarget.style.color = 'rgba(167,139,250,0.9)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(148,163,184,0.7)'; }}
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.10)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #be185d)' }}>
                {initials}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-white">{session.name}</span>
              <ChevronDown className="hidden sm:block w-3.5 h-3.5" style={{ color: 'rgba(148,163,184,0.6)' }} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-52 animate-scale-in"
            style={{
              background: 'rgba(15,11,40,0.97)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              borderRadius: '1rem',
            }}
          >
            <DropdownMenuLabel>
              <div className="flex items-center gap-2.5 py-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #be185d)' }}>
                  {initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{session.name}</div>
                  <div className="text-xs" style={{ color: 'rgba(100,116,139,0.8)' }}>Administrator</div>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator style={{ background: 'rgba(255,255,255,0.07)' }} />

            <DropdownMenuItem
              className="cursor-pointer rounded-lg mx-1 my-0.5 transition-all duration-150"
              style={{ color: 'rgba(148,163,184,0.85)' }}
              onClick={onSettingsClick}
            >
              <Settings className="mr-2.5 h-4 w-4" style={{ color: 'rgba(167,139,250,0.8)' }} />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator style={{ background: 'rgba(255,255,255,0.07)' }} />

            <DropdownMenuItem
              className="cursor-pointer rounded-lg mx-1 my-0.5 transition-all duration-150"
              style={{ color: 'rgba(248,113,113,0.85)' }}
              onClick={onLogout}
            >
              <LogOut className="mr-2.5 h-4 w-4 text-red-400" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
