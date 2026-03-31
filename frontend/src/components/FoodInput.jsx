import React from 'react';

const FoodInput = ({ food, setFood, onAnalyze, loading }) => {
  return (
    <div style={{ background: '#1e293b', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid #334155' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#f1f5f9' }}>What did you eat?</h2>
      <div style={{ display: 'flex', gap: '12px' }}>
        <input
          value={food}
          onChange={e => setFood(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onAnalyze()}
          placeholder="e.g. 2 eggs with toast and orange juice..."
          style={{ flex: 1, padding: '12px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none' }}
        />
        <button
          onClick={onAnalyze}
          disabled={loading || !food.trim()}
          style={{ padding: '12px 28px', background: loading ? '#166534' : '#22c55e', color: '#0f172a', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: loading ? 'wait' : 'pointer' }}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['Apple', '2 boiled eggs', 'Chicken biryani', 'Protein shake', 'Almonds 30g'].map(s => (
          <button key={s} onClick={() => setFood(s)} style={{ padding: '4px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '20px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>{s}</button>
        ))}
      </div>
    </div>
  );
};

export default FoodInput;
