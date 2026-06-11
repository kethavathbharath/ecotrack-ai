/**
 * Landing Page – EcoTrack AI
 * Stunning hero with animated elements and feature showcase
 */

import React from 'react';
import { TreePine, Zap, BarChart2, Brain, Leaf, ArrowRight, Shield, Globe, Users } from 'lucide-react';

const FEATURES = [
  { icon: '🧮', title: 'Smart Calculator',   desc: 'Calculate your monthly CO₂ footprint across transport, energy, food, and waste.' },
  { icon: '🏆', title: 'Eco Score',           desc: 'Get a personalized 0–100 sustainability score with category breakdowns.' },
  { icon: '🤖', title: 'AI Recommendations', desc: 'Gemini AI analyzes your data and suggests custom carbon reduction strategies.' },
  { icon: '📊', title: 'Analytics Charts',   desc: 'Visualize trends, breakdowns, and progress toward your green goals.' },
  { icon: '🎯', title: 'Goal Tracking',       desc: 'Set a monthly CO₂ target and track your progress with visual indicators.' },
  { icon: '🏅', title: 'Weekly Challenges',   desc: 'Complete green challenges like "No Plastic Day" and earn sustainability points.' },
];

const STATS = [
  { value: '400+', label: 'kg avg monthly CO₂', icon: '🌍' },
  { value: '40%',  label: 'reduction possible',  icon: '📉' },
  { value: '6',    label: 'emission categories',  icon: '📋' },
  { value: 'AI',   label: 'powered insights',     icon: '🤖' },
];

export default function Landing({ onNavigate }) {
  return (
    <div className="min-h-screen bg-animated relative overflow-hidden">

      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #16a34a 0%, transparent 70%)' }} />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full opacity-10 blur-2xl"
          style={{ background: 'radial-gradient(circle, #4ade80 0%, transparent 70%)' }} />
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(34,197,94,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />

      <div className="relative z-10">

        {/* ── Hero ── */}
        <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center pt-20">

          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-eco-500/30 bg-eco-500/10 text-eco-300 text-sm mb-8">
            <Zap size={14} className="text-eco-400" />
            <span>Powered by Google Gemini AI</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-100 font-display text-5xl sm:text-7xl font-bold text-white mb-6 leading-none tracking-tight">
            Track Your{' '}
            <span
              className="glow-text"
              style={{ background: 'linear-gradient(135deg, #22c55e, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Carbon
            </span>
            <br />
            Footprint
          </h1>

          <p className="animate-fade-up delay-200 text-lg sm:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed">
            Understand your environmental impact, get AI-powered suggestions, and take meaningful steps toward a sustainable future — all in one beautiful dashboard.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 mb-20">
            <button
              onClick={() => onNavigate('calculator')}
              className="eco-btn text-base px-8 py-3.5"
            >
              Calculate Now <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="eco-btn-outline text-base px-8 py-3.5"
            >
              View Dashboard
            </button>
          </div>

          {/* Animated Earth Icon */}
          <div className="animate-fade-up delay-400 relative">
            <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto animate-float"
              style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(5,46,22,0.6))', border: '1px solid rgba(34,197,94,0.3)', boxShadow: '0 0 60px rgba(34,197,94,0.3)' }}
            >
              <Globe size={60} className="text-eco-400" />
            </div>
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin-slow">
              {[0, 90, 180, 270].map((deg, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-eco-400"
                  style={{
                    top: '50%', left: '50%',
                    transform: `rotate(${deg}deg) translateX(80px) translateY(-50%)`,
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="glass-card p-6 text-center animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold font-display text-eco-300 mb-1">{stat.value}</div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl font-bold text-white mb-3">
                Everything you need to go green
              </h2>
              <p className="text-white/40">A complete sustainability toolkit powered by AI</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="glass-card p-6 animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Band ── */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{ background: 'radial-gradient(ellipse at center, #22c55e 0%, transparent 60%)' }} />
            <TreePine size={48} className="text-eco-400 mx-auto mb-5 relative z-10" />
            <h2 className="font-display text-3xl font-bold text-white mb-4 relative z-10">
              Start your eco journey today
            </h2>
            <p className="text-white/50 mb-8 relative z-10">
              Calculate your carbon footprint in minutes and get personalized AI insights to reduce your environmental impact.
            </p>
            <button
              onClick={() => onNavigate('calculator')}
              className="eco-btn text-base px-10 py-4 relative z-10"
            >
              Get Started Free <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 text-center border-t border-white/5">
          <p className="text-white/25 text-sm">
            🌱 EcoTrack AI — Built for a sustainable future · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
