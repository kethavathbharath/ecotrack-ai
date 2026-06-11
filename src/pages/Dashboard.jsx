/**
 * Dashboard Page – EcoTrack AI
 * Overview of footprint, score, trend, and recommendations summary
 */

import React from 'react';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus, ArrowRight, Leaf, Zap, Car, Trash } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { EcoScoreRing, StatCard, EmptyState, ScoreBadge } from '../components/ui/UIComponents';
import { formatCO2, getScoreCategory, getGoalProgress } from '../utils/calculations';

const PIE_COLORS = ['#60a5fa', '#fbbf24', '#a78bfa', '#f87171'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card-strong p-3 text-xs">
        <p className="text-white/60 mb-1">{label}</p>
        <p className="text-eco-300 font-semibold">{formatCO2(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard({ history, lastCalc, goal, prediction, onNavigate }) {
  if (!lastCalc && history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          icon="📊"
          title="No data yet"
          description="Calculate your first carbon footprint to see your dashboard."
          action="Start Calculating"
          onAction={() => onNavigate('calculator')}
        />
      </div>
    );
  }

  const current = lastCalc || history[0];
  const cat = getScoreCategory(current.ecoScore);
  const goalProgress = goal ? getGoalProgress(current.total, goal.target) : null;

  // Chart data: last 6 entries, oldest first
  const chartData = history.slice(0, 6).reverse().map((h, i) => ({
    name: format(new Date(h.timestamp), 'dd MMM'),
    total: h.total,
    score: h.ecoScore,
  }));

  // Pie data
  const pieData = [
    { name: 'Transport',   value: current.transport   || 0 },
    { name: 'Electricity', value: current.electricity || 0 },
    { name: 'Food',        value: current.food        || 0 },
    { name: 'Plastic',     value: current.plastic     || 0 },
  ].filter(d => d.value > 0);

  // Trend vs previous entry
  const prev = history[1];
  const trendPct = prev ? parseFloat(((current.total - prev.total) / prev.total * 100).toFixed(1)) : 0;
  const TrendIcon = trendPct > 0 ? TrendingUp : trendPct < 0 ? TrendingDown : Minus;
  const trendColor = trendPct > 0 ? '#f87171' : trendPct < 0 ? '#4ade80' : '#94a3b8';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fade-up">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="section-sub">Your sustainability overview at a glance</p>
        </div>
        <div className="text-xs text-white/30">
          Last updated: {format(new Date(current.timestamp), 'dd MMM, hh:mm a')}
        </div>
      </div>

      {/* ── Top Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card col-span-2 sm:col-span-1 lg:col-span-1">
          <p className="text-xs text-white/40 uppercase tracking-wide">Total CO₂</p>
          <p className="text-3xl font-bold font-display text-white">{formatCO2(current.total)}</p>
          <div className="flex items-center gap-1 text-xs" style={{ color: trendColor }}>
            <TrendIcon size={12} />
            <span>{trendPct > 0 ? '+' : ''}{trendPct}% vs last</span>
          </div>
        </div>
        <div className="stat-card">
          <p className="text-xs text-white/40 uppercase tracking-wide">Transport</p>
          <p className="text-2xl font-bold font-display text-blue-300">{formatCO2(current.transport)}</p>
          <p className="text-xs text-white/30">🚗 🚌 🚲</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-white/40 uppercase tracking-wide">Electricity</p>
          <p className="text-2xl font-bold font-display text-yellow-300">{formatCO2(current.electricity)}</p>
          <p className="text-xs text-white/30">⚡ kWh usage</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-white/40 uppercase tracking-wide">Food + Waste</p>
          <p className="text-2xl font-bold font-display text-purple-300">{formatCO2((current.food || 0) + (current.plastic || 0))}</p>
          <p className="text-xs text-white/30">🍽️ ♻️</p>
        </div>
      </div>

      {/* ── Score + Breakdown ── */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Eco Score Card */}
        <div className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6">
          <EcoScoreRing score={current.ecoScore} size={140} />
          <div className="flex-1">
            <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Eco Score</p>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-4"
              style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}30` }}
            >
              {cat.label}
            </div>
            <div className="space-y-2 text-sm text-white/50">
              <p>🏆 81–100: Eco Champion</p>
              <p>🌿 61–80:  Good</p>
              <p>⚠️  31–60:  Moderate</p>
              <p>🔥 0–30:   High Impact</p>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-6">
          <p className="text-sm font-semibold text-white/70 mb-4">Emission Sources</p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Legend
                  formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{value}</span>}
                />
                <Tooltip
                  content={({ active, payload }) => active && payload?.[0] ? (
                    <div className="glass-card-strong px-3 py-2 text-xs">
                      <p style={{ color: payload[0].payload.fill }}>{payload[0].name}: {formatCO2(payload[0].value)}</p>
                    </div>
                  ) : null}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-white/25 text-sm">No data</div>
          )}
        </div>
      </div>

      {/* ── Trend Chart ── */}
      {chartData.length > 1 && (
        <div className="glass-card p-6">
          <p className="text-sm font-semibold text-white/70 mb-5">Monthly Footprint Trend</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} width={55} tickFormatter={v => `${v}kg`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: '#22c55e', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Goal + Prediction ── */}
      <div className="grid sm:grid-cols-2 gap-5">
        {/* Goal */}
        <div className="glass-card p-6">
          <p className="text-sm font-semibold text-white/70 mb-4">🎯 Goal Progress</p>
          {goal ? (
            <>
              <div className="flex justify-between text-xs text-white/40 mb-2">
                <span>Current: {formatCO2(current.total)}</span>
                <span>Target: {formatCO2(goal.target)}</span>
              </div>
              <div className="h-3 rounded-full bg-white/6 overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, goalProgress)}%`, background: 'linear-gradient(90deg, #22c55e, #4ade80)', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }}
                />
              </div>
              <p className="text-xs text-eco-300">{goalProgress}% toward your goal</p>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-white/35 text-sm mb-3">No goal set yet</p>
              <button onClick={() => onNavigate('goals')} className="eco-btn-outline text-xs">Set a Goal</button>
            </div>
          )}
        </div>

        {/* Prediction */}
        <div className="glass-card p-6">
          <p className="text-sm font-semibold text-white/70 mb-4">🔮 AI Prediction</p>
          {prediction ? (
            <>
              <p className="text-3xl font-bold font-display text-eco-300 mb-1">
                {formatCO2(prediction.predicted)}
              </p>
              <p className="text-xs text-white/40 mb-3">Estimated next month</p>
              <div className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border ${
                prediction.trend === 'increasing' ? 'text-red-300 bg-red-500/10 border-red-500/20' :
                prediction.trend === 'decreasing' ? 'text-eco-300 bg-eco-500/10 border-eco-500/20' :
                'text-yellow-300 bg-yellow-500/10 border-yellow-500/20'
              }`}>
                {prediction.trend === 'increasing' ? '📈 Increasing' : prediction.trend === 'decreasing' ? '📉 Decreasing' : '➡️ Stable'} trend
              </div>
            </>
          ) : (
            <p className="text-white/35 text-sm">Need 2+ calculations for prediction</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: '🧮 New Calculation', page: 'calculator' },
          { label: '🤖 AI Insights',     page: 'ai' },
          { label: '📊 Analytics',       page: 'analytics' },
          { label: '🏅 Challenges',      page: 'challenges' },
        ].map(({ label, page }) => (
          <button key={page} onClick={() => onNavigate(page)} className="eco-btn-outline text-xs">
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
