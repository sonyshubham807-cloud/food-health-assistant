import React from 'react';
import FoodCards from './FoodCard';
import RecentLogs from './RecentLogs';

const MACRO_COLORS = {
  'Protein': '#22c55e',
  'Carbs': '#3b82f6',
  'Fat': '#f59e0b',
  'Fiber': '#8b5cf6',
};

const CHIPS = ['Apple', '2 boiled eggs', 'Chicken breast', 'Protein shake', 'Almonds', 'Brown rice', 'Salmon fillet', 'Oatmeal'];

function MacroBar({ label, value, max }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="macro-row">
      <div className="macro-label-row">
        <span className="macro-name">{label}</span>
        <span className="macro-val" style={{ color: MACRO_COLORS[label] }}>{value}g</span>
      </div>
      <div className="macro-track">
        <div className="macro-fill" style={{ width: `${pct}%`, background: MACRO_COLORS[label] }} />
      </div>
    </div>
  );
}

export default function MealLogger({ mealType, setMealType, food, setFood, loading, error, result, onAnalyze, history }) {
  const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const grade = result?.grade || 'A';
  return (
    <div>
      <div className="quick-actions-row">
        <button className="qa-btn scan">📷 Scan Barcode</button>
        <button className="qa-btn ai">✨ AI Photo Recognition</button>
      </div>
      <div className="meal-tabs">
        {MEALS.map(m => (
          <button key={m} className={`meal-tab ${mealType === m ? 'active' : ''}`} onClick={() => setMealType(m)}>{m}</button>
        ))}
      </div>
      <div className="food-search-box">
        <span style={{ fontSize: 16, color: '#cbd5e1' }}>🔍</span>
        <input
          value={food}
          onChange={e => setFood(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onAnalyze(food, mealType)}
          placeholder="Search for a food, brand, or ingredient..."
        />
        <button className="analyze-btn" onClick={() => onAnalyze(food, mealType)} disabled={loading || !food.trim()}>
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </div>
      {error && <div className="error-msg">⚠️ {error}</div>}
      <div className="food-chips">
        {CHIPS.map(c => <span key={c} className="chip" onClick={() => setFood(c)}>{c}</span>)}
      </div>
      {loading && (
        <div className="loading-dots">
          <span /><span /><span />
          <span style={{ marginLeft: 8, fontSize: 13, color: '#64748b' }}>Analyzing with Gemini AI…</span>
        </div>
      )}
      {result && !loading && (
        <div className="result-card">
          <div className="result-header">
            <div>
              <div className="result-name">{result.food_name}</div>
              <div className="result-serving">{result.serving_size} · {result.meal_type}</div>
            </div>
            <div className={`grade-badge grade-${grade.charAt(0)}`}>{grade}</div>
          </div>
          <div className="cal-row">
            <span className="cal-number">{result.calories}</span>
            <span className="cal-label">kcal</span>
          </div>
          <div className="macro-bars">
            <MacroBar label="Protein" value={result.protein_g} max={50} />
            <MacroBar label="Carbs" value={result.carbs_g} max={100} />
            <MacroBar label="Fat" value={result.fat_g} max={50} />
            <MacroBar label="Fiber" value={result.fiber_g} max={30} />
          </div>
          {result.health_tips?.length > 0 && (
            <div className="tips-section">
              <div className="tips-title">Health Tips</div>
              {result.health_tips.map((t, i) => <div key={i} className="tip-item">✅ {t}</div>)}
              {result.warnings?.filter(Boolean).map((w, i) => (
                <div key={i} className="tip-item warning-item"><span className="warning-icon">⚠️</span> {w}</div>
              ))}
            </div>
          )}
        </div>
      )}
      {!result && !loading && <FoodCards onSelect={setFood} />}
      <RecentLogs history={history} />
    </div>
  );
}
