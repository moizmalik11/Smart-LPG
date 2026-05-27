import React from 'react';
import { Home, Package, DollarSign, BookOpen, FileText, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview',   label: 'Home',       icon: Home },
  { id: 'inventory',  label: 'Stock',      icon: Package },
  { id: 'sales',      label: 'Sales',       icon: DollarSign },
  { id: 'shipments',  label: 'Khata',      icon: BookOpen },
  { id: 'reports',    label: 'Reports',     icon: FileText },
  { id: 'settings',   label: 'Settings',    icon: Settings },
];

export default function BottomNav({ activeView, onViewChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 lg:hidden"
      style={{
        boxShadow: '0 -4px 16px rgba(0,0,0,0.04)',
        paddingBottom: 'safe-area-inset-bottom', /* Ensure iOS home indicator compatibility */
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="flex flex-col items-center justify-center flex-1 h-full py-1 relative transition-all duration-150 active:scale-95"
            >
              {/* Active top dot/bar */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 rounded-b bg-indigo-600 animate-fade-in" />
              )}
              
              <div className={`p-1.5 rounded-lg transition-all duration-150 ${
                isActive ? 'text-indigo-600' : 'text-slate-500'
              }`}>
                <Icon className="w-5.5 h-5.5" />
              </div>
              <span className={`text-[10px] font-bold tracking-tight mt-0.5 transition-all ${
                isActive ? 'text-indigo-600' : 'text-slate-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
