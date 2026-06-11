/**
 * AI Insights Page – EcoTrack AI
 * Gemini-powered recommendations and next-month prediction
 */

import React, { useState } from 'react';
import { Brain, Sparkles, RefreshCw, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { Spinner, AlertBanner, EmptyState } from '../components/ui/UIComponents';
import { getAIRecommendations, getAIPrediction, getMockRecommendations } from '../services/geminiService';
import { formatCO2 } from '../utils/calculations';

const CATEGORY_COLORS = {
  transport:   { bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.25)',  text: '#93c5fd' },
  electricity: { bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)',  text: '#fcd34d' },
  food:        { bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)', text: '#c4b5fd' },
  waste:       { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)', text: '#fca5a5' },
  lifestyle:   { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)',   text: '#86efac' },
  general:     { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)',   text: '#86efac' },
};

function RecommendationCard({ rec, index }) {
  const style = CATEGORY_COLORS[rec.category] || CATEGORY_COLORS.general;
  return (
    <div
      className="glass-card p-5 border-l-2 animate-fade-up"
      style={{ borderLeftColor: style.text, animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5">{rec.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h3 className="text-sm font-semibold text-white">{rec.title}</h3>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full capitalize font-medium"
              style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
            >
              {rec.category}
            </span>
          </div>
          {rec.description && (
            <p className="text-xs text-white/50 mb-2 leading-relaxed">{rec.description}</p>
          )}
          {rec.impact && (
            <p className="text-xs font-semibold" style={{ color: style.text }}>
              💚 {rec.impact}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AIInsights({ lastCalc, history, prediction, onNavigate }) {
  const [recs,       setRecs]       = useState([]);
  const [predData,   setPredData]   = useState(null);
  const [loadingRec, setLoadingRec] = useState(false);
  const [loadingPred,setLoadingPred]= useState(false);
  const [error,      setError]      = useState('');
  const [usedMock,   setUsedMock]   = useState(false);

  const hasApiKey = import.meta.env.VITE_GEMINI_API_KEY &&
    import.meta.env.VITE_GEMINI_API_KEY !== 'your_gemini_api_key_here';

  const fetchRecommendations = async () => {
    if (!lastCalc) return;
    setLoadingRec(true);
    setError('');
    setUsedMock(false);
    try {
      if (!hasApiKey) throw new Error('MISSING_API_KEY');
      const result = await getAIRecommendations(lastCalc, lastCalc.ecoScore);
      setRecs(result);
    } catch (err) {
      if (err.message === 'MISSING_API_KEY') {
        setRecs(getMockRecommendations());
        setUsedMock(true);
      } else {
        setError(`AI Error: ${err.message}. Showing sample recommendations.`);
        setRecs(getMockRecommendations());
        setUsedMock(true);
      }
    } finally {
      setLoadingRec(false);
    }
  };

  const fetchPrediction = async () => {
    if (!history || history.length < 2 || !prediction) return;
    setLoadingPred(true);
    setError('');
    try {
      if (!hasApiKey) throw new Error('MISSING_API_KEY');
      const result = await getAIPrediction(history, prediction);
      setPredData(result);
    } catch (err) {
      if (err.message === 'MISSING_API_KEY') {
        setPredData({
          analysis: `Your carbon footprint shows a ${prediction.trend} trend. Based on your recent data, we estimate ${formatCO2(prediction.predicted)} for next month.`,
          suggestions: [
            'Reduce car travel by carpooling or using public transport 2 extra days/week',
            'Enable power-saving mode on all appliances and devices overnight',
            'Plan at least 2 vegetarian meals per week to lower food emissions',
          ],
          motivation: 'Every step counts. Small changes today lead to a greener tomorrow! 🌱',
        });
      } else {
        setError(`AI prediction error: ${err.message}`);
      }
    } finally {
      setLoadingPred(false);
    }
  };

  if (!lastCalc) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          icon="🤖"
          title="No data for AI analysis"
          description="Calculate your carbon footprint first to receive personalized AI recommendations."
          action="Go to Calculator"
          onAction={() => onNavigate('calculator')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-up">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
            <Brain size={20} className="text-purple-400" />
          </div>
          <h1 className="section-title mb-0">AI Insights</h1>
        </div>
        <p className="section-sub">Gemini AI-powered personalized recommendations and predictions</p>
      </div>

      {/* API Key notice */}
      {!hasApiKey && (
        <AlertBanner
          type="warning"
          message="No Gemini API key detected. Add VITE_GEMINI_API_KEY to your .env file for real AI recommendations. Sample recommendations will be shown."
        />
      )}

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      {/* ── Current Footprint Summary ── */}
      <div className="glass-card p-5 mb-6 flex flex-wrap items-center gap-4">
        <div className="flex-1">
          <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Analyzing your footprint</p>
          <p className="text-2xl font-bold text-white">{formatCO2(lastCalc.total)} <span className="text-sm font-normal text-white/40">/ month</span></p>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { label: '🚗', val: formatCO2(lastCalc.transport   || 0), color: '#60a5fa' },
            { label: '⚡', val: formatCO2(lastCalc.electricity || 0), color: '#fbbf24' },
            { label: '🍽️', val: formatCO2(lastCalc.food        || 0), color: '#a78bfa' },
            { label: '♻️', val: formatCO2(lastCalc.plastic     || 0), color: '#f87171' },
          ].map(({ label, val, color }) => (
            <div key={label} className="text-center">
              <p className="text-sm font-bold" style={{ color }}>{val}</p>
              <p className="text-[10px] text-white/30">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recommendations Section ── */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-eco-400" />
            <h2 className="text-base font-semibold text-white">Carbon Reduction Recommendations</h2>
          </div>
          <button
            onClick={fetchRecommendations}
            disabled={loadingRec}
            className="eco-btn text-xs"
          >
            {loadingRec ? <Spinner size="sm" /> : <><Zap size={14} /> {recs.length ? 'Refresh' : 'Generate'}</>}
          </button>
        </div>

        {usedMock && (
          <AlertBanner type="info" message="Showing sample recommendations. Add your Gemini API key for personalized AI insights." />
        )}

        {loadingRec ? (
          <div className="flex flex-col items-center py-12">
            <Spinner size="lg" text="Gemini AI is analyzing your footprint..." />
          </div>
        ) : recs.length > 0 ? (
          <div className="space-y-3 mt-4">
            {recs.map((rec, i) => <RecommendationCard key={rec.id} rec={rec} index={i} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center py-10 text-center">
            <Brain size={40} className="text-white/15 mb-3" />
            <p className="text-sm text-white/40 mb-1">Click "Generate" to get AI-powered recommendations</p>
            <p className="text-xs text-white/25">Gemini AI will analyze your footprint and suggest personalized actions</p>
          </div>
        )}
      </div>

      {/* ── Prediction Section ── */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-yellow-400" />
            <h2 className="text-base font-semibold text-white">Next Month Prediction</h2>
          </div>
          <button
            onClick={fetchPrediction}
            disabled={loadingPred || history.length < 2}
            className="eco-btn-outline text-xs"
          >
            {loadingPred ? <Spinner size="sm" /> : <><RefreshCw size={14} /> Predict</>}
          </button>
        </div>

        {history.length < 2 && (
          <p className="text-sm text-white/40">Need at least 2 calculations for prediction. Calculate your footprint a few more times.</p>
        )}

        {prediction && !predData && history.length >= 2 && (
          <div className="flex items-center gap-4 py-4 border-b border-white/6 mb-4">
            <div>
              <p className="text-xs text-white/40 mb-1">Statistical estimate</p>
              <p className="text-3xl font-bold font-display text-yellow-300">{formatCO2(prediction.predicted)}</p>
              <p className="text-xs text-white/40">Confidence: {prediction.confidence}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              prediction.trend === 'increasing' ? 'text-red-300 bg-red-500/10 border-red-500/20' :
              prediction.trend === 'decreasing' ? 'text-eco-300 bg-eco-500/10 border-eco-500/20' :
              'text-yellow-300 bg-yellow-500/10 border-yellow-500/20'
            }`}>
              {prediction.trend === 'increasing' ? '📈 Increasing' : prediction.trend === 'decreasing' ? '📉 Decreasing' : '➡️ Stable'} trend
            </div>
          </div>
        )}

        {loadingPred ? (
          <div className="flex flex-col items-center py-10">
            <Spinner size="lg" text="AI is analyzing your trends..." />
          </div>
        ) : predData ? (
          <div className="space-y-4">
            <div className="glass-card p-4">
              <p className="text-xs text-eco-300/70 uppercase tracking-wide mb-2">📊 Trend Analysis</p>
              <p className="text-sm text-white/70 leading-relaxed">{predData.analysis}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs text-yellow-300/70 uppercase tracking-wide mb-3">🛡️ Preventive Suggestions</p>
              <ul className="space-y-2">
                {predData.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                    <span className="text-eco-400 mt-0.5 flex-shrink-0">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-eco-500/8 border border-eco-500/20">
              <span className="text-xl">💚</span>
              <p className="text-sm text-eco-300 italic">{predData.motivation}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
