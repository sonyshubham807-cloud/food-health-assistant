import React from 'react';

export default function DayQuality({ stats }) {
  const score = stats?.avg_health_score || 0;
  const grade = score >= 8 ? 'A' : score >= 6 ? 'B' : score >= 4 ? 'C' : 'D';
  const extra = stats?.total_logs > 0
    ? `You've scored ${score}/10 higher than your weekly goal`
    : 'Start logging to see your grade';
  return (
    <div className="quality-card">
      <div className="quality-title">Day Quality</div>
      <div className={`quality-grade grade-${grade}-text`}>{grade}+</div>
      <div className="quality-desc">{extra}</div>
    </div>
  );
}
