const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const analyzeFood = async (food, meal_type) => {
  const res = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ food, meal_type })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getHistory = async () => {
  const res = await fetch(`${API_URL}/history`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getStats = async () => {
  const res = await fetch(`${API_URL}/stats`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getRecipes = async (goal = 'balanced') => {
  const res = await fetch(`${API_URL}/recipes?goal=${goal}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getInsight = async (calories, protein, next_meal) => {
  const res = await fetch(`${API_URL}/insight?calories=${calories}&protein=${protein}&next_meal=${next_meal}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};
