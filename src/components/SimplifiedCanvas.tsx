import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';

interface SimplifiedCanvasProps {
  width: number;
  height: number;
}

export const SimplifiedCanvas: React.FC<SimplifiedCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);  const {
    tool,
    theme,
    gridEnabled,
    gridSize = 20,
    shapes,
    currentColor,
    currentBackgroundColor,
    currentStrokeWidth,
    currentOpacity,
    currentFont,
    createShape,
    updateShape,
    deleteShape,
    clearSelection
  } = useWhiteboardStore();

  // Get mouse position relative to canvas
  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height
    };
  }, []);

  // Clear and redraw canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (gridEnabled) {
      ctx.save();
      ctx.strokeStyle = theme === 'light' ? '#e5e7eb' : '#374151';
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.5;

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      ctx.restore();
    }

    // Draw all shapes
    Object.values(shapes).forEach(shape => {
      if (!shape.visible) return;

      ctx.save();
      ctx.strokeStyle = shape.stroke || currentColor;
      ctx.fillStyle = shape.fill === 'none' || !shape.fill ? 'transparent' : shape.fill;
      ctx.lineWidth = shape.strokeWidth || currentStrokeWidth;
      ctx.globalAlpha = (shape.opacity !== undefined ? shape.opacity : currentOpacity) / 100;

      switch (shape.type) {
        case 'rectangle':
          ctx.beginPath();
          ctx.rect(shape.x, shape.y, shape.width, shape.height);
          if (shape.fill && shape.fill !== 'none') ctx.fill();
          ctx.stroke();
          break;

        case 'ellipse':
          ctx.beginPath();
          ctx.ellipse(
            shape.x + shape.width / 2,
            shape.y + shape.height / 2,
            shape.width / 2,
            shape.height / 2,
            0,
            0,
            2 * Math.PI
          );
          if (shape.fill && shape.fill !== 'none') ctx.fill();
          ctx.stroke();
          break;

        case 'line':
          ctx.beginPath();
          ctx.moveTo(shape.x, shape.y);
          ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
          ctx.stroke();
          break;

        case 'arrow':
          // Draw line
          ctx.beginPath();
          ctx.moveTo(shape.x, shape.y);
          ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
          ctx.stroke();

          // Draw arrowhead
          const headLength = 15;
          const angle = Math.atan2(shape.height, shape.width);
          const x2 = shape.x + shape.width;
          const y2 = shape.y + shape.height;

          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(
            x2 - headLength * Math.cos(angle - Math.PI / 6),
            y2 - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(x2, y2);
          ctx.lineTo(
            x2 - headLength * Math.cos(angle + Math.PI / 6),
            y2 - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
          break;

        case 'diamond':
          const centerX = shape.x + shape.width / 2;
          const centerY = shape.y + shape.height / 2;
          ctx.beginPath();
          ctx.moveTo(centerX, shape.y);
          ctx.lineTo(shape.x + shape.width, centerY);
          ctx.lineTo(centerX, shape.y + shape.height);
          ctx.lineTo(shape.x, centerY);
          ctx.closePath();
          if (shape.fill && shape.fill !== 'none') ctx.fill();
          ctx.stroke();
          break;

        case 'text':
          if (shape.text) {
            const fontSize = (shape as any).fontSize || 16;
            const fontFamily = (shape as any).fontFamily || currentFont;
            const fontWeight = (shape as any).fontWeight || 'normal';
            ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
            ctx.fillStyle = shape.stroke || currentColor;
            
            // Handle multi-line text
            const lines = shape.text.split('\n');
            const lineHeight = fontSize * 1.4;
            
            // Draw text with proper line spacing
            lines.forEach((line, index) => {
              const y = shape.y + fontSize + (index * lineHeight);
              ctx.fillText(line, shape.x, y);
            });
            
            // Draw text editing indicator when text is being edited
            if (editingTextId === shape.id) {
              ctx.save();
              ctx.strokeStyle = '#3b82f6';
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);
              ctx.strokeRect(shape.x - 4, shape.y - 4, shape.width + 8, shape.height + 8);
              ctx.restore();
            }
          }
          break;

        case 'freehand':
          const freehandShape = shape as any;
          if (freehandShape.points && freehandShape.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(freehandShape.points[0].x, freehandShape.points[0].y);
            for (let i = 1; i < freehandShape.points.length; i++) {
              ctx.lineTo(freehandShape.points[i].x, freehandShape.points[i].y);
            }
            ctx.stroke();
          }
          break;
      }

      ctx.restore();
    });
  }, [shapes, theme, gridEnabled, gridSize, currentColor, currentStrokeWidth, currentOpacity, currentFont]);

  // Start text editing
  const startTextEditing = useCallback((shapeId: string) => {
    const shape = shapes[shapeId];
    if (!shape || shape.type !== 'text') return;

    setEditingTextId(shapeId);

    // Calculate positioning relative to canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create container to hold the textarea and controls
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      left: ${shape.x}px;
      top: ${shape.y - 50}px;
      z-index: 1000;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    `;
    
    // Create text controls panel
    const controlsPanel = document.createElement('div');
    controlsPanel.style.cssText = `
      display: flex;
      gap: 8px;
      align-items: center;
      background: ${theme === 'light' ? '#ffffff' : '#1f2937'};
      border: 1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'};
      border-radius: 6px;
      padding: 6px 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      pointer-events: auto;
      font-size: 12px;
    `;
    
    // Font size control
    const fontSizeLabel = document.createElement('label');
    fontSizeLabel.textContent = 'Size:';
    fontSizeLabel.style.cssText = `
      color: ${theme === 'light' ? '#374151' : '#f9fafb'};
      font-weight: 500;
    `;
    
    const fontSizeInput = document.createElement('input');
    fontSizeInput.type = 'number';
    fontSizeInput.value = ((shape as any).fontSize || 16).toString();
    fontSizeInput.min = '8';
    fontSizeInput.max = '72';
    fontSizeInput.style.cssText = `
      width: 60px;
      padding: 2px 4px;
      border: 1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'};
      border-radius: 3px;
      background: ${theme === 'light' ? '#ffffff' : '#374151'};
      color: ${theme === 'light' ? '#374151' : '#f9fafb'};
      font-size: 12px;
    `;
    
    // Color control
    const colorLabel = document.createElement('label');
    colorLabel.textContent = 'Color:';
    colorLabel.style.cssText = `
      color: ${theme === 'light' ? '#374151' : '#f9fafb'};
      font-weight: 500;
    `;
    
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = shape.stroke || currentColor;
    colorInput.style.cssText = `
      width: 40px;
      height: 24px;
      border: 1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'};
      border-radius: 3px;
      cursor: pointer;
    `;
    
    // Font family control
    const fontFamilySelect = document.createElement('select');
    fontFamilySelect.style.cssText = `
      padding: 2px 4px;
      border: 1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'};
      border-radius: 3px;
      background: ${theme === 'light' ? '#ffffff' : '#374151'};
      color: ${theme === 'light' ? '#374151' : '#f9fafb'};
      font-size: 12px;
    `;
    
    const fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Comic Sans MS', 'Impact'];
    fonts.forEach(font => {
      const option = document.createElement('option');
      option.value = font;
      option.textContent = font;
      if (font === ((shape as any).fontFamily || currentFont)) {
        option.selected = true;
      }
      fontFamilySelect.appendChild(option);
    });
    
    // Bold/Italic controls
    const boldButton = document.createElement('button');
    boldButton.textContent = 'B';
    boldButton.style.cssText = `
      width: 24px;
      height: 24px;
      border: 1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'};
      border-radius: 3px;
      background: ${(shape as any).fontWeight === 'bold' ? '#6366f1' : (theme === 'light' ? '#ffffff' : '#374151')};
      color: ${(shape as any).fontWeight === 'bold' ? 'white' : (theme === 'light' ? '#374151' : '#f9fafb')};
      font-weight: bold;
      cursor: pointer;
      font-size: 12px;
    `;
    
    // Assemble controls panel
    controlsPanel.appendChild(fontSizeLabel);
    controlsPanel.appendChild(fontSizeInput);
    controlsPanel.appendChild(colorLabel);
    controlsPanel.appendChild(colorInput);
    controlsPanel.appendChild(fontFamilySelect);
    controlsPanel.appendChild(boldButton);
    
    const textInput = document.createElement('textarea');
    textInput.value = shape.text || '';
    textInput.style.cssText = `
      position: relative;
      padding: 4px 8px;
      border: 2px solid #3b82f6;
      border-radius: 4px;
      background: ${theme === 'light' ? '#ffffff' : '#1f2937'};
      color: ${shape.stroke || currentColor};
      font-size: ${(shape as any).fontSize || 16}px;
      font-family: ${(shape as any).fontFamily || currentFont};
      font-weight: ${(shape as any).fontWeight || 'normal'};
      min-width: 50px;
      min-height: 24px;
      max-width: 400px;
      resize: none;
      outline: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      line-height: 1.2;
      overflow: hidden;
      white-space: pre-wrap;
      pointer-events: auto;
    `;

    // Auto-resize function
    const autoResize = () => {
      // Reset height to recalculate
      textInput.style.height = 'auto';
      textInput.style.height = Math.max(24, textInput.scrollHeight) + 'px';
      
      // Calculate width based on content
      const tempDiv = document.createElement('div');
      tempDiv.style.cssText = `
        position: absolute;
        visibility: hidden;
        height: auto;
        width: auto;
        white-space: pre;
        font: ${textInput.style.font};
        padding: ${textInput.style.padding};
        border: ${textInput.style.border};
      `;
      tempDiv.textContent = textInput.value || 'W';
      document.body.appendChild(tempDiv);
      
      const contentWidth = tempDiv.offsetWidth;
      document.body.removeChild(tempDiv);
      
      textInput.style.width = Math.min(Math.max(50, contentWidth + 10), 400) + 'px';
    };

    // Update text properties in real-time
    const updateTextProperties = () => {
      const fontSize = parseInt(fontSizeInput.value);
      const color = colorInput.value;
      const fontFamily = fontFamilySelect.value;
      const fontWeight = boldButton.style.background.includes('6366f1') ? 'bold' : 'normal';
      
      // Update textarea styling
      textInput.style.fontSize = fontSize + 'px';
      textInput.style.color = color;
      textInput.style.fontFamily = fontFamily;
      textInput.style.fontWeight = fontWeight;
      
      // Update the shape immediately
      updateShape(shapeId, {
        fontSize: fontSize,
        stroke: color,
        fontFamily: fontFamily,
        fontWeight: fontWeight
      });
      
      autoResize();
    };

    // Add event listeners for controls
    fontSizeInput.addEventListener('input', updateTextProperties);
    colorInput.addEventListener('input', updateTextProperties);
    fontFamilySelect.addEventListener('change', updateTextProperties);
    boldButton.addEventListener('click', () => {
      const isBold = boldButton.style.background.includes('6366f1');
      boldButton.style.background = isBold ? (theme === 'light' ? '#ffffff' : '#374151') : '#6366f1';
      boldButton.style.color = isBold ? (theme === 'light' ? '#374151' : '#f9fafb') : 'white';
      updateTextProperties();
    });

    container.appendChild(controlsPanel);
    container.appendChild(textInput);
    canvas.parentElement?.appendChild(container);
    
    textInput.focus();
    textInput.select();

    // Initial resize
    setTimeout(autoResize, 10);

    // Auto-resize on input
    textInput.addEventListener('input', autoResize);

    const finishEditing = () => {
      const text = textInput.value;
      
      if (text.trim()) {
        // Get current properties from controls
        const fontSize = parseInt(fontSizeInput.value);
        const color = colorInput.value;
        const fontFamily = fontFamilySelect.value;
        const fontWeight = boldButton.style.background.includes('6366f1') ? 'bold' : 'normal';
        
        // Calculate text dimensions for the shape
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        
        const lines = text.split('\n');
        const maxWidth = Math.max(...lines.map(line => tempCtx.measureText(line).width));
        const height = lines.length * fontSize * 1.2;
        
        // Update the shape with all properties
        updateShape(shapeId, { 
          text,
          fontSize,
          stroke: color,
          fontFamily,
          fontWeight,
          width: Math.max(50, maxWidth + 10),
          height: Math.max(24, height)
        });
      } else {
        // Delete empty text shapes
        deleteShape(shapeId);
      }
      
      // Clean up
      if (container.parentElement) {
        container.parentElement.removeChild(container);
      }
      setEditingTextId(null);
    };

    // Handle finishing text editing
    textInput.addEventListener('blur', finishEditing);
    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        finishEditing();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        finishEditing();
      }
      // Allow normal Enter for new lines
    });
  }, [shapes, theme, currentFont, updateShape, deleteShape]);

  // Redraw when shapes or settings change
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'hand' || tool === 'select') return;

    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPoint(pos);
    clearSelection();

    if (tool === 'draw') {
      setCurrentPath([pos]);
    }

    if (tool === 'text') {
      // Create text shape immediately and enter edit mode
      const style = {
        fill: currentBackgroundColor === 'transparent' ? 'none' : currentBackgroundColor,
        stroke: currentColor,
        strokeWidth: currentStrokeWidth,
        opacity: currentOpacity,
        visible: true,
        locked: false,
        zIndex: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const textShape = {
        type: 'text' as const,
        x: pos.x,
        y: pos.y,
        width: 200,
        height: 30,
        text: '',
        fontSize: Math.max(12, currentStrokeWidth * 2 + 8), // Map stroke width to font size
        fontFamily: currentFont,
        fontWeight: 'normal',
        textAlign: 'left' as const,
        verticalAlign: 'top' as const,
        ...style
      };

      const shapeId = createShape(textShape);
      
      // Start editing the text immediately
      setTimeout(() => {
        startTextEditing(shapeId);
      }, 10);
      
      setIsDrawing(false);
      return;
    }
  }, [tool, getMousePos, clearSelection, currentColor, currentBackgroundColor, currentStrokeWidth, currentOpacity, currentFont, createShape, startTextEditing]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;

    const pos = getMousePos(e);

    if (tool === 'draw') {
      // Add point only if it's far enough from the last point for smoother drawing
      const lastPoint = currentPath[currentPath.length - 1];
      const distance = Math.sqrt(Math.pow(pos.x - lastPoint.x, 2) + Math.pow(pos.y - lastPoint.y, 2));
      
      if (distance > 2) { // Minimum distance threshold
        setCurrentPath(prev => [...prev, pos]);
      }
      
      // Draw current path in real-time
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      redrawCanvas();
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.save();
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentStrokeWidth;
      ctx.globalAlpha = currentOpacity / 100;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      if (currentPath.length > 0) {
        ctx.moveTo(currentPath[0].x, currentPath[0].y);
        currentPath.forEach(point => ctx.lineTo(point.x, point.y));
      }
      ctx.stroke();
      ctx.restore();
    } else {
      // Preview shape while dragging
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      redrawCanvas();
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.save();
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentStrokeWidth;
      ctx.globalAlpha = currentOpacity / 100;
      
      const width = pos.x - startPoint.x;
      const height = pos.y - startPoint.y;

      switch (tool) {
        case 'rectangle':
          ctx.strokeRect(startPoint.x, startPoint.y, width, height);
          break;
        case 'ellipse':
          ctx.beginPath();
          ctx.ellipse(
            startPoint.x + width / 2,
            startPoint.y + height / 2,
            Math.abs(width) / 2,
            Math.abs(height) / 2,
            0,
            0,
            2 * Math.PI
          );
          ctx.stroke();
          break;
        case 'line':
        case 'arrow':
          ctx.beginPath();
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
          break;
        case 'diamond':
          const centerX = startPoint.x + width / 2;
          const centerY = startPoint.y + height / 2;
          ctx.beginPath();
          ctx.moveTo(centerX, startPoint.y);
          ctx.lineTo(startPoint.x + width, centerY);
          ctx.lineTo(centerX, startPoint.y + height);
          ctx.lineTo(startPoint.x, centerY);
          ctx.closePath();
          ctx.stroke();
          break;
      }
      
      ctx.restore();
    }
  }, [isDrawing, startPoint, tool, getMousePos, currentPath, redrawCanvas, currentColor, currentStrokeWidth, currentOpacity]);

  // Handle mouse up
  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;

    const pos = getMousePos(e);
    const style = {
      fill: currentBackgroundColor === 'transparent' ? 'none' : currentBackgroundColor,
      stroke: currentColor,
      strokeWidth: currentStrokeWidth,
      opacity: currentOpacity,
      visible: true,
      locked: false,
      zIndex: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    if (tool === 'draw') {
      if (currentPath.length > 1) {
        createShape({
          type: 'freehand',
          x: Math.min(...currentPath.map(p => p.x)),
          y: Math.min(...currentPath.map(p => p.y)),
          width: Math.max(...currentPath.map(p => p.x)) - Math.min(...currentPath.map(p => p.x)),
          height: Math.max(...currentPath.map(p => p.y)) - Math.min(...currentPath.map(p => p.y)),
          points: currentPath,
          ...style
        });
      }
      setCurrentPath([]);
    } else if (tool !== 'text' && tool !== 'select' && tool !== 'hand' && tool !== 'laser') {
      const width = pos.x - startPoint.x;
      const height = pos.y - startPoint.y;

      if (Math.abs(width) > 5 || Math.abs(height) > 5) {
        createShape({
          type: tool as any,
          x: Math.min(startPoint.x, pos.x),
          y: Math.min(startPoint.y, pos.y),
          width: Math.abs(width),
          height: Math.abs(height),
          ...style
        });
      }
    }

    setIsDrawing(false);
    setStartPoint(null);
  }, [isDrawing, startPoint, tool, getMousePos, currentPath, currentColor, currentBackgroundColor, currentStrokeWidth, currentOpacity, createShape]);

  // Handle double click for text editing
  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    
    // Find text shapes at this position
    const textShape = Object.values(shapes).find(shape => {
      return shape.type === 'text' &&
             pos.x >= shape.x && pos.x <= shape.x + shape.width &&
             pos.y >= shape.y && pos.y <= shape.y + shape.height;
    });
    
    if (textShape) {
      startTextEditing(textShape.id);
    }
  }, [shapes, startTextEditing, getMousePos]);

  // Get cursor style based on current tool
  const getCursorStyle = useCallback(() => {
    switch (tool) {
      case 'hand': return 'grab';
      case 'select': return 'default';
      case 'text': return 'text';
      case 'eraser': return 'cell';
      default: return 'crosshair';
    }
  }, [tool]);

  return (
    <div style={{ 
      position: 'relative', 
      display: 'inline-block',
      border: '1px solid ' + (theme === 'light' ? '#e5e7eb' : '#374151'),
      borderRadius: '8px',
      overflow: 'visible'
    }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
          cursor: getCursorStyle(),
          display: 'block',
          borderRadius: '8px'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onMouseLeave={() => {
          setIsDrawing(false);
          setStartPoint(null);
          setCurrentPath([]);
        }}
      />
      
      {/* Tool status indicator */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        backgroundColor: theme === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        color: theme === 'light' ? 'white' : 'black',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        backdropFilter: 'blur(4px)',
        pointerEvents: 'none'
      }}>
        {tool.charAt(0).toUpperCase() + tool.slice(1)} Tool
      </div>
    </div>
  );
};
