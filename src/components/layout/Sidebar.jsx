/**
 * Sidebar Navigation Component
 */

import React, { useState } from 'react';
import {
  LayoutDashboard, Calculator, Leaf, History, Target,
  Trophy, BarChart2, Brain, Sun, Moon, Menu, X,
  TreePine, Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'landing',     label: 'Home',          icon: Leaf },
  { id: 'dashboard',   label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'calculator',  label: 'Calculator',    icon: Calculator },
  { id: 'history',     label: 'History',       icon: History },
  { id: 'goals',       label: 'Goals',         icon: Target },
  { id: 'challenges',  label: 'Challenges',    icon: Trophy },
  { id: 'analytics',   label: 'Analytics',     icon: BarChart2 },
  { id: 'ai',          label: 'AI Insights',   icon: Brain },
];

export default function Sidebar({ activePage, onNavigate, isDark, onToggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-eco-500 to-eco-700 flex items-center justify-center shadow-lg shadow-eco-900/50">
          <TreePine size={20} className="text-white" />
        </div>
        <div>
          <p className="font-display font-bold text-white text-sm leading-none">EcoTrack AI</p>
          <p className="text-[10px] text-eco-400/70 mt-0.5">Carbon Awareness</p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleNav(id)}
            className={`nav-item w-full text-left ${activePage === id ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
            {id === 'ai' && (
              <span className="ml-auto">
                <Sparkles size={12} className="text-eco-400" />
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Controls */}
      <div className="px-3 py-4 border-t border-white/8 space-y-2">
        <button
          onClick={onToggleTheme}
          className="nav-item w-full text-left"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <div className="px-4 py-2">
          <p className="text-[10px] text-white/20">v1.0.0 · EcoTrack AI</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 w-10 h-10 glass-card flex items-center justify-center text-eco-400"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 z-30 border-r border-white/8 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'rgba(3,15,7,0.97)', backdropFilter: 'blur(20px)' }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-white/40 hover:text-white/80"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 h-screen fixed left-0 top-0 border-r border-white/8 z-20"
        style={{ background: 'rgba(3,15,7,0.95)', backdropFilter: 'blur(20px)' }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
