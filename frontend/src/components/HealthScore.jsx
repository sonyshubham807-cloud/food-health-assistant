import React from 'react';

const HealthScore = ({ score, getScoreColor }) => {
  if (score === null || score === undefined) return null;

  const color = getScoreColor(score);
  const label = score >= 8 ? 'Excellent' : score >= 5 ? 'Moderate' : 'Low';

  return (
    <div style={{ textAlign: 'center', background: '#0f172a', borderRadius: '12px', padding: '12px 20px', border: `2px solid ${color}` }}>
      <div style={{ fontSize: '28px', fontWeight: 800, color }}>{score}</div>
      <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Health Score</div>
      <div style={{ fontSize: '11px', color, marginTop: '4px', fontWeight: 600 }}>{label}</div>
    </div>
  );
};

export default HealthScore;
