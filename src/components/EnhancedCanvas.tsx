import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';
import type { Shape } from '../types';

interface EnhancedCanvasProps {
  width: number;
  height: number;
}

interface DrawingState {
  isDrawing: boolean;
  startPoint: { x: number; y: number } | null;
  currentPath: { x: number; y: number }[];
}

export const EnhancedCanvas: React.FC<EnhancedCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPath: []
  });
  
  const { 
    tool, 
    theme, 
    gridEnabled, 
    gridSize = 20, 
    zoom = 1, 
    panX = 0, 
    panY = 0,
    shapes,
    currentColor,
    currentStrokeWidth,
    createShape,
    selectedShapeIds,
    selectShape,
    clearSelection
  } = useWhiteboardStore();

  // Get mouse position relative to canvas
  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  }, []);

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    
    if (tool === 'select') {
      // Handle selection
      clearSelection();
      return;
    }

    setDrawingState({
      isDrawing: true,
      startPoint: pos,
      currentPath: tool === 'draw' ? [pos] : []
    });

    if (tool === 'text') {
      // For text tool, create text shape immediately
      const textContent = prompt('Enter text:') || 'Text';
      createShape({
        type: 'text',
        x: pos.x,
        y: pos.y,
        width: 100,
        height: 30,
        content: textContent,
        fill: currentColor,
        fontSize: currentStrokeWidth * 8,
        fontFamily: 'Arial'
      });
    }
  }, [tool, getMousePos, clearSelection, createShape, currentColor, currentStrokeWidth]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingState.isDrawing || !drawingState.startPoint) return;

    const pos = getMousePos(e);

    if (tool === 'draw') {
      setDrawingState(prev => ({
        ...prev,
        currentPath: [...prev.currentPath, pos]
      }));
    }

    // Redraw canvas with current drawing
    drawCanvas(pos);
  }, [drawingState, tool, getMousePos]);

  // Handle mouse up
  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingState.isDrawing || !drawingState.startPoint) return;

    const pos = getMousePos(e);

    // Create the final shape
    if (tool === 'rectangle') {
      createShape({
        type: 'rectangle',
        x: Math.min(drawingState.startPoint.x, pos.x),
        y: Math.min(drawingState.startPoint.y, pos.y),
        width: Math.abs(pos.x - drawingState.startPoint.x),
        height: Math.abs(pos.y - drawingState.startPoint.y),
        stroke: currentColor,
        strokeWidth: currentStrokeWidth
      });
    } else if (tool === 'ellipse') {
      const centerX = (drawingState.startPoint.x + pos.x) / 2;
      const centerY = (drawingState.startPoint.y + pos.y) / 2;
      const radiusX = Math.abs(pos.x - drawingState.startPoint.x) / 2;
      const radiusY = Math.abs(pos.y - drawingState.startPoint.y) / 2;
      
      createShape({
        type: 'ellipse',
        x: centerX - radiusX,
        y: centerY - radiusY,
        width: radiusX * 2,
        height: radiusY * 2,
        stroke: currentColor,
        strokeWidth: currentStrokeWidth
      });
    } else if (tool === 'line') {
      createShape({
        type: 'line',
        x: drawingState.startPoint.x,
        y: drawingState.startPoint.y,
        width: pos.x - drawingState.startPoint.x,
        height: pos.y - drawingState.startPoint.y,
        stroke: currentColor,
        strokeWidth: currentStrokeWidth,
        points: [0, 0, pos.x - drawingState.startPoint.x, pos.y - drawingState.startPoint.y]
      });
    } else if (tool === 'draw' && drawingState.currentPath.length > 1) {
      const points = drawingState.currentPath.flatMap(p => [p.x, p.y]);
      createShape({
        type: 'draw',
        x: Math.min(...drawingState.currentPath.map(p => p.x)),
        y: Math.min(...drawingState.currentPath.map(p => p.y)),
        width: Math.max(...drawingState.currentPath.map(p => p.x)) - Math.min(...drawingState.currentPath.map(p => p.x)),
        height: Math.max(...drawingState.currentPath.map(p => p.y)) - Math.min(...drawingState.currentPath.map(p => p.y)),
        stroke: currentColor,
        strokeWidth: currentStrokeWidth,
        points
      });
    }

    setDrawingState({
      isDrawing: false,
      startPoint: null,
      currentPath: []
    });
  }, [drawingState, tool, getMousePos, createShape, currentColor, currentStrokeWidth]);

  // Draw everything on canvas
  const drawCanvas = useCallback((currentPos?: { x: number; y: number }) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set canvas background
    ctx.fillStyle = theme === 'light' ? '#ffffff' : '#1f2937';
    ctx.fillRect(0, 0, width, height);

    if (gridEnabled) {
      // Draw grid
      ctx.strokeStyle = theme === 'light' ? '#e5e7eb' : '#374151';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 2]);

      const scaledGridSize = gridSize * zoom;
      const offsetX = panX % scaledGridSize;
      const offsetY = panY % scaledGridSize;

      // Draw vertical lines
      for (let x = offsetX; x < width; x += scaledGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = offsetY; y < height; y += scaledGridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.setLineDash([]);
    }

    // Draw center info
    ctx.fillStyle = theme === 'light' ? '#6b7280' : '#9ca3af';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Current tool: ${tool}`, width / 2, height / 2 - 20);
    ctx.fillText(`Grid: ${gridEnabled ? 'ON' : 'OFF'}`, width / 2, height / 2);
    ctx.fillText(`Size: ${width} × ${height}`, width / 2, height / 2 + 20);

  }, [width, height, theme, gridEnabled, gridSize, zoom, panX, panY, tool]);

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
      cursor: 'crosshair',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <canvas 
        ref={canvasRef}
        style={{ 
          display: 'block',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      />
    </div>
  );
};
