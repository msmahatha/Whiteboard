import React, { useRef, useCallback, useState } from 'react';
import { Stage, Layer, Group } from 'react-konva';
import Konva from 'konva';
import { useWhiteboardStore } from '../store/whiteboardStore';
import { ShapeRenderer } from './ShapeRenderer';
import { SelectionBox } from './SelectionBox';
import { Grid } from './Grid';
import type { Point, Shape } from '../types';

interface CanvasProps {
  width: number;
  height: number;
}

export const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);

  const {
    shapes,
    selectedShapeIds,
    tool,
    zoom,
    panX,
    panY,
    gridEnabled,
    snapToGrid,
    gridSize,
    createShape,
    updateShape,
    selectShape,
    clearSelection,
    selectShapesInBounds,
    setPan,
    setZoom,
  } = useWhiteboardStore();

  // Handle wheel zoom
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const scaleBy = 1.1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    setZoom(newScale);
    
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    
    setPan(newPos.x, newPos.y);
  }, [setZoom, setPan]);

  // Snap point to grid if enabled
  const snapPoint = useCallback((point: Point): Point => {
    if (!snapToGrid) return point;
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize,
    };
  }, [snapToGrid, gridSize]);

  // Get stage pointer position relative to the canvas
  const getStagePointerPosition = useCallback((): Point | null => {
    const stage = stageRef.current;
    if (!stage) return null;
    
    const pointer = stage.getPointerPosition();
    if (!pointer) return null;
    
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const relativePos = transform.point(pointer);
    
    return snapPoint(relativePos);
  }, [snapPoint]);

  // Handle mouse down
  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    const pos = getStagePointerPosition();
    if (!pos) return;

    if (tool === 'select') {
      if (clickedOnEmpty) {
        clearSelection();
        setStartPoint(pos);
        setIsDrawing(true);
      }
    } else if (['rectangle', 'circle', 'line', 'arrow'].includes(tool)) {
      setIsDrawing(true);
      setStartPoint(pos);
      
      // Create initial shape
      const baseShape: Partial<Shape> = {
        type: tool as Shape['type'],
        x: pos.x,
        y: pos.y,
        width: tool === 'line' || tool === 'arrow' ? 0 : 1,
        height: tool === 'line' || tool === 'arrow' ? 0 : 1,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        fill: tool === 'line' || tool === 'arrow' ? 'transparent' : '#3b82f6',
        fillStyle: 'solid',
        stroke: '#1d4ed8',
        strokeWidth: 2,
        strokeStyle: 'solid',
        roughness: 1,
      };

      // Add shape-specific properties
      if (tool === 'rectangle') {
        (baseShape as any).cornerRadius = 0;
      } else if (tool === 'ellipse') {
        (baseShape as any).radius = 0;
      } else if (tool === 'line' || tool === 'arrow') {
        (baseShape as any).startPoint = pos;
        (baseShape as any).endPoint = pos;
        if (tool === 'arrow') {
          (baseShape as any).arrowHeadSize = 10;
        }
      }

      const shapeId = createShape(baseShape);
      const newShape = { ...baseShape, id: shapeId } as Shape;
      setCurrentShape(newShape);
    }
  }, [tool, getStagePointerPosition, clearSelection, createShape]);

  // Handle mouse move
  const handleMouseMove = useCallback((_e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;
    
    const pos = getStagePointerPosition();
    if (!pos || !startPoint) return;

    if (tool === 'select' && !currentShape) {
      // Selection box logic will be handled by SelectionBox component
      return;
    }

    if (currentShape && ['rectangle', 'circle', 'line', 'arrow'].includes(tool)) {
      const updates: Partial<Shape> = {};
      
      if (tool === 'rectangle' || tool === 'ellipse') {
        updates.width = Math.abs(pos.x - startPoint.x);
        updates.height = Math.abs(pos.y - startPoint.y);
        updates.x = Math.min(pos.x, startPoint.x);
        updates.y = Math.min(pos.y, startPoint.y);
        
        if (tool === 'ellipse') {
          const radius = Math.max(updates.width!, updates.height!) / 2;
          (updates as any).radius = radius;
          updates.width = radius * 2;
          updates.height = radius * 2;
        }
      } else if (tool === 'line' || tool === 'arrow') {
        (updates as any).endPoint = pos;
        updates.width = Math.abs(pos.x - startPoint.x);
        updates.height = Math.abs(pos.y - startPoint.y);
        updates.x = Math.min(pos.x, startPoint.x);
        updates.y = Math.min(pos.y, startPoint.y);
      }
      
      updateShape(currentShape.id, updates);
    }
  }, [isDrawing, getStagePointerPosition, startPoint, currentShape, tool, updateShape]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentShape(null);
  }, []);

  // Handle shape click
  const handleShapeClick = useCallback((shapeId: string, e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    
    if (tool === 'select') {
      selectShape(shapeId, e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey);
    }
  }, [tool, selectShape]);

  // Handle drag for pan tool
  const handleStageDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    if (tool === 'hand') {
      setPan(e.target.x(), e.target.y());
    }
  }, [tool, setPan]);

  return (
    <div className="canvas-container flex-1 overflow-hidden">
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        scaleX={zoom}
        scaleY={zoom}
        x={panX}
        y={panY}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        draggable={tool === 'hand'}
        onDragEnd={handleStageDragEnd}
        className={`cursor-${tool === 'hand' ? 'grab' : 'crosshair'}`}
      >
        {/* Grid layer */}
        {gridEnabled && (
          <Layer>
            <Grid 
              width={width} 
              height={height} 
              gridSize={gridSize} 
              zoom={zoom}
              panX={panX}
              panY={panY}
            />
          </Layer>
        )}

        {/* Shapes layer */}
        <Layer>
          {Object.values(shapes)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(shape => (
              <ShapeRenderer
                key={shape.id}
                shape={shape}
                isSelected={selectedShapeIds.includes(shape.id)}
                onClick={(e: Konva.KonvaEventObject<MouseEvent>) => handleShapeClick(shape.id, e)}
              />
            ))}
        </Layer>

        {/* Selection layer */}
        <Layer>
          <Group>
            {isDrawing && tool === 'select' && startPoint && (
              <SelectionBox
                startPoint={startPoint}
                currentPoint={getStagePointerPosition()}
                onSelectionComplete={(bounds: any) => {
                  selectShapesInBounds(bounds);
                }}
              />
            )}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};
