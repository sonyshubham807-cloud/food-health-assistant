import React from 'react';

export default function AIInsight({ insight }) {
  if (!insight) return null;
  return (
    <div className="insight-card">
      <div className="insight-header">
        <div className="insight-dot"></div>
        <span className="insight-label">AI Insight</span>
        <span style={{ marginLeft: 'auto', fontSize: 18 }}>{insight.emoji || '⚡'}</span>
      </div>
      <p className="insight-text">{insight.insight}</p>
    </div>
  );
}
