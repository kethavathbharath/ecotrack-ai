/**
 * History Page – EcoTrack AI
 * Displays all past calculations with trend info and delete option
 */

import React from 'react';
import { format } from 'date-fns';
import { Trash2, TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { EmptyState, ScoreBadge } from '../components/ui/UIComponents';
import { formatCO2, getScoreCategory } from '../utils/calculations';
import { deleteHistoryEntry, getHistory } from '../utils/storage';

export default function History({ history, onHistoryChange, onNavigate }) {

  const handleDelete = (id) => {
    deleteHistoryEntry(id);
    onHistoryChange(getHistory());
  };

  if (history.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <EmptyState
          icon="📅"
          title="No history yet"
          description="Your calculation history will appear here after your first footprint calculation."
          action="Calculate Now"
          onAction={() => onNavigate('calculator')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Calculation History</h1>
          <p className="section-sub">{history.length} record{history.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      <div className="space-y-3">
        {history.map((entry, i) => {
          const prev = history[i + 1];
          const trendPct = prev ? parseFloat(((entry.total - prev.total) / prev.total * 100).toFixed(1)) : null;
          const cat = getScoreCategory(entry.ecoScore);

          return (
            <div key={entry.id} className="glass-card p-5 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start gap-4">
                {/* Date Badge */}
                <div className="hidden sm:flex flex-col items-center min-w-[50px]">
                  <div className="w-10 h-10 rounded-xl bg-eco-500/10 border border-eco-500/20 flex items-center justify-center mb-1">
                    <Calendar size={16} className="text-eco-400" />
                  </div>
                  <p className="text-[10px] text-white/30 text-center leading-tight">
                    {format(new Date(entry.timestamp), 'dd MMM')}
                  </p>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <p className="text-lg font-bold font-display text-white">{formatCO2(entry.total)}</p>
                    <ScoreBadge score={entry.ecoScore} />
                    {trendPct !== null && (
                      <span className={`text-xs flex items-center gap-1 ${trendPct > 0 ? 'text-red-400' : trendPct < 0 ? 'text-eco-400' : 'text-white/40'}`}>
                        {trendPct > 0 ? <TrendingUp size={12} /> : trendPct < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                        {trendPct > 0 ? '+' : ''}{trendPct}% vs previous
                      </span>
                    )}
                  </div>

                  {/* Breakdown pills */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {[
                      { label: '🚗', value: entry.transport,   color: '#60a5fa' },
                      { label: '⚡', value: entry.electricity, color: '#fbbf24' },
                      { label: '🍽️', value: entry.food,        color: '#a78bfa' },
                      { label: '♻️', value: entry.plastic,     color: '#f87171' },
                    ].map(({ label, value, color }) => (
                      <span
                        key={label}
                        className="px-2.5 py-0.5 rounded-lg font-medium"
                        style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
                      >
                        {label} {formatCO2(value || 0)}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-white/25 mt-2">
                    {format(new Date(entry.timestamp), 'EEEE, d MMMM yyyy · hh:mm a')}
                  </p>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
