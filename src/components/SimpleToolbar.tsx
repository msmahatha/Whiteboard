import React, { useState } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';
import { StylePanel } from './StylePanel';
import { ColorPicker } from './ColorPicker';

export const SimpleToolbar: React.FC = () => {
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const { 
    tool, 
    setTool, 
    theme, 
    toggleTheme, 
    gridEnabled, 
    toggleGrid,
    locked,
    toggleLocked,
    currentStrokeWidth,
    setCurrentStrokeWidth,
    currentFont,
    setCurrentFont,
    clearCanvas,
    undo,
    redo,
    currentColor,
    selectedShapeIds,
    duplicateSelectedShapes,
    deleteSelectedShapes
  } = useWhiteboardStore();

  const toolsConfig = [
    { id: 'lock', icon: '🔒', label: 'Lock', shortcut: '1', action: () => toggleLocked() },
    { id: 'hand', icon: '🤚', label: 'Hand', shortcut: '2', tool: 'hand' },
    { id: 'select', icon: '↖️', label: 'Select', shortcut: '3', tool: 'select' },
    { id: 'rectangle', icon: '⬜', label: 'Rectangle', shortcut: '4', tool: 'rectangle' },
    { id: 'diamond', icon: '◇', label: 'Diamond', shortcut: '5', tool: 'diamond' },
    { id: 'ellipse', icon: '○', label: 'Ellipse', shortcut: '6', tool: 'ellipse' },
    { id: 'arrow', icon: '→', label: 'Arrow', shortcut: '7', tool: 'arrow' },
    { id: 'line', icon: '—', label: 'Line', shortcut: '8', tool: 'line' },
    { id: 'draw', icon: '✏️', label: 'Draw', shortcut: '9', tool: 'draw' },
    { id: 'text', icon: 'T', label: 'Text', shortcut: 'T', tool: 'text' },
    { id: 'image', icon: '🖼️', label: 'Image', shortcut: 'I', tool: 'image' },
    { id: 'eraser', icon: '🧹', label: 'Eraser', shortcut: 'E', tool: 'eraser' },
  ];

  const handleToolClick = (toolConfig: any) => {
    if (toolConfig.action) {
      toolConfig.action();
    } else if (toolConfig.tool) {
      setTool(toolConfig.tool as any);
    }
  };

  const getButtonStyle = (toolConfig: any) => {
    let isActive = false;
    
    if (toolConfig.id === 'lock') {
      isActive = locked;
    } else if (toolConfig.tool) {
      isActive = tool === toolConfig.tool;
    }
    
    return {
      position: 'relative' as const,
      minWidth: '48px',
      height: '48px',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: isActive ? '#6366f1' : 'transparent',
      color: isActive ? 'white' : (theme === 'light' ? '#374151' : '#f9fafb'),
      cursor: 'pointer',
      fontSize: '18px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2px',
      transition: 'all 0.2s ease',
    };
  };

  return (
    <div style={{
      backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
      borderBottom: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
      padding: '12px 16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px'
    }}>
      {/* Tools Container */}
      <div style={{
        backgroundColor: theme === 'light' ? '#f8fafc' : '#374151',
        border: `1px solid ${theme === 'light' ? '#e2e8f0' : '#4b5563'}`,
        borderRadius: '12px',
        padding: '8px',
        display: 'flex',
        gap: '4px',
        boxShadow: theme === 'light' 
          ? '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)' 
          : '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}>
        {toolsConfig.map((toolConfig) => (
          <div key={toolConfig.id} style={{ position: 'relative' }}>
            <button
              onClick={() => handleToolClick(toolConfig)}
              style={getButtonStyle(toolConfig)}
              title={`${toolConfig.label} (${toolConfig.shortcut})`}
              onMouseEnter={(e) => {
                const isActive = toolConfig.id === 'lock' ? locked : tool === toolConfig.tool;
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = theme === 'light' ? '#f3f4f6' : '#4b5563';
                }
              }}
              onMouseLeave={(e) => {
                const isActive = toolConfig.id === 'lock' ? locked : tool === toolConfig.tool;
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{toolConfig.icon}</span>
              <span style={{ 
                position: 'absolute',
                bottom: '2px',
                right: '4px',
                fontSize: '10px',
                fontWeight: '500',
                opacity: 0.7
              }}>
                {toolConfig.shortcut}
              </span>
            </button>
          </div>
        ))}
      </div>
      
      {/* Controls Container */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* Font Size Selector (using stroke width as font size) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ 
            fontSize: '12px', 
            color: theme === 'light' ? '#6b7280' : '#9ca3af',
            fontWeight: '500'
          }}>
            Size:
          </span>
          <select
            value={currentStrokeWidth}
            onChange={(e) => setCurrentStrokeWidth(Number(e.target.value))}
            style={{
              padding: '4px 8px',
              border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
              borderRadius: '4px',
              backgroundColor: theme === 'light' ? '#ffffff' : '#374151',
              color: theme === 'light' ? '#374151' : '#f9fafb',
              fontSize: '12px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value={1}>12px</option>
            <option value={2}>16px</option>
            <option value={3}>20px</option>
            <option value={4}>24px</option>
            <option value={5}>28px</option>
            <option value={6}>32px</option>
            <option value={7}>36px</option>
            <option value={8}>40px</option>
          </select>
        </div>

        {/* Font Family Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ 
            fontSize: '12px', 
            color: theme === 'light' ? '#6b7280' : '#9ca3af',
            fontWeight: '500'
          }}>
            Font:
          </span>
          <select
            value={currentFont}
            onChange={(e) => setCurrentFont(e.target.value)}
            style={{
              padding: '4px 8px',
              border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
              borderRadius: '4px',
              backgroundColor: theme === 'light' ? '#ffffff' : '#374151',
              color: theme === 'light' ? '#374151' : '#f9fafb',
              fontSize: '12px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times</option>
            <option value="Courier New">Courier</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
            <option value="Comic Sans MS">Comic Sans</option>
            <option value="Impact">Impact</option>
          </select>
        </div>

        {/* Color Picker Button */}
        <button
          onClick={() => setShowColorPicker(true)}
          style={{
            padding: '8px 12px',
            border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
            borderRadius: '6px',
            backgroundColor: theme === 'light' ? '#ffffff' : '#374151',
            color: theme === 'light' ? '#374151' : '#f9fafb',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="Choose Color"
        >
          <div style={{
            width: '16px',
            height: '16px',
            backgroundColor: currentColor,
            borderRadius: '3px',
            border: '1px solid ' + (theme === 'light' ? '#d1d5db' : '#4b5563')
          }} />
          Color
        </button>

        {/* Undo Button */}
        <button
          onClick={undo}
          style={{
            padding: '8px 12px',
            border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
            borderRadius: '6px',
            backgroundColor: theme === 'light' ? '#ffffff' : '#374151',
            color: theme === 'light' ? '#374151' : '#f9fafb',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>

        {/* Redo Button */}
        <button
          onClick={redo}
          style={{
            padding: '8px 12px',
            border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
            borderRadius: '6px',
            backgroundColor: theme === 'light' ? '#ffffff' : '#374151',
            color: theme === 'light' ? '#374151' : '#f9fafb',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          title="Redo (Ctrl+Y)"
        >
          ↷ Redo
        </button>

        {/* Copy Button */}
        <button
          onClick={duplicateSelectedShapes}
          disabled={selectedShapeIds.length === 0}
          style={{
            padding: '8px 12px',
            border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
            borderRadius: '6px',
            backgroundColor: selectedShapeIds.length === 0 
              ? (theme === 'light' ? '#f3f4f6' : '#2d3748')
              : (theme === 'light' ? '#ffffff' : '#374151'),
            color: selectedShapeIds.length === 0 
              ? (theme === 'light' ? '#9ca3af' : '#6b7280')
              : (theme === 'light' ? '#374151' : '#f9fafb'),
            cursor: selectedShapeIds.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          title="Duplicate Selected (Ctrl+D)"
        >
          📋 Copy
        </button>

        {/* Delete Button */}
        <button
          onClick={deleteSelectedShapes}
          disabled={selectedShapeIds.length === 0}
          style={{
            padding: '8px 12px',
            border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
            borderRadius: '6px',
            backgroundColor: selectedShapeIds.length === 0 
              ? (theme === 'light' ? '#f3f4f6' : '#2d3748')
              : (theme === 'light' ? '#fef2f2' : '#7f1d1d'),
            color: selectedShapeIds.length === 0 
              ? (theme === 'light' ? '#9ca3af' : '#6b7280')
              : (theme === 'light' ? '#dc2626' : '#fca5a5'),
            cursor: selectedShapeIds.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          title="Delete Selected (Delete)"
        >
          🗑️ Delete
        </button>

        <button
          onClick={toggleTheme}
          style={{
            padding: '8px 12px',
            border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
            borderRadius: '6px',
            backgroundColor: theme === 'light' ? '#ffffff' : '#374151',
            color: theme === 'light' ? '#374151' : '#f9fafb',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          title="Toggle Theme"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        
        <button
          onClick={toggleGrid}
          style={{
            padding: '8px 12px',
            border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
            borderRadius: '6px',
            backgroundColor: gridEnabled ? '#6366f1' : (theme === 'light' ? '#ffffff' : '#374151'),
            color: gridEnabled ? 'white' : (theme === 'light' ? '#374151' : '#f9fafb'),
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          title="Toggle Grid"
        >
          ⊞ Grid
        </button>

        {/* Clear Button */}
        <button
          onClick={() => {
            if (window.confirm('Clear all shapes? This action cannot be undone.')) {
              clearCanvas();
            }
          }}
          style={{
            padding: '8px 12px',
            border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
            borderRadius: '6px',
            backgroundColor: theme === 'light' ? '#ffffff' : '#374151',
            color: theme === 'light' ? '#374151' : '#f9fafb',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          title="Clear All"
        >
          🗑️ Clear
        </button>

        {/* Style Panel Toggle */}
        <button
          onClick={() => setShowStylePanel(!showStylePanel)}
          style={{
            padding: '8px 12px',
            border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
            borderRadius: '6px',
            backgroundColor: showStylePanel ? '#6366f1' : (theme === 'light' ? '#ffffff' : '#374151'),
            color: showStylePanel ? 'white' : (theme === 'light' ? '#374151' : '#f9fafb'),
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          title="Toggle Style Panel"
        >
          🎨 Style
        </button>
      </div>

      {/* Style Panel */}
      <StylePanel 
        isOpen={showStylePanel} 
        onClose={() => setShowStylePanel(false)} 
      />

      {/* Color Picker */}
      <ColorPicker 
        isOpen={showColorPicker} 
        onClose={() => setShowColorPicker(false)} 
      />
    </div>
  );
};
