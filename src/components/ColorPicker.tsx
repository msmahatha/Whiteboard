import React from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ isOpen, onClose }) => {
  const { theme, currentColor, setCurrentColor } = useWhiteboardStore();

  if (!isOpen) return null;

  const colors = [
    '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#374151',
    '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#2563eb',
    '#7c3aed', '#db2777', '#4b5563', '#1f2937', '#fca5a5', '#fdba74'
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
          border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxWidth: '300px',
          width: '90%'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{
          margin: '0 0 16px 0',
          color: theme === 'light' ? '#1f2937' : '#f9fafb',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          Choose Color
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '8px',
          marginBottom: '16px'
        }}>
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => {
                setCurrentColor(color);
                onClose();
              }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: color,
                border: currentColor === color ? '3px solid #3b82f6' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              title={color}
            />
          ))}
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <label style={{
            color: theme === 'light' ? '#374151' : '#d1d5db',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Custom:
          </label>
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            style={{
              width: '40px',
              height: '32px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          />
        </div>
        
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};
