import React, { useState } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';

export const LayerPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, layers, activeLayerId, setActiveLayer, shapes } = useWhiteboardStore();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '80px',
          border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
          borderRadius: '8px 0 0 8px',
          backgroundColor: theme === 'light' ? '#ffffff' : '#374151',
          color: theme === 'light' ? '#374151' : '#f9fafb',
          cursor: 'pointer',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          zIndex: 1000,
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)'
        }}
        title="Open Layers Panel"
      >
        Layers
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        right: '20px',
        transform: 'translateY(-50%)',
        width: '280px',
        backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
        border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        maxHeight: '400px',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
          Layers
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: theme === 'light' ? '#666' : '#ccc',
            padding: '4px'
          }}
        >
          ×
        </button>
      </div>

      {/* Layers List */}
      <div style={{ padding: '12px', maxHeight: '300px', overflow: 'auto' }}>
        {layers.map((layer) => {
          const layerShapes = Object.values(shapes).filter(
            shape => layer.shapeIds.includes(shape.id)
          );
          
          return (
            <div
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              style={{
                padding: '12px',
                marginBottom: '8px',
                borderRadius: '8px',
                backgroundColor: activeLayerId === layer.id 
                  ? (theme === 'light' ? '#eff6ff' : '#1e3a8a')
                  : (theme === 'light' ? '#f9fafb' : '#374151'),
                border: `1px solid ${activeLayerId === layer.id 
                  ? (theme === 'light' ? '#3b82f6' : '#60a5fa')
                  : (theme === 'light' ? '#e5e7eb' : '#4b5563')}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}>
                <span style={{
                  fontWeight: '500',
                  color: theme === 'light' ? '#374151' : '#f9fafb'
                }}>
                  {layer.name}
                </span>
                {activeLayerId === layer.id && (
                  <span style={{
                    fontSize: '12px',
                    color: '#3b82f6',
                    fontWeight: '600'
                  }}>
                    Active
                  </span>
                )}
              </div>
              <div style={{
                fontSize: '12px',
                color: theme === 'light' ? '#6b7280' : '#9ca3af'
              }}>
                {layerShapes.length} shapes
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LayerPanel;
