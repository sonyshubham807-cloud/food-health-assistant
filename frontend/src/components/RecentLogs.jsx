import React from 'react';

const FOOD_EMOJIS = {
  egg: '🥚', chicken: '🍗', rice: '🍚', salad: '🥗', bread: '🍞',
  milk: '🥛', fruit: '🍎', veg: '🥦', pasta: '🍝', fish: '🐟',
  yogurt: '🫙', oat: '🌾', banana: '🍌', avocado: '🥑', default: '🍽'
};

function getFoodEmoji(name) {
  if (!name) return FOOD_EMOJIS.default;
  const n = name.toLowerCase();
  for (const [k, v] of Object.entries(FOOD_EMOJIS)) { if (n.includes(k)) return v; }
  return FOOD_EMOJIS.default;
}

export default function RecentLogs({ history }) {
  if (!history.length) {
    return (
      <div className="section-card">
        <div className="section-header"><span className="section-title">Recent Logs</span></div>
        <div className="empty-state"><div className="emoji">🍽</div><p>No meals logged yet. Start analyzing!</p></div>
      </div>
    );
  }
  return (
    <div className="section-card">
      <div className="section-header">
        <span className="section-title">Recent Logs</span>
        <button className="view-all">View History</button>
      </div>
      {history.slice(0, 5).map((item, i) => (
        <div className="log-item" key={i}>
          <div className="log-emoji">{getFoodEmoji(item.food)}</div>
          <div className="log-info">
            <div className="log-name">{item.food}</div>
            <div className="log-meta">{item.meal_type} · {item.analysis?.serving_size || '1 serving'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="log-cal">{item.analysis?.calories || '—'} kcal</div>
            {item.analysis?.health_score && <div className="log-score">Score {item.analysis.health_score}/10</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
