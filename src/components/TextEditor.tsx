import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { TextShape } from '../types';

interface TextEditorProps {
  shape: TextShape;
  onUpdate: (updates: Partial<TextShape>) => void;
  onFinish: () => void;
  onCancel: () => void;
  scale: number;
  isEditing: boolean;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  shape,
  onUpdate,
  onFinish,
  onCancel,
  scale = 1,
  isEditing
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(shape.text);
  const [isBold, setIsBold] = useState(shape.fontWeight === 'bold');
  const [isItalic, setIsItalic] = useState(shape.fontFamily.includes('italic'));
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontSize, setFontSize] = useState(shape.fontSize);
  const [fontFamily, setFontFamily] = useState(shape.fontFamily.replace(/italic/g, '').trim());
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>(shape.textAlign);

  // Focus and select all text when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFinish();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    } else if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          toggleBold();
          break;
        case 'i':
          e.preventDefault();
          toggleItalic();
          break;
        case 'u':
          e.preventDefault();
          toggleUnderline();
          break;
      }
    }
  }, []);

  const toggleBold = useCallback(() => {
    setIsBold(prev => !prev);
  }, []);

  const toggleItalic = useCallback(() => {
    setIsItalic(prev => !prev);
  }, []);

  const toggleUnderline = useCallback(() => {
    setIsUnderline(prev => !prev);
  }, []);

  const handleFinish = useCallback(() => {
    const finalFontFamily = `${fontFamily}${isItalic ? ' italic' : ''}`;
    const updates: Partial<TextShape> = {
      text: text.trim(),
      fontSize,
      fontFamily: finalFontFamily,
      fontWeight: isBold ? 'bold' : 'normal',
      textAlign,
      // Calculate new dimensions based on text content
      width: Math.max(100, text.length * fontSize * 0.6),
      height: Math.max(fontSize + 10, (text.split('\n').length) * fontSize * 1.2 + 10)
    };
    
    onUpdate(updates);
    onFinish();
  }, [text, fontSize, fontFamily, isBold, isItalic, textAlign, onUpdate, onFinish]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  if (!isEditing) {
    return null;
  }

  const textStyle: React.CSSProperties = {
    position: 'absolute',
    left: shape.x * scale,
    top: shape.y * scale,
    width: Math.max(100, shape.width * scale),
    minHeight: shape.height * scale,
    fontSize: fontSize * scale,
    fontFamily: `${fontFamily}${isItalic ? ', italic' : ''}`,
    fontWeight: isBold ? 'bold' : 'normal',
    textDecoration: isUnderline ? 'underline' : 'none',
    textAlign,
    color: shape.stroke,
    backgroundColor: shape.fill === 'none' ? 'transparent' : shape.fill,
    border: '2px solid #3b82f6',
    borderRadius: '4px',
    padding: '4px 8px',
    resize: 'none',
    outline: 'none',
    overflow: 'hidden',
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const toolbarStyle: React.CSSProperties = {
    position: 'absolute',
    left: shape.x * scale,
    top: (shape.y - 40) * scale,
    display: 'flex',
    gap: '4px',
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    zIndex: 1001
  };

  const buttonStyle: React.CSSProperties = {
    padding: '4px 8px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500'
  };

  const activeButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
    color: '#fff',
    borderColor: '#3b82f6'
  };

  return (
    <>
      {/* Text editing toolbar */}
      <div style={toolbarStyle}>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          style={{ ...buttonStyle, minWidth: '80px' }}
        >
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times</option>
          <option value="Courier New">Courier</option>
          <option value="Verdana">Verdana</option>
          <option value="Georgia">Georgia</option>
        </select>
        
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(Math.max(8, Math.min(72, parseInt(e.target.value) || 16)))}
          style={{ ...buttonStyle, width: '50px' }}
          min="8"
          max="72"
        />
        
        <button
          onClick={toggleBold}
          style={isBold ? activeButtonStyle : buttonStyle}
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        
        <button
          onClick={toggleItalic}
          style={isItalic ? activeButtonStyle : buttonStyle}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        
        <button
          onClick={toggleUnderline}
          style={isUnderline ? activeButtonStyle : buttonStyle}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
        
        <select
          value={textAlign}
          onChange={(e) => setTextAlign(e.target.value as 'left' | 'center' | 'right')}
          style={{ ...buttonStyle, minWidth: '60px' }}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
        
        <button
          onClick={handleFinish}
          style={{ ...buttonStyle, backgroundColor: '#10b981', color: '#fff', borderColor: '#10b981' }}
          title="Finish (Enter)"
        >
          ✓
        </button>
        
        <button
          onClick={onCancel}
          style={{ ...buttonStyle, backgroundColor: '#ef4444', color: '#fff', borderColor: '#ef4444' }}
          title="Cancel (Esc)"
        >
          ✕
        </button>
      </div>

      {/* Text input area */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onBlur={handleFinish}
        style={textStyle}
        placeholder="Enter text..."
        spellCheck={false}
      />
    </>
  );
};

export default TextEditor;
