import React from 'react';

export default function Dashboard({ stats, history }) {
  const todayMeals = history.slice(0, 3);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Calories Today', value: `${stats?.today_calories || 0} kcal`, icon: '🔥', color: '#f59e0b' },
          { label: 'Meals Logged', value: stats?.total_logs || 0, icon: '📋', color: '#3b82f6' },
          { label: 'Avg Health Score', value: `${stats?.avg_health_score || 0}/10`, icon: '⭐', color: '#22c55e' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: 16, padding: 18, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Recent Activity</div>
        {todayMeals.length === 0
          ? <div style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>No meals logged yet today</div>
          : todayMeals.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < todayMeals.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{m.food}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{m.meal_type}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{m.analysis?.calories} kcal</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
