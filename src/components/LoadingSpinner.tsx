import React from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  color 
}) => {
  const { theme } = useWhiteboardStore();
  const spinnerColor = color || (theme === 'light' ? '#6366f1' : '#8b5cf6');

  return (
    <div
      style={{
        display: 'inline-block',
        width: `${size}px`,
        height: `${size}px`,
        border: `3px solid ${theme === 'light' ? '#f3f4f6' : '#374151'}`,
        borderTop: `3px solid ${spinnerColor}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
    />
  );
};

interface LoadingOverlayProps {
  message?: string;
  transparent?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = 'Loading...', 
  transparent = false 
}) => {
  const { theme } = useWhiteboardStore();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: transparent 
          ? 'rgba(0, 0, 0, 0.1)' 
          : (theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(31, 41, 55, 0.9)'),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(2px)'
      }}
    >
      <LoadingSpinner size={48} />
      <p style={{
        marginTop: '16px',
        color: theme === 'light' ? '#374151' : '#f9fafb',
        fontSize: '16px',
        fontWeight: '500'
      }}>
        {message}
      </p>
    </div>
  );
};

// Add CSS for the spin animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default LoadingSpinner;
