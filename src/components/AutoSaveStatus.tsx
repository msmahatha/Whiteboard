import React from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';
import { useAutoSave } from '../hooks/useAutoSave';

export const AutoSaveStatus: React.FC = () => {
  const { theme } = useWhiteboardStore();
  const { lastSaved, isAutoSaving } = useAutoSave();

  const getStatusText = () => {
    if (isAutoSaving) return 'Saving...';
    if (lastSaved) {
      const now = new Date();
      const diff = now.getTime() - lastSaved.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      if (minutes > 0) {
        return `Saved ${minutes}m ago`;
      } else if (seconds > 5) {
        return `Saved ${seconds}s ago`;
      } else {
        return 'Saved';
      }
    }
    return 'Not saved';
  };

  const getStatusColor = () => {
    if (isAutoSaving) return theme === 'light' ? '#f59e0b' : '#fbbf24'; // yellow
    if (lastSaved) {
      const diff = new Date().getTime() - lastSaved.getTime();
      if (diff < 60000) return theme === 'light' ? '#10b981' : '#34d399'; // green
      if (diff < 300000) return theme === 'light' ? '#f59e0b' : '#fbbf24'; // yellow
    }
    return theme === 'light' ? '#ef4444' : '#f87171'; // red
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '12px',
      color: theme === 'light' ? '#6b7280' : '#9ca3af',
      padding: '4px 0'
    }}>
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          animation: isAutoSaving ? 'pulse 1.5s ease-in-out infinite' : 'none'
        }}
      />
      <span style={{ color: getStatusColor() }}>
        {getStatusText()}
      </span>
    </div>
  );
};

// Add CSS for the pulse animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;
document.head.appendChild(styleSheet);

export default AutoSaveStatus;
