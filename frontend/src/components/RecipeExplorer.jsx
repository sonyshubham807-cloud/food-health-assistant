import React, { useState, useEffect } from 'react';
import { getRecipes } from '../utils/api';

const GOALS = ['balanced', 'weight loss', 'muscle gain', 'heart healthy', 'diabetic friendly'];

export default function RecipeExplorer() {
  const [recipes, setRecipes] = useState([]);
  const [goal, setGoal] = useState('balanced');
  const [loading, setLoading] = useState(false);

  const load = async (g) => {
    setLoading(true);
    try {
      const data = await getRecipes(g);
      if (data.success) setRecipes(data.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(goal); }, []);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {GOALS.map(g => (
          <button key={g} onClick={() => { setGoal(g); load(g); }}
            style={{ padding: '7px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: goal === g ? '#22c55e' : '#e2e8f0', color: goal === g ? 'white' : '#64748b', textTransform: 'capitalize', transition: 'all 0.15s' }}>
            {g}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="loading-dots"><span /><span /><span /></div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((r, i) => (
            <div key={i} className="recipe-card">
              <div style={{ fontSize: 28, marginBottom: 8 }}>🍽</div>
              <div className="recipe-name">{r.name}</div>
              <div className="recipe-meta">
                <span>🔥 {r.calories} kcal</span>
                <span>⏱ {r.time}</span>
                <span>📊 {r.difficulty}</span>
              </div>
              {r.description && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{r.description}</div>}
              <div className="recipe-tags">{r.tags?.map((t, j) => <span key={j} className="recipe-tag">{t}</span>)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
