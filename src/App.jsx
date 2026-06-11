/**
 * App.jsx – EcoTrack AI Root Component
 * Handles page routing and passes global state to pages
 */

import React, { useState } from 'react';
import Sidebar     from './components/layout/Sidebar';
import Landing     from './pages/Landing';
import Dashboard   from './pages/Dashboard';
import Calculator  from './pages/Calculator';
import History     from './pages/History';
import Goals       from './pages/Goals';
import Challenges  from './pages/Challenges';
import Analytics   from './pages/Analytics';
import AIInsights  from './pages/AIInsights';
import { useEcoData } from './hooks/useEcoData';

// Pages that show the sidebar layout
const LAYOUT_PAGES = ['dashboard','calculator','history','goals','challenges','analytics','ai'];

export default function App() {
  const [activePage, setActivePage] = useState('landing');

  const {
    history,
    goal,
    challenges,
    lastCalc,
    isDark,
    prediction,
    runCalculation,
    updateGoal,
    toggleChallengeItem,
    resetAllChallenges,
    toggleTheme,
    refreshHistory,
  } = useEcoData();

  const navigate = (page) => setActivePage(page);
  const isLayoutPage = LAYOUT_PAGES.includes(activePage);

  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <Landing onNavigate={navigate} />;
      case 'dashboard':
        return (
          <Dashboard
            history={history}
            lastCalc={lastCalc}
            goal={goal}
            prediction={prediction}
            onNavigate={navigate}
          />
        );
      case 'calculator':
        return (
          <Calculator
            onCalculate={runCalculation}
            lastResult={lastCalc}
          />
        );
      case 'history':
        return (
          <History
            history={history}
            onHistoryChange={refreshHistory}
            onNavigate={navigate}
          />
        );
      case 'goals':
        return (
          <Goals
            goal={goal}
            lastCalc={lastCalc}
            history={history}
            onUpdateGoal={updateGoal}
            onNavigate={navigate}
          />
        );
      case 'challenges':
        return (
          <Challenges
            challenges={challenges}
            onToggle={toggleChallengeItem}
            onReset={resetAllChallenges}
          />
        );
      case 'analytics':
        return (
          <Analytics
            history={history}
            goal={goal}
            lastCalc={lastCalc}
          />
        );
      case 'ai':
        return (
          <AIInsights
            lastCalc={lastCalc}
            history={history}
            prediction={prediction}
            onNavigate={navigate}
          />
        );
      default:
        return <Landing onNavigate={navigate} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="bg-animated min-h-screen">
        {isLayoutPage ? (
          /* ── Sidebar Layout ── */
          <div className="flex">
            <Sidebar
              activePage={activePage}
              onNavigate={navigate}
              isDark={isDark}
              onToggleTheme={toggleTheme}
            />
            {/* Main content area, offset by sidebar width on desktop */}
            <main className="flex-1 lg:ml-60 min-h-screen pt-4 pb-12">
              {renderPage()}
            </main>
          </div>
        ) : (
          /* ── Full page (Landing) ── */
          <main>{renderPage()}</main>
        )}
      </div>
    </div>
  );
}
