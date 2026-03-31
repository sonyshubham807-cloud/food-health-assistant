import React from 'react';

const NAV = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'meal', icon: '🍽', label: 'Meal Logger' },
  { id: 'recipe', icon: '📖', label: 'Recipe Explorer' },
  { id: 'insights', icon: '📊', label: 'Health Insights' },
];

const BOTTOM_NAV = [
  { id: 'settings', icon: '⚙', label: 'Settings' },
  { id: 'support', icon: '💬', label: 'Support' },
];

export default function Sidebar({ active, setActive, mealType }) {
  const mealLabel = { Breakfast: 'Log Breakfast', Lunch: 'Log Lunch', Dinner: 'Log Dinner', Snacks: 'Log Snack' };
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🥗</div>
        <span className="sidebar-logo-text">Meal Logger</span>
      </div>
      {NAV.map(n => (
        <button key={n.id} className={`nav-item ${active === n.id ? 'active' : ''}`} onClick={() => setActive(n.id)}>
          <span className="icon">{n.icon}</span>
          {n.label}
        </button>
      ))}
      <button className="log-btn" onClick={() => setActive('meal')}>
        {mealLabel[mealType] || 'Log Meal'}
      </button>
      <div className="sidebar-bottom">
        {BOTTOM_NAV.map(n => (
          <button key={n.id} className="nav-item" onClick={() => {}}>
            <span className="icon">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </div>
    </div>
  );
}
