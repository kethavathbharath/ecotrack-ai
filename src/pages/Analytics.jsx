/**
 * Analytics Page – EcoTrack AI
 * Charts showing emission breakdowns, historical trends, and goal progress
 */

import React from 'react';
import { format } from 'date-fns';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, LineChart, Line, AreaChart, Area, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell,
} from 'recharts';
import { EmptyState } from '../components/ui/UIComponents';
import { formatCO2, getGoalProgress } from '../utils/calculations';

const COLORS = { transport: '#60a5fa', electricity: '#fbbf24', food: '#a78bfa', plastic: '#f87171' };
const CATEGORY_LABELS = { transport: 'Transport', electricity: 'Electricity', food: 'Food', plastic: 'Plastic' };

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-strong p-3 text-xs space-y-1 min-w-[140px]">
      <p className="text-white/50 font-medium mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {CATEGORY_LABELS[p.dataKey] || p.dataKey}: {formatCO2(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Analytics({ history, goal, lastCalc }) {

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          icon="📊"
          title="No data to analyze"
          description="Complete your first carbon footprint calculation to see analytics and charts."
        />
      </div>
    );
  }

  // Prepare chronological chart data (oldest first, max 10)
  const chronological = history.slice(0, 10).reverse().map((h) => ({
    name: format(new Date(h.timestamp), 'dd MMM'),
    transport:   parseFloat((h.transport   || 0).toFixed(1)),
    electricity: parseFloat((h.electricity || 0).toFixed(1)),
    food:        parseFloat((h.food        || 0).toFixed(1)),
    plastic:     parseFloat((h.plastic     || 0).toFixed(1)),
    total:       parseFloat((h.total       || 0).toFixed(1)),
    score:       h.ecoScore || 0,
  }));

  // Latest breakdown for radar/bar
  const latest = history[0];
  const total = latest.total || 1;
  const breakdownPct = [
    { subject: 'Transport',   value: Math.round((latest.transport / total) * 100) },
    { subject: 'Electricity', value: Math.round((latest.electricity / total) * 100) },
    { subject: 'Food',        value: Math.round((latest.food / total) * 100) },
    { subject: 'Plastic',     value: Math.round((latest.plastic / total) * 100) },
  ];

  // Average per category
  const avgTransport   = history.reduce((s, h) => s + (h.transport || 0), 0)   / history.length;
  const avgElectricity = history.reduce((s, h) => s + (h.electricity || 0), 0) / history.length;
  const avgFood        = history.reduce((s, h) => s + (h.food || 0), 0)        / history.length;
  const avgPlastic     = history.reduce((s, h) => s + (h.plastic || 0), 0)     / history.length;

  const avgData = [
    { name: 'Transport',   value: parseFloat(avgTransport.toFixed(1)),   fill: COLORS.transport },
    { name: 'Electricity', value: parseFloat(avgElectricity.toFixed(1)), fill: COLORS.electricity },
    { name: 'Food',        value: parseFloat(avgFood.toFixed(1)),        fill: COLORS.food },
    { name: 'Plastic',     value: parseFloat(avgPlastic.toFixed(1)),     fill: COLORS.plastic },
  ];

  const goalProgress = goal && lastCalc ? getGoalProgress(lastCalc.total, goal.target) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-up space-y-6">

      {/* Header */}
      <div>
        <h1 className="section-title">Analytics</h1>
        <p className="section-sub">Visual breakdown of your carbon footprint data</p>
      </div>

      {/* ── Summary Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Avg Transport',   val: formatCO2(avgTransport),   color: COLORS.transport },
          { label: 'Avg Electricity', val: formatCO2(avgElectricity), color: COLORS.electricity },
          { label: 'Avg Food',        val: formatCO2(avgFood),        color: COLORS.food },
          { label: 'Avg Plastic',     val: formatCO2(avgPlastic),     color: COLORS.plastic },
        ].map(({ label, val, color }) => (
          <div key={label} className="glass-card p-4">
            <div className="w-3 h-3 rounded-full mb-2" style={{ background: color }} />
            <p className="text-lg font-bold font-display" style={{ color }}>{val}</p>
            <p className="text-xs text-white/40 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Stacked Bar: Breakdown Over Time ── */}
      {chronological.length > 1 && (
        <div className="glass-card p-6">
          <p className="text-sm font-semibold text-white/70 mb-5">Emission Breakdown Over Time</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chronological} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}kg`} />
              <Tooltip content={<ChartTooltip />} />
              <Legend formatter={v => <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{CATEGORY_LABELS[v] || v}</span>} />
              <Bar dataKey="transport"   fill={COLORS.transport}   stackId="a" radius={[0,0,4,4]} />
              <Bar dataKey="electricity" fill={COLORS.electricity} stackId="a" />
              <Bar dataKey="food"        fill={COLORS.food}        stackId="a" />
              <Bar dataKey="plastic"     fill={COLORS.plastic}     stackId="a" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Line: Eco Score & Total Trend ── */}
      {chronological.length > 1 && (
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Total trend area */}
          <div className="glass-card p-6">
            <p className="text-sm font-semibold text-white/70 mb-5">Total CO₂ Trend</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chronological}>
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} width={45} tickFormatter={v => `${v}`} />
                <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                  <div className="glass-card-strong px-3 py-2 text-xs">
                    <p className="text-white/50">{label}</p>
                    <p className="text-eco-300">{formatCO2(payload[0].value)}</p>
                  </div>
                ) : null} />
                <Area type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} fill="url(#totalGrad)" dot={{ fill: '#22c55e', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Eco score line */}
          <div className="glass-card p-6">
            <p className="text-sm font-semibold text-white/70 mb-5">Eco Score Trend</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chronological}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                  <div className="glass-card-strong px-3 py-2 text-xs">
                    <p className="text-white/50">{label}</p>
                    <p className="text-eco-300">Score: {payload[0].value}</p>
                  </div>
                ) : null} />
                <Line type="monotone" dataKey="score" stroke="#fbbf24" strokeWidth={2} dot={{ fill: '#fbbf24', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Avg Category Bar ── */}
      <div className="glass-card p-6">
        <p className="text-sm font-semibold text-white/70 mb-5">Average Emissions by Category</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={avgData} layout="vertical" barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}kg`} />
            <YAxis dataKey="name" type="category" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip content={({ active, payload }) => active && payload?.length ? (
              <div className="glass-card-strong px-3 py-2 text-xs">
                <p style={{ color: payload[0].payload.fill }}>{payload[0].name}: {formatCO2(payload[0].value)}</p>
              </div>
            ) : null} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {avgData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Goal Progress ── */}
      {goal && goalProgress !== null && (
        <div className="glass-card p-6">
          <p className="text-sm font-semibold text-white/70 mb-4">Goal Progress: {goal.name}</p>
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Current: {formatCO2(lastCalc.total)}</span>
            <span>Target: {formatCO2(goal.target)}</span>
          </div>
          <div className="h-3 rounded-full bg-white/6 overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, goalProgress)}%`, background: 'linear-gradient(90deg, #22c55e, #4ade80)', boxShadow: '0 0 8px rgba(34,197,94,0.4)' }}
            />
          </div>
          <p className="text-xs text-eco-300">{goalProgress}% progress toward your goal</p>
        </div>
      )}
    </div>
  );
}
