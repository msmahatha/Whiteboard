import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';
import type { TextShape } from '../types';

interface EnhancedCanvasProps {
  width: number;
  height: number;
}

interface DrawingState {
  isDrawing: boolean;
  startPoint: { x: number; y: number } | null;
  currentPoint: { x: number; y: number } | null;
  currentPath: { x: number; y: number }[];
}

export const WorkingCanvas: React.FC<EnhancedCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
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
    currentBackgroundColor,
    currentStrokeWidth,
    currentStrokeStyle,
    currentFillStyle,
    currentOpacity,
    roughness,
    currentFont,
    createShape,
    updateShape,
    deleteShape,
    clearSelection
  } = useWhiteboardStore();

  // Get current style properties for new shapes
  const getCurrentStyle = useCallback(() => ({
    fill: currentBackgroundColor === 'transparent' ? 'none' : currentBackgroundColor,
    fillStyle: currentFillStyle,
    stroke: currentColor,
    strokeWidth: currentStrokeWidth,
    strokeStyle: currentStrokeStyle,
    roughness: roughness,
    opacity: currentOpacity,
    visible: true,
    locked: false,
    zIndex: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now()
  }), [currentBackgroundColor, currentFillStyle, currentColor, currentStrokeWidth, currentStrokeStyle, roughness, currentOpacity]);

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

  // Draw shapes on canvas
  const drawShape = useCallback((ctx: CanvasRenderingContext2D, shape: any) => {
    // Apply shape styling
    ctx.strokeStyle = shape.stroke || currentColor;
    ctx.lineWidth = shape.strokeWidth || currentStrokeWidth;
    ctx.fillStyle = shape.fill === 'none' ? 'transparent' : (shape.fill || 'transparent');
    ctx.globalAlpha = (shape.opacity !== undefined ? shape.opacity : currentOpacity) / 100;
    
    // Apply stroke style (solid, dashed, dotted)
    const strokeStyle = shape.strokeStyle || currentStrokeStyle;
    if (strokeStyle === 'dashed') {
      ctx.setLineDash([5, 5]);
    } else if (strokeStyle === 'dotted') {
      ctx.setLineDash([2, 3]);
    } else {
      ctx.setLineDash([]);
    }

    // Apply roughness/sloppiness (simplified for now)
    const rough = shape.roughness !== undefined ? shape.roughness : roughness;
    if (rough > 0) {
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
    } else {
      ctx.lineJoin = 'miter';
      ctx.lineCap = 'butt';
    }

    switch (shape.type) {
      case 'rectangle':
        if (shape.fill && shape.fill !== 'transparent') {
          ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        }
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;
        
      case 'ellipse':
        ctx.beginPath();
        ctx.ellipse(
          shape.x + shape.width / 2, 
          shape.y + shape.height / 2, 
          shape.width / 2, 
          shape.height / 2, 
          0, 0, 2 * Math.PI
        );
        if (shape.fill && shape.fill !== 'transparent') {
          ctx.fill();
        }
        ctx.stroke();
        break;

      case 'diamond':
        const centerX = shape.x + shape.width / 2;
        const centerY = shape.y + shape.height / 2;
        
        ctx.beginPath();
        ctx.moveTo(centerX, shape.y); // Top
        ctx.lineTo(shape.x + shape.width, centerY); // Right
        ctx.lineTo(centerX, shape.y + shape.height); // Bottom
        ctx.lineTo(shape.x, centerY); // Left
        ctx.closePath();
        
        if (shape.fill && shape.fill !== 'transparent') {
          ctx.fill();
        }
        ctx.stroke();
        break;
        
      case 'line':
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
        ctx.stroke();
        break;

      case 'arrow':
        const endX = shape.x + shape.width;
        const endY = shape.y + shape.height;
        const headSize = shape.arrowHeadSize || 10;
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Draw arrowhead
        const angle = Math.atan2(shape.height, shape.width);
        const arrowAngle = Math.PI / 6; // 30 degrees
        
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headSize * Math.cos(angle - arrowAngle),
          endY - headSize * Math.sin(angle - arrowAngle)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headSize * Math.cos(angle + arrowAngle),
          endY - headSize * Math.sin(angle + arrowAngle)
        );
        ctx.stroke();
        break;
        
      case 'freehand':
        if (shape.points && shape.points.length > 1) {
          ctx.beginPath();
          if (typeof shape.points[0] === 'object' && shape.points[0].x !== undefined) {
            // Points is array of {x, y} objects
            ctx.moveTo(shape.points[0].x, shape.points[0].y);
            for (let i = 1; i < shape.points.length; i++) {
              ctx.lineTo(shape.points[i].x, shape.points[i].y);
            }
          } else {
            // Points is flat array [x, y, x, y, ...]
            ctx.moveTo(shape.points[0], shape.points[1]);
            for (let i = 2; i < shape.points.length; i += 2) {
              ctx.lineTo(shape.points[i], shape.points[i + 1]);
            }
          }
          ctx.stroke();
        }
        break;
        
      case 'text':
        if (shape.text) {
          const fontSize = shape.fontSize || 16;
          const fontFamily = shape.fontFamily || 'Arial';
          const fontWeight = shape.fontWeight || 'normal';
          const lineHeight = shape.lineHeight || fontSize * 1.4;
          
          ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
          ctx.fillStyle = shape.stroke || currentColor;
          
          // Handle text alignment
          let textX = shape.x;
          
          if (shape.textAlign === 'center') {
            ctx.textAlign = 'center';
            textX = shape.x + shape.width / 2;
          } else if (shape.textAlign === 'right') {
            ctx.textAlign = 'right';
            textX = shape.x + shape.width;
          } else {
            ctx.textAlign = 'left';
          }
          
          // Render multi-line text
          const lines = shape.lines || shape.text.split('\n');
          let startY = shape.y + fontSize; // Baseline for first line
          
          // Handle vertical alignment for multi-line text
          if (shape.verticalAlign === 'middle') {
            const totalHeight = lines.length * lineHeight;
            startY = shape.y + (shape.height - totalHeight) / 2 + fontSize;
          } else if (shape.verticalAlign === 'bottom') {
            const totalHeight = lines.length * lineHeight;
            startY = shape.y + shape.height - totalHeight + fontSize;
          }
          
          // Draw each line
          lines.forEach((line: string, index: number) => {
            const y = startY + (index * lineHeight);
            ctx.fillText(line, textX, y);
          });
          
          // Reset text alignment
          ctx.textAlign = 'left';
        }
        break;
        
      case 'image':
        if (shape.src) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, shape.x, shape.y, shape.width, shape.height);
          };
          img.src = shape.src;
        }
        break;
    }
    
    // Reset canvas state
    ctx.setLineDash([]);
    ctx.globalAlpha = 1.0;
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
  }, [currentColor, currentStrokeWidth, currentStrokeStyle, currentOpacity, roughness]);

  // Handle double click for text editing
  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    
    // Find text shapes at this position
    const textShape = Object.values(shapes).find(shape => {
      return shape.type === 'text' &&
             pos.x >= shape.x && pos.x <= shape.x + shape.width &&
             pos.y >= shape.y && pos.y <= shape.y + shape.height;
    }) as TextShape | undefined;
    
    if (textShape) {
      // Create textarea for editing multi-line text
      const textInput = document.createElement('textarea');
      textInput.value = textShape.text;
      textInput.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        z-index: 1000;
        padding: 12px;
        border: 2px solid #3b82f6;
        border-radius: 8px;
        background: white;
        font-size: ${textShape.fontSize}px;
        font-family: ${textShape.fontFamily};
        font-weight: ${textShape.fontWeight};
        min-width: 250px;
        min-height: 50px;
        max-width: 400px;
        outline: none;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        resize: both;
        overflow: auto;
        line-height: 1.4;
        color: ${textShape.stroke};
      `;
      
      document.body.appendChild(textInput);
      textInput.focus();
      textInput.select();
      
      // Auto-resize function
      const autoResize = () => {
        textInput.style.height = 'auto';
        textInput.style.height = textInput.scrollHeight + 'px';
        textInput.style.width = Math.max(250, Math.min(400, textInput.scrollWidth + 20)) + 'px';
      };
      
      textInput.addEventListener('input', autoResize);
      autoResize();
      
      const handleTextUpdate = () => {
        const newText = textInput.value.trim();
        document.body.removeChild(textInput);
        
        if (newText && newText !== textShape.text) {
          // Calculate new dimensions for multi-line text
          const lines = newText.split('\n');
          const maxLineLength = Math.max(...lines.map(line => line.length));
          const lineHeight = textShape.lineHeight || textShape.fontSize * 1.4;
          
          const newWidth = Math.max(maxLineLength * textShape.fontSize * 0.6, 150);
          const newHeight = lines.length * lineHeight + 20;
          
          // Update the text shape
          const updatedShape = {
            ...textShape,
            text: newText,
            width: newWidth,
            height: newHeight,
            lines: lines,
            lineHeight: lineHeight
          };
          updateShape(textShape.id, updatedShape);
        }
      };
      
      const handleTextCancel = () => {
        if (document.body.contains(textInput)) {
          document.body.removeChild(textInput);
        }
      };
      
      textInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
          event.preventDefault();
          handleTextUpdate();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          handleTextCancel();
        }
        // Allow normal Enter for new lines
      });
      
      textInput.addEventListener('blur', handleTextUpdate);
    }
  }, [getMousePos, shapes, updateShape]);

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    
    // Handle different tools
    if (tool === 'select' || tool === 'hand') {
      clearSelection();
      return;
    }

    if (tool === 'eraser') {
      // Find and delete shapes at this position
      const shapesToDelete = Object.values(shapes).filter(shape => {
        return pos.x >= shape.x && pos.x <= shape.x + shape.width &&
               pos.y >= shape.y && pos.y <= shape.y + shape.height;
      });
      
      shapesToDelete.forEach(shape => {
        deleteShape(shape.id);
      });
      return;
    }

    if (tool === 'image') {
      // Create a file input to select an image
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            createShape({
              type: 'image',
              x: pos.x,
              y: pos.y,
              width: 200,
              height: 150,
              src: e.target.result,
              naturalWidth: 200,
              naturalHeight: 150
            });
          };
          reader.readAsDataURL(file);
        }
      };
      fileInput.click();
      return;
    }

    setDrawingState({
      isDrawing: true,
      startPoint: pos,
      currentPoint: pos,
      currentPath: tool === 'draw' ? [pos] : []
    });

    if (tool === 'text') {
      // Create a flexible textarea for text input
      const textInput = document.createElement('textarea');
      textInput.placeholder = 'Start typing...\nThis text box will resize as you type\nPress Ctrl+Enter when done';
      
      // Calculate font size with more options based on stroke width
      const fontSizes = [14, 18, 24, 32, 40, 48, 56, 64]; // small to extra large
      const baseFontSize = fontSizes[Math.min(currentStrokeWidth - 1, fontSizes.length - 1)] || 18;
      
      // Create hand-drawn style font family
      const handDrawnFonts = [
        'Comic Sans MS, cursive',
        'Marker Felt, fantasy', 
        'Brush Script MT, cursive',
        currentFont || 'Arial'
      ];
      const selectedFont = handDrawnFonts[Math.min(roughness, handDrawnFonts.length - 1)];
      
      // Get canvas bounds for positioning
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      textInput.style.cssText = `
        position: absolute;
        left: ${(canvasRect?.left || 0) + scrollX + pos.x}px;
        top: ${(canvasRect?.top || 0) + scrollY + pos.y}px;
        z-index: 1000;
        padding: 8px 12px;
        border: 2px solid #3b82f6;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(4px);
        font-size: ${baseFontSize}px;
        font-family: ${selectedFont};
        min-width: 120px;
        max-width: 500px;
        min-height: ${baseFontSize + 20}px;
        outline: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1);
        resize: both;
        overflow: hidden;
        line-height: 1.4;
        color: ${currentColor};
        font-weight: ${roughness > 1 ? 'bold' : 'normal'};
        word-wrap: break-word;
        white-space: pre-wrap;
        transition: all 0.2s ease;
      `;
      
      document.body.appendChild(textInput);
      textInput.focus();
      
      // Enhanced auto-resize function
      const autoResize = () => {
        // Reset height to get proper scrollHeight
        textInput.style.height = 'auto';
        
        // Calculate new dimensions
        const newHeight = Math.max(baseFontSize + 20, textInput.scrollHeight + 4);
        const textLength = textInput.value.length;
        const estimatedWidth = Math.max(120, Math.min(500, textLength * (baseFontSize * 0.6) + 40));
        
        // Apply new dimensions
        textInput.style.height = newHeight + 'px';
        
        // Auto-width adjustment based on content
        if (textLength > 0) {
          textInput.style.width = Math.min(500, Math.max(120, estimatedWidth)) + 'px';
        }
        
        // Add visual feedback
        textInput.style.borderColor = '#3b82f6';
        textInput.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(59, 130, 246, 0.2)';
      };
      
      // Real-time auto-resize
      textInput.addEventListener('input', autoResize);
      textInput.addEventListener('focus', () => {
        textInput.style.borderColor = '#2563eb';
        textInput.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(37, 99, 235, 0.3)';
      });
      textInput.addEventListener('blur', () => {
        textInput.style.borderColor = '#3b82f6';
        textInput.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)';
      });
      
      // Initial resize
      autoResize();
      textInput.select();
      
      const handleTextSubmit = () => {
        const textContent = textInput.value.trim();
        
        if (textContent) {
          // Get actual dimensions from the text input
          const actualWidth = parseInt(textInput.style.width) || 120;
          const actualHeight = parseInt(textInput.style.height) || (baseFontSize + 20);
          
          // Calculate text dimensions for multi-line text
          const fontSize = baseFontSize;
          const lines = textContent.split('\n');
          const lineHeight = fontSize * 1.4;
          
          // Use actual text input dimensions as base, with some adjustments
          const finalWidth = Math.max(actualWidth, 120);
          const finalHeight = Math.max(actualHeight, lines.length * lineHeight + 10);
          
          createShape({
            type: 'text',
            x: pos.x,
            y: pos.y,
            width: finalWidth,
            height: finalHeight,
            text: textContent,
            fontSize: fontSize,
            fontFamily: selectedFont,
            fontWeight: roughness > 1 ? 'bold' : 'normal',
            textAlign: 'left',
            verticalAlign: 'top',
            lineHeight: lineHeight,
            lines: lines,
            ...getCurrentStyle()
          });
        }
        
        // Clean up
        if (document.body.contains(textInput)) {
          document.body.removeChild(textInput);
        }
      };
      
      const handleTextCancel = () => {
        if (document.body.contains(textInput)) {
          document.body.removeChild(textInput);
        }
      };
      
      textInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
          event.preventDefault();
          handleTextSubmit();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          handleTextCancel();
        }
        // Allow normal Enter for new lines
      });
      
      // Click outside to finish text input
      const handleClickOutside = (event: MouseEvent) => {
        if (!textInput.contains(event.target as Node)) {
          document.removeEventListener('click', handleClickOutside);
          handleTextSubmit();
        }
      };
      
      // Add click outside listener after a short delay to avoid immediate trigger
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
      
      // Also handle blur event as backup
      textInput.addEventListener('blur', () => {
        setTimeout(() => {
          if (document.body.contains(textInput)) {
            handleTextSubmit();
          }
        }, 200); // Small delay to allow for focus changes
      });
    }
  }, [tool, getMousePos, clearSelection, createShape, currentStrokeWidth, shapes]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    if (!drawingState.isDrawing || !drawingState.startPoint) {
      return;
    }

    if (tool === 'draw') {
      setDrawingState(prev => ({
        ...prev,
        currentPoint: pos,
        currentPath: [...prev.currentPath, pos]
      }));
    } else {
      setDrawingState(prev => ({
        ...prev,
        currentPoint: pos
      }));
    }
  }, [drawingState.isDrawing, drawingState.startPoint, tool, getMousePos]);

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
        cornerRadius: 0,
        ...getCurrentStyle()
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
        radiusX,
        radiusY,
        ...getCurrentStyle()
      });
    } else if (tool === 'diamond') {
      createShape({
        type: 'diamond',
        x: Math.min(drawingState.startPoint.x, pos.x),
        y: Math.min(drawingState.startPoint.y, pos.y),
        width: Math.abs(pos.x - drawingState.startPoint.x),
        height: Math.abs(pos.y - drawingState.startPoint.y),
        ...getCurrentStyle()
      });
    } else if (tool === 'line') {
      createShape({
        type: 'line',
        x: drawingState.startPoint.x,
        y: drawingState.startPoint.y,
        width: pos.x - drawingState.startPoint.x,
        height: pos.y - drawingState.startPoint.y,
        startPoint: { x: 0, y: 0 },
        endPoint: { x: pos.x - drawingState.startPoint.x, y: pos.y - drawingState.startPoint.y }
      });
    } else if (tool === 'arrow') {
      createShape({
        type: 'arrow',
        x: drawingState.startPoint.x,
        y: drawingState.startPoint.y,
        width: pos.x - drawingState.startPoint.x,
        height: pos.y - drawingState.startPoint.y,
        startPoint: { x: 0, y: 0 },
        endPoint: { x: pos.x - drawingState.startPoint.x, y: pos.y - drawingState.startPoint.y },
        arrowHeadSize: Math.max(8, currentStrokeWidth * 2)
      });
    } else if (tool === 'draw' && drawingState.currentPath.length > 1) {
      const minX = Math.min(...drawingState.currentPath.map(p => p.x));
      const minY = Math.min(...drawingState.currentPath.map(p => p.y));
      const maxX = Math.max(...drawingState.currentPath.map(p => p.x));
      const maxY = Math.max(...drawingState.currentPath.map(p => p.y));
      
      createShape({
        type: 'freehand',
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        points: drawingState.currentPath,
        smoothing: 0.5
      });
    }

    setDrawingState({
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      currentPath: []
    });
  }, [drawingState, tool, getMousePos, createShape]);

  // Draw everything on canvas
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

    // Draw grid
    if (gridEnabled) {
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

    // Draw all shapes
    Object.values(shapes).forEach(shape => {
      drawShape(ctx, shape);
    });

    // Draw current drawing preview
    if (drawingState.isDrawing && drawingState.startPoint && drawingState.currentPoint) {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentStrokeWidth;
      ctx.setLineDash([5, 5]);

      if (tool === 'rectangle') {
        // Preview rectangle
        const width = Math.abs(drawingState.currentPoint.x - drawingState.startPoint.x);
        const height = Math.abs(drawingState.currentPoint.y - drawingState.startPoint.y);
        const x = Math.min(drawingState.startPoint.x, drawingState.currentPoint.x);
        const y = Math.min(drawingState.startPoint.y, drawingState.currentPoint.y);
        ctx.strokeRect(x, y, width, height);
      } else if (tool === 'ellipse') {
        // Preview ellipse
        const centerX = (drawingState.startPoint.x + drawingState.currentPoint.x) / 2;
        const centerY = (drawingState.startPoint.y + drawingState.currentPoint.y) / 2;
        const radiusX = Math.abs(drawingState.currentPoint.x - drawingState.startPoint.x) / 2;
        const radiusY = Math.abs(drawingState.currentPoint.y - drawingState.startPoint.y) / 2;
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (tool === 'diamond') {
        // Preview diamond
        const width = Math.abs(drawingState.currentPoint.x - drawingState.startPoint.x);
        const height = Math.abs(drawingState.currentPoint.y - drawingState.startPoint.y);
        const x = Math.min(drawingState.startPoint.x, drawingState.currentPoint.x);
        const y = Math.min(drawingState.startPoint.y, drawingState.currentPoint.y);
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        
        ctx.beginPath();
        ctx.moveTo(centerX, y); // Top
        ctx.lineTo(x + width, centerY); // Right
        ctx.lineTo(centerX, y + height); // Bottom
        ctx.lineTo(x, centerY); // Left
        ctx.closePath();
        ctx.stroke();
      } else if (tool === 'line') {
        // Preview line
        ctx.beginPath();
        ctx.moveTo(drawingState.startPoint.x, drawingState.startPoint.y);
        ctx.lineTo(drawingState.currentPoint.x, drawingState.currentPoint.y);
        ctx.stroke();
      } else if (tool === 'arrow') {
        // Preview arrow
        const endX = drawingState.currentPoint.x;
        const endY = drawingState.currentPoint.y;
        const headSize = Math.max(8, currentStrokeWidth * 2);
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(drawingState.startPoint.x, drawingState.startPoint.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Draw arrowhead
        const angle = Math.atan2(
          endY - drawingState.startPoint.y,
          endX - drawingState.startPoint.x
        );
        const arrowAngle = Math.PI / 6; // 30 degrees
        
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headSize * Math.cos(angle - arrowAngle),
          endY - headSize * Math.sin(angle - arrowAngle)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headSize * Math.cos(angle + arrowAngle),
          endY - headSize * Math.sin(angle + arrowAngle)
        );
        ctx.stroke();
      }

      ctx.setLineDash([]);
    }

    // Draw current freehand path
    if (tool === 'draw' && drawingState.currentPath.length > 1) {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentStrokeWidth;
      ctx.beginPath();
      ctx.moveTo(drawingState.currentPath[0].x, drawingState.currentPath[0].y);
      for (let i = 1; i < drawingState.currentPath.length; i++) {
        ctx.lineTo(drawingState.currentPath[i].x, drawingState.currentPath[i].y);
      }
      ctx.stroke();
    }

  }, [width, height, theme, gridEnabled, gridSize, zoom, panX, panY, tool, shapes, drawingState, currentColor, currentStrokeWidth, drawShape]);

  const getCursorStyle = () => {
    switch (tool) {
      case 'select': return 'default';
      case 'hand': return 'grab';
      case 'text': return 'text';
      case 'eraser': return 'crosshair';
      case 'image': return 'copy';
      default: return 'crosshair';
    }
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
      cursor: getCursorStyle(),
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <canvas 
        ref={canvasRef}
        style={{ 
          display: 'block',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      />
    </div>
  );
};
