import React, { useState } from 'react';

export default function TopBar({ activePage }) {
  const [search, setSearch] = useState('');
  const titles = {
    dashboard: { tag: 'OVERVIEW', title: "Today's Summary" },
    meal: { tag: 'QUICK ACTION', title: "What's on your plate?" },
    recipe: { tag: 'EXPLORE', title: "Healthy Recipes" },
    insights: { tag: 'ANALYTICS', title: "Health Insights" },
  };
  const { tag, title } = titles[activePage] || titles.meal;
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="quick-action">{tag}</div>
        <h1>{title}</h1>
      </div>
      <div className="topbar-right">
        <div className="search-bar">
          <span style={{ color: '#cbd5e1', fontSize: 14 }}>🔍</span>
          <input placeholder="Search entries..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="icon-btn">🔔</div>
        <div className="avatar">U</div>
      </div>
    </div>
  );
}
