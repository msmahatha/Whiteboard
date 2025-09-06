import React from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';

interface StylePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StylePanel: React.FC<StylePanelProps> = ({ isOpen, onClose }) => {
  const {
    theme,
    tool,
    currentColor,
    setCurrentColor,
    currentBackgroundColor,
    setCurrentBackgroundColor,
    currentStrokeWidth,
    setCurrentStrokeWidth,
    currentStrokeStyle,
    setCurrentStrokeStyle,
    currentFillStyle,
    setCurrentFillStyle,
    currentOpacity,
    setCurrentOpacity,
    roughness,
    setRoughness
  } = useWhiteboardStore();

  if (!isOpen) return null;

  const strokeColors = [
    '#000000', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f39c12', 
    '#ffffff', '#95a5a6', '#34495e', '#e74c3c', '#2ecc71'
  ];

  const backgroundColors = [
    'transparent', '#000000', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f39c12', 
    '#ffffff', '#95a5a6', '#34495e', '#e74c3c', '#2ecc71'
  ];

  return (
    <div style={{
      position: 'fixed',
      left: '20px',
      top: '80px',
      width: '240px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#2d3748',
      border: `1px solid ${theme === 'light' ? '#e2e8f0' : '#4a5568'}`,
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      color: theme === 'light' ? '#2d3748' : '#f7fafc'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '16px', 
          fontWeight: 'bold',
          color: theme === 'light' ? '#2d3748' : '#f7fafc'
        }}>
          Style Options
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: theme === 'light' ? '#718096' : '#a0aec0'
          }}
        >
          ×
        </button>
      </div>

      {/* Stroke Colors */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '12px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: theme === 'light' ? '#4a5568' : '#a0aec0'
        }}>
          Stroke
        </label>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: '4px' 
        }}>
          {strokeColors.map((color) => (
            <button
              key={color}
              onClick={() => setCurrentColor(color)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: currentColor === color ? '3px solid #4299e1' : '2px solid #e2e8f0',
                backgroundColor: color === '#ffffff' ? '#f7fafc' : color,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {color === '#ffffff' && <span style={{ fontSize: '12px', color: '#4a5568' }}>⚬</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Background Colors */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '12px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: theme === 'light' ? '#4a5568' : '#a0aec0'
        }}>
          Background
        </label>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: '4px' 
        }}>
          {backgroundColors.map((color) => (
            <button
              key={color}
              onClick={() => setCurrentBackgroundColor(color)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: currentBackgroundColor === color ? '3px solid #4299e1' : '2px solid #e2e8f0',
                backgroundColor: color === 'transparent' ? 'transparent' : (color === '#ffffff' ? '#f7fafc' : color),
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {color === 'transparent' && (
                <div style={{
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(45deg, red 25%, transparent 25%, transparent 75%, red 75%)',
                  backgroundSize: '4px 4px',
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  transform: 'translateY(-50%) rotate(45deg)'
                }} />
              )}
              {color === '#ffffff' && <span style={{ fontSize: '12px', color: '#4a5568' }}>⚬</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Stroke Width / Font Size */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '12px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: theme === 'light' ? '#4a5568' : '#a0aec0'
        }}>
          {tool === 'text' ? 'Font size' : 'Stroke width'}
        </label>
        <div style={{ display: 'flex', gap: '4px' }}>
          {tool === 'text' ? (
            // Font size options for text tool
            [
              { size: 1, label: 'S', fontSize: '14px' },
              { size: 2, label: 'M', fontSize: '18px' },
              { size: 3, label: 'L', fontSize: '24px' },
              { size: 4, label: 'XL', fontSize: '32px' }
            ].map(({ size, label, fontSize }) => (
              <button
                key={size}
                onClick={() => setCurrentStrokeWidth(size)}
                style={{
                  width: '48px',
                  height: '32px',
                  border: currentStrokeWidth === size ? '2px solid #4299e1' : '1px solid #e2e8f0',
                  borderRadius: '4px',
                  backgroundColor: theme === 'light' ? '#ffffff' : '#4a5568',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: fontSize,
                  fontWeight: 'bold',
                  color: theme === 'light' ? '#4a5568' : '#f7fafc'
                }}
                title={`Font size: ${fontSize}`}
              >
                {label}
              </button>
            ))
          ) : (
            // Stroke width options for other tools
            [1, 2, 4, 8].map((width) => (
              <button
                key={width}
                onClick={() => setCurrentStrokeWidth(width)}
                style={{
                  width: '48px',
                  height: '32px',
                  border: currentStrokeWidth === width ? '2px solid #4299e1' : '1px solid #e2e8f0',
                  borderRadius: '4px',
                  backgroundColor: theme === 'light' ? '#ffffff' : '#4a5568',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{
                  width: '24px',
                  height: `${width}px`,
                  backgroundColor: theme === 'light' ? '#4a5568' : '#f7fafc',
                  borderRadius: '2px'
                }} />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Stroke Style */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '12px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: theme === 'light' ? '#4a5568' : '#a0aec0'
        }}>
          Stroke style
        </label>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { style: 'solid', icon: '—' },
            { style: 'dashed', icon: '- -' },
            { style: 'dotted', icon: '• • •' }
          ].map(({ style, icon }) => (
            <button
              key={style}
              onClick={() => setCurrentStrokeStyle(style as any)}
              style={{
                flex: 1,
                height: '32px',
                border: currentStrokeStyle === style ? '2px solid #4299e1' : '1px solid #e2e8f0',
                borderRadius: '4px',
                backgroundColor: theme === 'light' ? '#ffffff' : '#4a5568',
                cursor: 'pointer',
                fontSize: '12px',
                color: theme === 'light' ? '#4a5568' : '#f7fafc'
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Sloppiness/Roughness */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '12px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: theme === 'light' ? '#4a5568' : '#a0aec0'
        }}>
          Sloppiness
        </label>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0, 1, 2].map((level) => (
            <button
              key={level}
              onClick={() => setRoughness(level)}
              style={{
                flex: 1,
                height: '32px',
                border: roughness === level ? '2px solid #4299e1' : '1px solid #e2e8f0',
                borderRadius: '4px',
                backgroundColor: theme === 'light' ? '#ffffff' : '#4a5568',
                cursor: 'pointer',
                fontSize: '12px',
                color: theme === 'light' ? '#4a5568' : '#f7fafc'
              }}
            >
              {['～', '≈', '~'][level]}
            </button>
          ))}
        </div>
      </div>

      {/* Fill Style */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '12px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: theme === 'light' ? '#4a5568' : '#a0aec0'
        }}>
          Edges
        </label>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { style: 'solid', icon: '□' },
            { style: 'none', icon: '◯' }
          ].map(({ style, icon }) => (
            <button
              key={style}
              onClick={() => setCurrentFillStyle(style as any)}
              style={{
                flex: 1,
                height: '32px',
                border: currentFillStyle === style ? '2px solid #4299e1' : '1px solid #e2e8f0',
                borderRadius: '4px',
                backgroundColor: theme === 'light' ? '#ffffff' : '#4a5568',
                cursor: 'pointer',
                fontSize: '14px',
                color: theme === 'light' ? '#4a5568' : '#f7fafc'
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Opacity */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '12px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: theme === 'light' ? '#4a5568' : '#a0aec0'
        }}>
          Opacity
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', minWidth: '20px' }}>0</span>
          <input
            type="range"
            min="0"
            max="100"
            value={currentOpacity}
            onChange={(e) => setCurrentOpacity(Number(e.target.value))}
            style={{
              flex: 1,
              height: '4px',
              background: theme === 'light' ? '#e2e8f0' : '#4a5568',
              borderRadius: '2px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <span style={{ fontSize: '12px', minWidth: '30px' }}>100</span>
        </div>
      </div>
    </div>
  );
};
