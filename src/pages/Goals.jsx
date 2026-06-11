/**
 * Goals Page – EcoTrack AI
 * Set and track carbon reduction targets
 */

import React, { useState } from 'react';
import { Target, CheckCircle, Edit3, Save } from 'lucide-react';
import { AlertBanner, ProgressBar } from '../components/ui/UIComponents';
import { formatCO2, getGoalProgress } from '../utils/calculations';

const PRESET_TARGETS = [
  { label: 'Eco Champion',  value: 80,  desc: 'Ultra-low carbon lifestyle', icon: '🏆' },
  { label: 'Good',          value: 150, desc: 'Well below global average',  icon: '🌿' },
  { label: 'Moderate',      value: 250, desc: 'Near the global average',    icon: '🎯' },
  { label: 'Starter Goal',  value: 350, desc: 'Reduce by 20% from avg',    icon: '🌱' },
];

export default function Goals({ goal, lastCalc, history, onUpdateGoal, onNavigate }) {
  const [editing,   setEditing]   = useState(!goal);
  const [targetVal, setTargetVal] = useState(goal?.target || '');
  const [name,      setName]      = useState(goal?.name || '');
  const [success,   setSuccess]   = useState('');
  const [error,     setError]     = useState('');

  const current = lastCalc || history[0];

  const handleSave = () => {
    const t = parseFloat(targetVal);
    if (isNaN(t) || t <= 0) { setError('Please enter a valid target (> 0 kg CO₂/month)'); return; }
    onUpdateGoal({ target: t, name: name || 'My Carbon Goal', createdAt: new Date().toISOString() });
    setEditing(false);
    setSuccess('Goal saved! Keep tracking to see your progress.');
    setError('');
  };

  const progress = goal && current ? getGoalProgress(current.total, goal.target) : 0;
  const diff = goal && current ? current.total - goal.target : null;
  const achieved = diff !== null && diff <= 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-up">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Carbon Reduction Goals</h1>
          <p className="section-sub">Set your target and track your progress</p>
        </div>
        {goal && !editing && (
          <button onClick={() => setEditing(true)} className="eco-btn-outline text-xs">
            <Edit3 size={14} /> Edit Goal
          </button>
        )}
      </div>

      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      {/* ── Progress Card ── */}
      {goal && current && !editing && (
        <div className="glass-card p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Goal</p>
              <p className="text-xl font-bold text-white">{goal.name}</p>
            </div>
            {achieved ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-eco-500/15 border border-eco-500/25 text-eco-300 text-sm font-semibold">
                <CheckCircle size={16} /> Achieved!
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold font-display text-white">{formatCO2(current.total)}</p>
              <p className="text-xs text-white/40">Current</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-display text-eco-300">{Math.round(progress)}%</p>
              <p className="text-xs text-white/40">Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-display text-white">{formatCO2(goal.target)}</p>
              <p className="text-xs text-white/40">Target</p>
            </div>
          </div>

          {/* Main progress bar */}
          <div className="mb-3">
            <div className="h-4 rounded-full bg-white/6 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 relative"
                style={{
                  width: `${Math.min(100, progress)}%`,
                  background: achieved ? 'linear-gradient(90deg, #22c55e, #4ade80)' : 'linear-gradient(90deg, #fbbf24, #22c55e)',
                  boxShadow: achieved ? '0 0 12px rgba(34,197,94,0.6)' : '0 0 8px rgba(251,191,36,0.4)',
                }}
              />
            </div>
          </div>

          {diff !== null && (
            <p className={`text-sm font-medium ${achieved ? 'text-eco-300' : 'text-yellow-300'}`}>
              {achieved
                ? `✅ You're ${formatCO2(Math.abs(diff))} below your target!`
                : `🎯 ${formatCO2(diff)} more to reduce to hit your goal`
              }
            </p>
          )}
        </div>
      )}

      {/* ── Set/Edit Goal Form ── */}
      {editing && (
        <div className="glass-card p-6 mb-6">
          <h3 className="text-sm font-semibold text-eco-300 mb-5">
            {goal ? '✏️ Update Your Goal' : '🎯 Set Your Monthly CO₂ Goal'}
          </h3>

          {/* Presets */}
          <div className="mb-5">
            <p className="eco-label">Quick Presets</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_TARGETS.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => { setTargetVal(String(p.value)); setName(p.label + ' Goal'); }}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                    parseFloat(targetVal) === p.value
                      ? 'border-eco-500/50 bg-eco-500/12 text-eco-300'
                      : 'border-white/8 bg-white/3 text-white/50 hover:border-white/20'
                  }`}
                >
                  <div className="text-xl mb-1">{p.icon}</div>
                  <p className="text-xs font-semibold">{p.label}</p>
                  <p className="text-xs opacity-60">{p.value} kg/mo</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom target */}
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="eco-label">Goal Name</label>
              <input
                type="text"
                className="eco-input"
                placeholder="My Green Goal"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="eco-label">Target (kg CO₂/month)</label>
              <div className="relative">
                <input
                  type="number"
                  className="eco-input pr-16"
                  placeholder="200"
                  min="1" max="1000" step="1"
                  value={targetVal}
                  onChange={e => setTargetVal(e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30">kg/mo</span>
              </div>
            </div>
          </div>

          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

          <div className="flex gap-3">
            <button onClick={handleSave} className="eco-btn">
              <Save size={16} /> Save Goal
            </button>
            {goal && (
              <button onClick={() => setEditing(false)} className="eco-btn-outline">Cancel</button>
            )}
          </div>
        </div>
      )}

      {/* ── Tips ── */}
      <div className="glass-card p-6">
        <p className="text-sm font-semibold text-white/70 mb-4">💡 How to Reach Your Goal</p>
        <div className="space-y-3">
          {[
            { icon: '🚌', tip: 'Use public transport 3+ days/week to cut transport emissions by 30%' },
            { icon: '💡', tip: 'Switch to LED bulbs and unplug idle devices to reduce electricity by 15%' },
            { icon: '🥗', tip: 'Adopt a plant-rich diet 3 days a week to lower food emissions by 25%' },
            { icon: '♻️', tip: 'Carry reusable bags, bottles and refuse single-use plastics' },
          ].map(({ icon, tip }) => (
            <div key={tip} className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">{icon}</span>
              <p className="text-sm text-white/50">{tip}</p>
            </div>
          ))}
        </div>
        <button onClick={() => onNavigate('ai')} className="eco-btn-outline mt-5 text-xs">
          Get AI-Personalized Tips →
        </button>
      </div>
    </div>
  );
}
