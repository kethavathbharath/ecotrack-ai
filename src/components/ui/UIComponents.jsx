/**
 * Reusable UI Components for EcoTrack AI
 */

import React from 'react';

// ── Loading Spinner ───────────────────────────────────────────────────────────
export function Spinner({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-10 h-10 border-3', lg: 'w-16 h-16 border-4' };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} border-eco-500/20 border-t-eco-500 rounded-full animate-spin`} />
      {text && <p className="text-sm text-eco-300/60 animate-pulse">{text}</p>}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, unit, icon: Icon, color = '#22c55e', trend, className = '' }) {
  return (
    <div className={`stat-card animate-fade-up ${className}`}>
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          {typeof Icon === 'string' ? Icon : <Icon size={20} style={{ color }} />}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold ${trend > 0 ? 'text-red-400' : 'text-eco-400'}`}>
            {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white font-display">
          {value}
          {unit && <span className="text-sm font-normal text-white/40 ml-1">{unit}</span>}
        </p>
        <p className="text-xs text-white/40 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ── Eco Score Ring ────────────────────────────────────────────────────────────
export function EcoScoreRing({ score, size = 160, strokeWidth = 10 }) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - score) / 100) * circumference;

  const getColor = (s) => {
    if (s >= 81) return '#22c55e';
    if (s >= 61) return '#4ade80';
    if (s >= 31) return '#fbbf24';
    return '#f87171';
  };

  const color = getColor(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold font-display" style={{ color }}>{score}</span>
        <span className="text-xs text-white/40">/ 100</span>
      </div>
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = '#22c55e', showLabel = true, height = 8 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div>
      {showLabel && (
        <div className="flex justify-between text-xs text-white/40 mb-1.5">
          <span>{value} kg</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className="rounded-full bg-white/6 overflow-hidden" style={{ height }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}aa, ${color})`, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
    </div>
  );
}

// ── Alert Banner ──────────────────────────────────────────────────────────────
export function AlertBanner({ type = 'info', message, onClose }) {
  const styles = {
    info:    { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', text: '#93c5fd', icon: 'ℹ️' },
    success: { bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)',  text: '#86efac', icon: '✅' },
    warning: { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', text: '#fcd34d', icon: '⚠️' },
    error:   { bg: 'rgba(248,113,113,0.1)',border: 'rgba(248,113,113,0.3)',text: '#fca5a5', icon: '❌' },
  };
  const s = styles[type];
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl text-sm border"
      style={{ background: s.bg, borderColor: s.border, color: s.text }}
    >
      <span className="text-base flex-shrink-0">{s.icon}</span>
      <p className="flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">✕</button>
      )}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon = '🌿', title, description, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="text-5xl opacity-60">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-white/80 mb-1">{title}</h3>
        <p className="text-sm text-white/40 max-w-xs">{description}</p>
      </div>
      {action && onAction && (
        <button onClick={onAction} className="eco-btn mt-2">{action}</button>
      )}
    </div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
export function Tooltip({ children, text }) {
  return (
    <div className="relative group inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg text-xs text-white/90 bg-gray-900 border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action, onAction }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-sub">{subtitle}</p>}
      </div>
      {action && onAction && (
        <button onClick={onAction} className="eco-btn-outline text-xs">{action}</button>
      )}
    </div>
  );
}

// ── Score Badge ───────────────────────────────────────────────────────────────
export function ScoreBadge({ score }) {
  if (score >= 81) return <span className="badge-green badge">🏆 Eco Champion</span>;
  if (score >= 61) return <span className="badge bg-eco-500/15 text-eco-300 border border-eco-500/25">🌿 Good</span>;
  if (score >= 31) return <span className="badge-yellow badge">⚠️ Moderate</span>;
  return <span className="badge-red badge">🔥 High Impact</span>;
}
