import React from 'react';
import { Home, Package, DollarSign, BookOpen, FileText, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'sales', label: 'Sales', icon: DollarSign },
  { id: 'shipments', label: 'Khata Book', icon: BookOpen },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export default function Sidebar({ session, activeView, onViewChange, isOpen, onClose }) {
  const Icon = ({ icon: IconComponent }) => <IconComponent className="h-5 w-5" />;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-screen bg-slate-800/95 backdrop-blur-xl border-r border-slate-700 shadow-2xl flex flex-col w-72 z-50 transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {session.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-lg text-white">{session.name}</div>
              <div className="text-xs text-slate-400">LPG Management</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {NAV_ITEMS.map(item => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                      : 'text-slate-300 hover:bg-slate-700/70 hover:text-white'
                  }`}
                >
                  <Icon icon={item.icon} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

       