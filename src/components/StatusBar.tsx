import React from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';
import { AutoSaveStatus } from './AutoSaveStatus';

export const StatusBar: React.FC = () => {
  const { 
    theme, 
    selectedShapeIds, 
    shapes, 
    tool, 
    zoom, 
    panX, 
    panY,
    layers,
    activeLayerId
  } = useWhiteboardStore();

  const selectedCount = selectedShapeIds.length;
  const totalShapes = Object.keys(shapes).length;
  const activeLayer = layers.find(layer => layer.id === activeLayerId);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '32px',
        backgroundColor: theme === 'light' ? '#f8fafc' : '#1f2937',
        borderTop: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        fontSize: '12px',
        color: theme === 'light' ? '#6b7280' : '#9ca3af',
        zIndex: 100,
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* Left side - Selection info */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span>
          {selectedCount > 0 
            ? `${selectedCount} selected` 
            : `${totalShapes} shapes`
          }
        </span>
        
        <span>
          Layer: {activeLayer?.name || 'Unknown'}
        </span>
        
        <span>
          Tool: {tool.charAt(0).toUpperCase() + tool.slice(1)}
        </span>
      </div>

      {/* Right side - Canvas info */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span>
          Zoom: {Math.round(zoom * 100)}%
        </span>
        
        <span>
          Pan: ({Math.round(panX)}, {Math.round(panY)})
        </span>
        
        <span style={{ 
          color: theme === 'light' ? '#3b82f6' : '#60a5fa',
          fontWeight: '500' 
        }}>
          Whiteboard Ready
        </span>
        
        <AutoSaveStatus />
      </div>
    </div>
  );
};

export default StatusBar;
