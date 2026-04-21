import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const statusLower = status?.toLowerCase() || 'draft';

  return (
    <div className={`status-badge status-${statusLower}`}>
      <span className="status-dot"></span>
      <span className="status-text">{status}</span>
    </div>
  );
};

export default StatusBadge;
