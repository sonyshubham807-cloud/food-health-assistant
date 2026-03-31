import React from 'react';

export default function HealthInsights({ stats, history }) {
  const score = stats?.avg_health_score || 0;
  const topFoods = history.slice(0, 5);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: score >= 7 ? '#22c55e' : '#f59e0b' }}>{score}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>Avg Health Score</div>
        </div>
        <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: '#3b82f6' }}>{stats?.total_logs || 0}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>Total Foods Logged</div>
        </div>
      </div>
      <div style={{ background: 'white', borderRadius: 16, padding: 18, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Your Top Foods</div>
        {topFoods.length === 0
          ? <div style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', padding: 20 }}>Log meals to see insights</div>
          : topFoods.map((f, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < topFoods.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{f.food}</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#64748b' }}>
                <span>{f.analysis?.calories} kcal</span>
                <span style={{ color: f.analysis?.health_score >= 7 ? '#22c55e' : '#f59e0b', fontWeight: 600 }}>
                  {f.analysis?.health_score}/10
                </span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
