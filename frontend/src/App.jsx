import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MealLogger from './components/MealLogger';
import Dashboard from './components/Dashboard';
import RecipeExplorer from './components/RecipeExplorer';
import HealthInsights from './components/HealthInsights';
import DailySummary from './components/DailySummary';
import AIInsight from './components/AIInsight';
import DayQuality from './components/DayQuality';
import { useFood } from './hooks/useFood';

export default function App() {
  const [activePage, setActivePage] = useState('meal');
  const [mealType, setMealType] = useState('Breakfast');
  const [food, setFood] = useState('');
  const { history, stats, insight, loading, error, result, analyze } = useFood();

  const renderCenter = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard stats={stats} history={history} />;
      case 'recipe': return <RecipeExplorer />;
      case 'insights': return <HealthInsights stats={stats} history={history} />;
      default: return (
        <MealLogger
          mealType={mealType} setMealType={setMealType}
          food={food} setFood={setFood}
          loading={loading} error={error} result={result}
          onAnalyze={analyze} history={history}
        />
      );
    }
  };

  return (
    <div className="app-shell">
      <Sidebar active={activePage} setActive={setActivePage} mealType={mealType} />
      <div className="main-content">
        <TopBar activePage={activePage} />
        <div className="content-area">
          <div className="center-panel">{renderCenter()}</div>
          <div className="right-panel">
            <DailySummary stats={stats} />
            <AIInsight insight={insight} />
            <DayQuality stats={stats} />
          </div>
        </div>
      </div>
    </div>
  );
}
