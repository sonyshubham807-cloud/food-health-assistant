import { useState, useEffect, useCallback } from 'react';
import { analyzeFood, getHistory, getStats, getInsight } from '../utils/api';

export function useFood() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ today_calories: 0, today_protein: 0, today_carbs: 0, today_fat: 0, avg_health_score: 0, total_logs: 0 });
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [h, s] = await Promise.all([getHistory(), getStats()]);
      if (h.success) setHistory(h.data);
      setStats(s);
      const ins = await getInsight(s.today_calories || 0, s.today_protein || 0, 'Lunch');
      setInsight(ins);
    } catch (e) { console.warn('Refresh error:', e.message); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const analyze = useCallback(async (food, meal_type) => {
    if (!food.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await analyzeFood(food, meal_type);
      if (data.success) {
        setResult(data.data);
        await refresh();
      } else {
        setError(data.error || 'Analysis failed. Please try again.');
      }
    } catch (e) {
      setError('Cannot connect to server. Start the backend first.');
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  return { history, stats, insight, loading, error, result, analyze, refresh };
}
