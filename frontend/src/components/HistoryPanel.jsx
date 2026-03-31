import React from 'react';

const HistoryPanel = ({ history, getScoreColor }) => {
  return (
    <div>
      <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#f1f5f9' }}>Food History</h2>
      {history.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#64748b', padding: '60px', background: '#1e293b', borderRadius: '16px' }}>
          No food logged yet. Start analyzing!
        </div>
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
  );
};

export default HistoryPanel;
