import React from 'react';
import { Home, Package, DollarSign, BookOpen, FileText, Settings, X, Flame, Zap } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',    icon: Home,       color: '#4f46e5' }, /* Premium Indigo */
  { id: 'inventory',  label: 'Inventory',   icon: Package,    color: '#059669' }, /* Emerald Green */
  { id: 'sales',      label: 'Sales',       icon: DollarSign, color: '#6d28d9' }, /* Premium Violet */
  { id: 'shipments',  label: 'Khata Book',  icon: BookOpen,   color: '#db2777' }, /* Rose Pink */
  { id: 'reports',    label: 'Reports',     icon: FileText,   color: '#d97706' }, /* Amber */
  { id: 'settings',   label: 'Settings',    icon: Settings,   color: '#475569' }, /* Slate Gray */
];

export default function Sidebar({ session, activeView, onViewChange, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden animate-fade-in"
          style={{ background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed left-0 top-0 h-screen flex flex-col w-[268px] z-50
          transform transition-transform duration-300 ease-out
          lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5"
          style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div className="flex items-center gap-3">
            {/* Logo icon (Solid brand color, no gradient) */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: '#4f46e5', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)' }}>
                <Flame className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <div className="font-bold text-[15px] text-slate-900 leading-tight tracking-tight">
                {session.name}
              </div>
              <div className="text-[11px] font-semibold mt-0.5"
                style={{ color: '#4f46e5' }}>
                LPG Management
              </div>
            </div>
          </div>

          {/* Close button (mobile) */}
          <button
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
            style={{ background: '#f1f5f9', color: '#475569' }}
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav label */}
        <div className="px-5 pt-5 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Navigation</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-3 overflow-y-auto space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onViewChange(item.id); onClose(); }}
                className={`nav-item w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive 
                    ? 'active bg-indigo-50 text-indigo-600 border border-indigo-100' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150"
                  style={{
                    background: isActive ? '#e0e7ff' : '#f8fafc',
                  }}>
                  <Icon className="w-4 h-4 transition-all" style={{ color: isActive ? '#4f46e5' : '#64748b' }} />
                </div>
                <span className="flex-1 text-sm font-semibold transition-all">
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#4f46e5' }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-5" style={{ borderTop: '1px solid #f1f5f9' }} />

        {/* Footer */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border"
            style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <Zap className="w-4 h-4 flex-shrink-0 text-indigo-600" />
            <div>
              <div className="text-[11px] font-bold text-slate-800">Smart LPG</div>
              <div className="text-[10px] font-medium text-slate-500">Version 1.0</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
