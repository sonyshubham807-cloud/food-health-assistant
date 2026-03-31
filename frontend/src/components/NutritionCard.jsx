import React from 'react';

const MacroBar = ({ label, value, max, color }) => (
  <div style={{ marginBottom: '12px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{ fontSize: '13px', color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 600, color }}>{value}g</span>
    </div>
    <div style={{ background: '#1e293b', borderRadius: '4px', height: '6px' }}>
      <div style={{ background: color, width: `${Math.min((value / max) * 100, 100)}%`, height: '100%', borderRadius: '4px', transition: 'width 0.8s ease' }} />
    </div>
  </div>
);

const NutritionCard = ({ result, getScoreColor }) => {
  if (!result) return null;

  return (
    <div style={{ background: '#1e293b', borderRadius: '16px', padding: '24px', border: '1px solid #334155' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f5f9', textTransform: 'capitalize' }}>{result.food_name}</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Nutritional Analysis</p>
        </div>
        <div style={{ textAlign: 'center', background: '#0f172a', borderRadius: '12px', padding: '12px 20px', border: `2px solid ${getScoreColor(result.health_score)}` }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: getScoreColor(result.health_score) }}>{result.health_score}</div>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Health Score</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#0f172a', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b' }}>{result.calories}</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Calories (kcal)</div>
        </div>
        <div style={{ background: '#0f172a', borderRadius: '12px', padding: '16px' }}>
          <MacroBar label="Protein" value={result.protein_g} max={50} color="#22c55e" />
          <MacroBar label="Carbs" value={result.carbs_g} max={100} color="#3b82f6" />
          <MacroBar label="Fat" value={result.fat_g} max={50} color="#f59e0b" />
          <MacroBar label="Fiber" value={result.fiber_g} max={30} color="#8b5cf6" />
        </div>
      </div>

      {result.health_tips?.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Health Tips</h4>
          {result.health_tips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', background: '#0f172a', borderRadius: '8px', padding: '10px 14px' }}>
              <span style={{ color: '#22c55e', fontSize: '14px' }}>✓</span>
              <span style={{ fontSize: '14px', color: '#cbd5e1' }}>{tip}</span>
            </div>
          ))}
        </div>
      )}

      {result.warnings?.length > 0 && result.warnings[0] && (
        <div style={{ background: '#450a0a', borderRadius: '8px', padding: '12px 14px', border: '1px solid #7f1d1d' }}>
          <span style={{ color: '#fca5a5', fontSize: '13px' }}>⚠️ {result.warnings.join(', ')}</span>
        </div>
      )}
    </div>
  );
};

export default NutritionCard;
