import React from 'react';

const SUGGESTIONS = [
  { emoji: '🥚', name: 'Poached Eggs', cal: 155, macro: '13g P · 1g C' },
  { emoji: '🥑', name: 'Avocado Toast', cal: 290, macro: '6g P · 28g C' },
  { emoji: '☕', name: 'Oat Milk Latte', cal: 120, macro: '4g P · 18g C' },
  { emoji: '🍌', name: 'Banana', cal: 89, macro: '1g P · 23g C' },
  { emoji: '🥗', name: 'Garden Salad', cal: 85, macro: '3g P · 14g C' },
  { emoji: '🫙', name: 'Greek Yogurt', cal: 100, macro: '17g P · 6g C' },
];

export default function FoodCards({ onSelect }) {
  return (
    <div className="food-cards-grid">
      {SUGGESTIONS.map((f, i) => (
        <div className="food-card" key={i} onClick={() => onSelect(f.name)}>
          <div className="food-card-emoji">{f.emoji}</div>
          <div className="food-card-name">{f.name}</div>
          <div className="food-card-cal">{f.cal} kcal</div>
          <div className="food-card-macro">{f.macro}</div>
        </div>
      ))}
    </div>
  );
}
