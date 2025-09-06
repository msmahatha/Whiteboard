import React, { useState } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';

export const HelpModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useWhiteboardStore();

  const shortcuts = [
    { keys: '1', action: 'Select Tool' },
    { keys: '2', action: 'Hand Tool' },
    { keys: '3', action: 'Rectangle' },
    { keys: '4', action: 'Diamond' },
    { keys: '5', action: 'Ellipse' },
    { keys: '6', action: 'Arrow' },
    { keys: '7', action: 'Line' },
    { keys: '8', action: 'Draw' },
    { keys: '9', action: 'Eraser' },
    { keys: 'T', action: 'Text Tool' },
    { keys: 'V', action: 'Select Tool' },
    { keys: 'H', action: 'Hand Tool' },
    { keys: 'R', action: 'Rectangle' },
    { keys: 'O', action: 'Ellipse' },
    { keys: 'A', action: 'Arrow' },
    { keys: 'L', action: 'Line' },
    { keys: 'D', action: 'Diamond' },
    { keys: 'P', action: 'Draw' },
    { keys: 'E', action: 'Eraser' },
    { keys: 'Esc', action: 'Select Tool' },
    { keys: 'Ctrl+Z', action: 'Undo' },
    { keys: 'Ctrl+Y', action: 'Redo' },
    { keys: 'Ctrl+S', action: 'Save' },
    { keys: 'Enter', action: 'Finish Text Edit' },
    { keys: 'Ctrl+B', action: 'Bold Text' },
    { keys: 'Ctrl+I', action: 'Italic Text' },
    { keys: 'Ctrl+U', action: 'Underline Text' },
  ];

  const textInstructions = [
    'Click with Text tool to create text',
    'Double-click existing text to edit',
    'Use toolbar for font, size, and formatting',
    'Drag text with Select tool',
    'Resize text with corner handles',
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: '#3b82f6',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
        title="Help & Shortcuts"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        ?
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(4px)'
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        style={{
          backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
          color: theme === 'light' ? '#000000' : '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          margin: '20px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Help & Shortcuts</h2>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: theme === 'light' ? '#666' : '#ccc',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Keyboard Shortcuts */}
          <div>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
              Keyboard Shortcuts
            </h3>
            <div style={{ maxHeight: '300px', overflow: 'auto' }}>
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`
                  }}
                >
                  <kbd style={{
                    backgroundColor: theme === 'light' ? '#f3f4f6' : '#374151',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`
                  }}>
                    {shortcut.keys}
                  </kbd>
                  <span style={{ fontSize: '14px' }}>{shortcut.action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Text Tool Instructions */}
          <div>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
              Text Tool Guide
            </h3>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              {textInstructions.map((instruction, index) => (
                <div
                  key={index}
                  style={{
                    padding: '8px 0',
                    borderBottom: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`
                  }}
                >
                  • {instruction}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
                Drawing Tools
              </h4>
              <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                <div>• Click and drag to create shapes</div>
                <div>• Use Select tool to move and resize</div>
                <div>• Enable grid for precise alignment</div>
                <div>• All shapes are draggable and resizable</div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '12px',
            color: theme === 'light' ? '#666' : '#999'
          }}
        >
          Press ESC or click outside to close
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
