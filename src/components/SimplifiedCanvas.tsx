import React, { useRef, useEffect, useState, useCallback, forwardRef } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';
import { TextEditor } from './TextEditor';
import { ResizeHandles } from './ResizeHandles';
import type { TextShape } from '../types';

interface SimplifiedCanvasProps {
  width: number;
  height: number;
}

export const SimplifiedCanvas = forwardRef<HTMLCanvasElement, SimplifiedCanvasProps>(({ width, height }, ref) => {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = (ref as React.RefObject<HTMLCanvasElement>) || internalCanvasRef;
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedShapeId, setDraggedShapeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isTextEditing, setIsTextEditing] = useState(false);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);  const {
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

  // Find shape under mouse position
  const getShapeUnderMouse = useCallback((pos: { x: number; y: number }) => {
    // Check shapes in reverse order (top to bottom) to get the topmost shape
    const shapeArray = Object.values(shapes).sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
    
    for (const shape of shapeArray) {
      if (!shape.visible || shape.locked) continue;
      
      // Check if point is inside shape bounds
      if (pos.x >= shape.x && pos.x <= shape.x + shape.width &&
          pos.y >= shape.y && pos.y <= shape.y + shape.height) {
        return shape;
      }
    }
    return null;
  }, [shapes]);

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
    setEditingTextId(shapeId);
    setIsTextEditing(true);
  }, []);

  const finishTextEditing = useCallback(() => {
    setEditingTextId(null);
    setIsTextEditing(false);
  }, []);

  const cancelTextEditing = useCallback(() => {
    if (editingTextId) {
      const textShape = shapes[editingTextId];
      if (textShape && textShape.type === 'text' && textShape.text.trim() === '') {
        // Delete empty text shapes
        deleteShape(editingTextId);
      }
    }
    setEditingTextId(null);
    setIsTextEditing(false);
  }, [editingTextId, shapes, deleteShape]);

  const updateTextShape = useCallback((updates: Partial<TextShape>) => {
    if (editingTextId) {
      updateShape(editingTextId, updates);
    }
  }, [editingTextId, updateShape]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when text editing
      if (!isTextEditing) return;
      
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        finishTextEditing();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelTextEditing();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isTextEditing, finishTextEditing, cancelTextEditing]);

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // Disable interactions while text editing
    if (isTextEditing) return;

    const pos = getMousePos(e);

    // Check if we're clicking on an existing shape for dragging or selection (when selection tool is active)
    if (tool === 'select') {
      const shapeUnderMouse = getShapeUnderMouse(pos);
      if (shapeUnderMouse) {
        setSelectedShapeId(shapeUnderMouse.id);
        setIsDragging(true);
        setDraggedShapeId(shapeUnderMouse.id);
        setDragOffset({
          x: pos.x - shapeUnderMouse.x,
          y: pos.y - shapeUnderMouse.y
        });
        return;
      } else {
        // Clear selection if clicking on empty space
        setSelectedShapeId(null);
      }
    }

    if (tool === 'hand' || tool === 'select') return;

    setIsDrawing(true);
    setStartPoint(pos);
    clearSelection();

    if (tool === 'draw') {
      setCurrentPath([pos]);
    }

    if (tool === 'text') {
      // Create text shape with default properties
      const textShape = {
        type: 'text' as const,
        x: pos.x,
        y: pos.y,
        width: 200,
        height: 30,
        rotation: 0,
        text: '',
        fontSize: 16, // Default 16px as requested
        fontFamily: 'Arial', // Default Arial as requested
        fontWeight: 'normal' as const,
        textAlign: 'left' as const,
        verticalAlign: 'top' as const,
        fill: currentBackgroundColor === 'transparent' ? 'none' : currentBackgroundColor,
        fillStyle: 'solid' as const,
        stroke: currentColor,
        strokeWidth: 0, // Text doesn't need stroke by default
        strokeStyle: 'solid' as const,
        roughness: 0,
        opacity: currentOpacity,
        visible: true,
        locked: false,
        zIndex: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const shapeId = createShape(textShape);
      
      // Start editing the text immediately
      setEditingTextId(shapeId);
      setIsTextEditing(true);
      
      setIsDrawing(false);
      return;
    }
  }, [tool, getMousePos, clearSelection, currentColor, currentBackgroundColor, currentStrokeWidth, currentOpacity, currentFont, createShape, getShapeUnderMouse]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // Disable interactions while text editing (except for cursor updates)
    if (isTextEditing && !isDragging) return;

    const pos = getMousePos(e);

    // Update cursor style when hovering over draggable shapes
    if (tool === 'select' && !isDragging) {
      const shapeUnderMouse = getShapeUnderMouse(pos);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.cursor = shapeUnderMouse ? 'move' : 'default';
      }
    }

    // Handle dragging of shapes
    if (isDragging && draggedShapeId) {
      const newX = pos.x - dragOffset.x;
      const newY = pos.y - dragOffset.y;
      
      updateShape(draggedShapeId, { x: newX, y: newY });
      return;
    }

    if (!isDrawing || !startPoint) return;

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
  }, [isDrawing, startPoint, tool, getMousePos, currentPath, redrawCanvas, currentColor, currentStrokeWidth, currentOpacity, isDragging, draggedShapeId, dragOffset, updateShape, getShapeUnderMouse]);

  // Handle mouse up
  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // Disable interactions while text editing
    if (isTextEditing && !isDragging) return;
    // Handle end of dragging
    if (isDragging) {
      setIsDragging(false);
      setDraggedShapeId(null);
      setDragOffset({ x: 0, y: 0 });
      return;
    }

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
  }, [isDrawing, startPoint, tool, getMousePos, currentPath, currentColor, currentBackgroundColor, currentStrokeWidth, currentOpacity, createShape, isDragging]);

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
      
      {/* Text Editor Component */}
      {editingTextId && shapes[editingTextId] && shapes[editingTextId].type === 'text' && (
        <TextEditor
          shape={shapes[editingTextId] as TextShape}
          onUpdate={updateTextShape}
          onFinish={finishTextEditing}
          onCancel={cancelTextEditing}
          scale={1}
          isEditing={isTextEditing}
        />
      )}
      
      {/* Resize Handles for Selected Shape */}
      {selectedShapeId && shapes[selectedShapeId] && !isTextEditing && (
        <ResizeHandles
          shape={shapes[selectedShapeId]}
          onResize={(updates) => updateShape(selectedShapeId, updates)}
          scale={1}
        />
      )}
      
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
});
