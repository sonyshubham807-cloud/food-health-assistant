import React from 'react';

export default function DailySummary({ stats }) {
  const goal = 2000;
  const eaten = stats?.today_calories || 0;
  const remaining = Math.max(goal - eaten, 0);
  const pct = Math.min(eaten / goal, 1);
  const r = 28, circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <div className="daily-summary-card">
      <div className="ds-title">Daily Summary</div>
      <div className="cal-ring-area">
        <div className="cal-ring">
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r={r} fill="none" stroke="#166534" strokeWidth="7" />
            <circle cx="32" cy="32" r={r} fill="none" stroke="#4ade80" strokeWidth="7"
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
          </svg>
          <div className="cal-ring-text">
            <div className="num">{Math.round(pct * 100)}%</div>
          </div>
        </div>
        <div className="cal-ring-info">
          <div className="cal-ring-cal">{remaining} kcal</div>
          <div className="cal-ring-rem">Calories Remaining</div>
        </div>
      </div>
      <div className="macro-mini-row">
        <div className="macro-mini">
          <div className="macro-mini-val">{stats?.today_protein || 0}g</div>
          <div className="macro-mini-lbl">Protein</div>
        </div>
        <div className="macro-mini">
          <div className="macro-mini-val">{stats?.today_fat || 0}g</div>
          <div className="macro-mini-lbl">Fat</div>
        </div>
        <div className="macro-mini">
          <div className="macro-mini-val">{stats?.today_carbs || 0}g</div>
          <div className="macro-mini-lbl">Carbs</div>
        </div>
      </div>
    </div>
  );
}
