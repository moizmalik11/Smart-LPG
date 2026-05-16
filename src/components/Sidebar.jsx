import React from 'react';
import { Home, Package, DollarSign, BookOpen, FileText, Settings, X, Flame, Zap } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',    icon: Home,       color: '#60a5fa' },
  { id: 'inventory',  label: 'Inventory',   icon: Package,    color: '#34d399' },
  { id: 'sales',      label: 'Sales',       icon: DollarSign, color: '#a78bfa' },
  { id: 'shipments',  label: 'Khata Book',  icon: BookOpen,   color: '#f472b6' },
  { id: 'reports',    label: 'Reports',     icon: FileText,   color: '#fbbf24' },
  { id: 'settings',   label: 'Settings',    icon: Settings,   color: '#94a3b8' },
];

export default function Sidebar({ session, activeView, onViewChange, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden animate-fade-in"
          style={{ background: 'rgba(4,6,20,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed left-0 top-0 h-screen flex flex-col w-[268px] z-50
          transform transition-transform duration-300 ease-out
          lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          background: 'linear-gradient(180deg, rgba(15,10,40,0.98) 0%, rgba(10,7,30,0.99) 100%)',
          backdropFilter: 'blur(32px) saturate(180%)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '4px 0 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            {/* Logo icon */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-xl blur-md"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.7), rgba(236,72,153,0.5))' }} />
              <div className="relative w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #be185d)' }}>
                <Flame className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <div className="font-bold text-[15px] text-white leading-tight tracking-tight"
                style={{ fontFamily: 'Outfit, sans-serif' }}>
                {session.name}
              </div>
              <div className="text-[11px] font-medium mt-0.5"
                style={{ color: 'rgba(139,92,246,0.8)' }}>
                LPG Management
              </div>
            </div>
          </div>

          {/* Close button (mobile) */}
          <button
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.7)' }}
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav label */}
        <div className="px-5 pt-5 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: 'rgba(100,116,139,0.7)' }}>Navigation</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-3 overflow-y-auto space-y-0.5">
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onViewChange(item.id); onClose(); }}
                className="nav-item w-full text-left"
                style={isActive ? {
                  background: `linear-gradient(135deg, ${item.color}22, ${item.color}12)`,
                  border: `1px solid ${item.color}33`,
                  color: '#fff',
                  boxShadow: `0 4px 16px ${item.color}20`,
                } : {}}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    background: isActive ? `${item.color}22` : 'rgba(255,255,255,0.05)',
                    boxShadow: isActive ? `0 0 12px ${item.color}40` : 'none',
                  }}>
                  <Icon className="w-4 h-4" style={{ color: isActive ? item.color : 'rgba(148,163,184,0.6)' }} />
                </div>
                <span className="flex-1 text-sm font-medium"
                  style={{ color: isActive ? '#fff' : 'rgba(148,163,184,0.75)' }}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: item.color }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

        {/* Footer */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <Zap className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(167,139,250,0.8)' }} />
            <div>
              <div className="text-[11px] font-bold text-purple-300">Smart LPG</div>
              <div className="text-[10px]" style={{ color: 'rgba(100,116,139,0.7)' }}>Version 1.0</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
