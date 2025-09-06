import React from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';

interface SimpleCanvasProps {
  width: number;
  height: number;
}

export const SimpleCanvas: React.FC<SimpleCanvasProps> = ({ width, height }) => {
  const { tool, theme } = useWhiteboardStore();

  return (
    <div 
      style={{
        width,
        height,
        backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        color: theme === 'light' ? '#6b7280' : '#9ca3af',
        cursor: 'crosshair'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div>Canvas Area</div>
        <div style={{ fontSize: '14px', marginTop: '8px' }}>
          Current tool: {tool}
        </div>
        <div style={{ fontSize: '14px', marginTop: '4px' }}>
          Size: {width} × {height}
        </div>
      </div>
    </div>
  );
};
