import React, { useState, useEffect } from 'react';
import './index.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function App() {
  const [food, setFood] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('analyze');

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/history`);
      const data = await res.json();
      if (data.success) setHistory(data.data);
    } catch (e) { console.error(e); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (e) { console.error(e); }
  };

  const analyzeFood = async () => {
    if (!food.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ food })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        fetchHistory();
        fetchStats();
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (e) {
      setError('Server error. Make sure backend is running.');
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#22c55e';
    if (score >= 5) return '#f59e0b';
    return '#ef4444';
  };

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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1e293b', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', background: '#22c55e', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🥗</div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9' }}>FoodHealth AI</h1>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Powered by Gemini</p>
          </div>
        </div>
        {stats && (
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>{stats.total_logs}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Foods Logged</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#f59e0b' }}>{stats.avg_health_score}/10</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Avg Score</div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1e293b', padding: '0 24px' }}>
        {['analyze', 'history'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '14px 20px', background: 'none', border: 'none', color: activeTab === tab ? '#22c55e' : '#64748b', fontWeight: activeTab === tab ? 600 : 400, fontSize: '14px', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid #22c55e' : '2px solid transparent', textTransform: 'capitalize' }}>
            {tab === 'analyze' ? '🔍 Analyze Food' : '📋 History'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        {activeTab === 'analyze' && (
          <div>
            {/* Input */}
            <div style={{ background: '#1e293b', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid #334155' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#f1f5f9' }}>What did you eat?</h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  value={food}
                  onChange={e => setFood(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && analyzeFood()}
                  placeholder="e.g. 2 eggs with toast and orange juice..."
                  style={{ flex: 1, padding: '12px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none' }}
                />
                <button
                  onClick={analyzeFood}
                  disabled={loading || !food.trim()}
                  style={{ padding: '12px 28px', background: loading ? '#166534' : '#22c55e', color: '#0f172a', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: loading ? 'wait' : 'pointer', transition: 'all 0.2s' }}
                >
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
              {error && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '10px' }}>{error}</p>}
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Apple', '2 boiled eggs', 'Chicken biryani', 'Protein shake', 'Almonds 30g'].map(s => (
                  <button key={s} onClick={() => setFood(s)} style={{ padding: '4px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '20px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>{s}</button>
                ))}
              </div>
            </div>

            {/* Result */}
            {result && (
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
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#f1f5f9' }}>Food History</h2>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '60px', background: '#1e293b', borderRadius: '16px' }}>No food logged yet. Start analyzing!</div>
            ) : (
              history.map((item, i) => (
                <div key={i} style={{ background: '#1e293b', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#f1f5f9', textTransform: 'capitalize' }}>{item.food}</div>
                    {item.analysis && (
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                        {item.analysis.calories} kcal · P:{item.analysis.protein_g}g · C:{item.analysis.carbs_g}g · F:{item.analysis.fat_g}g
                      </div>
                    )}
                  </div>
                  {item.analysis && (
                    <div style={{ background: '#0f172a', borderRadius: '8px', padding: '6px 12px', color: getScoreColor(item.analysis.health_score), fontWeight: 700, fontSize: '14px' }}>
                      {item.analysis.health_score}/10
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
