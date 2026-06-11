/**
 * Challenges Page – EcoTrack AI
 * Weekly green challenges with completion tracking
 */

import React from 'react';
import { RotateCcw, CheckCircle2, Circle, Star } from 'lucide-react';
import { format } from 'date-fns';

export default function Challenges({ challenges, onToggle, onReset }) {
  const completed = challenges.filter(c => c.completed).length;
  const totalPoints = challenges.filter(c => c.completed).reduce((s, c) => s + (c.points || 0), 0);
  const totalPossible = challenges.reduce((s, c) => s + (c.points || 0), 0);
  const completionPct = Math.round((completed / challenges.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-up">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="section-title">Weekly Green Challenges</h1>
          <p className="section-sub">Complete eco-friendly tasks to earn green points</p>
        </div>
        <button onClick={onReset} className="eco-btn-outline text-xs">
          <RotateCcw size={14} /> Reset Week
        </button>
      </div>

      {/* Progress summary */}
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wide">Weekly Progress</p>
            <p className="text-2xl font-bold font-display text-white mt-1">
              {completed}/{challenges.length} <span className="text-sm font-normal text-white/40">challenges</span>
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-eco-300">
              <Star size={18} className="fill-eco-500" />
              <span className="text-2xl font-bold font-display">{totalPoints}</span>
            </div>
            <p className="text-xs text-white/40">/ {totalPossible} pts</p>
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-white/6 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${completionPct}%`,
              background: 'linear-gradient(90deg, #22c55e, #4ade80)',
              boxShadow: '0 0 10px rgba(34,197,94,0.5)',
            }}
          />
        </div>
        <p className="text-xs text-white/40 mt-2">{completionPct}% complete this week</p>
      </div>

      {/* Challenges grid */}
      <div className="space-y-3">
        {challenges.map((c, i) => (
          <button
            key={c.id}
            onClick={() => onToggle(c.id)}
            className={`challenge-card w-full text-left animate-fade-up ${c.completed ? 'completed' : ''}`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-all duration-200"
              style={{
                background: c.completed ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                border: c.completed ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {c.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className={`text-sm font-semibold ${c.completed ? 'text-eco-300' : 'text-white/80'}`}>
                  {c.title}
                </p>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: 'rgba(34,197,94,0.1)',
                    color: '#4ade80',
                    border: '1px solid rgba(34,197,94,0.2)',
                  }}
                >
                  +{c.points} pts
                </span>
              </div>
              <p className="text-xs text-white/35">{c.description}</p>
              {c.completed && c.completedAt && (
                <p className="text-[10px] text-eco-400/60 mt-1">
                  ✓ Completed {format(new Date(c.completedAt), 'hh:mm a')}
                </p>
              )}
            </div>

            {/* Check */}
            <div className="flex-shrink-0">
              {c.completed
                ? <CheckCircle2 size={24} className="text-eco-400" />
                : <Circle size={24} className="text-white/20" />
              }
            </div>
          </button>
        ))}
      </div>

      {/* Motivational message */}
      {completed === challenges.length && (
        <div className="mt-6 glass-card p-6 text-center border border-eco-500/30">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-lg font-bold text-eco-300 mb-1">Amazing Work!</h3>
          <p className="text-sm text-white/50">
            You've completed all weekly challenges and earned {totalPoints} green points! 
            Come back next week for new challenges.
          </p>
        </div>
      )}
    </div>
  );
}
