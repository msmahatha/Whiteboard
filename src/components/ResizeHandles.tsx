import React from 'react';
import type { Shape } from '../types';

interface ResizeHandlesProps {
  shape: Shape;
  onResize: (newDimensions: { width: number; height: number }) => void;
  scale: number;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({ shape, onResize, scale }) => {
  const handleSize = 8;
  const handleStyle: React.CSSProperties = {
    position: 'absolute',
    width: handleSize,
    height: handleSize,
    backgroundColor: '#3b82f6',
    border: '1px solid #fff',
    borderRadius: '2px',
    cursor: 'pointer',
    zIndex: 1002,
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
  };

  const handles = [
    // Corner handles
    {
      position: 'nw' as const,
      style: {
        ...handleStyle,
        left: shape.x * scale - handleSize / 2,
        top: shape.y * scale - handleSize / 2,
        cursor: 'nw-resize'
      }
    },
    {
      position: 'ne' as const,
      style: {
        ...handleStyle,
        left: (shape.x + shape.width) * scale - handleSize / 2,
        top: shape.y * scale - handleSize / 2,
        cursor: 'ne-resize'
      }
    },
    {
      position: 'sw' as const,
      style: {
        ...handleStyle,
        left: shape.x * scale - handleSize / 2,
        top: (shape.y + shape.height) * scale - handleSize / 2,
        cursor: 'sw-resize'
      }
    },
    {
      position: 'se' as const,
      style: {
        ...handleStyle,
        left: (shape.x + shape.width) * scale - handleSize / 2,
        top: (shape.y + shape.height) * scale - handleSize / 2,
        cursor: 'se-resize'
      }
    },
    // Edge handles for text shapes
    {
      position: 'n' as const,
      style: {
        ...handleStyle,
        left: (shape.x + shape.width / 2) * scale - handleSize / 2,
        top: shape.y * scale - handleSize / 2,
        cursor: 'n-resize'
      }
    },
    {
      position: 's' as const,
      style: {
        ...handleStyle,
        left: (shape.x + shape.width / 2) * scale - handleSize / 2,
        top: (shape.y + shape.height) * scale - handleSize / 2,
        cursor: 's-resize'
      }
    },
    {
      position: 'e' as const,
      style: {
        ...handleStyle,
        left: (shape.x + shape.width) * scale - handleSize / 2,
        top: (shape.y + shape.height / 2) * scale - handleSize / 2,
        cursor: 'e-resize'
      }
    },
    {
      position: 'w' as const,
      style: {
        ...handleStyle,
        left: shape.x * scale - handleSize / 2,
        top: (shape.y + shape.height / 2) * scale - handleSize / 2,
        cursor: 'w-resize'
      }
    }
  ];

  const handleMouseDown = (e: React.MouseEvent, position: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = shape.width;
    const startHeight = shape.height;
    const startShapeX = shape.x;
    const startShapeY = shape.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / scale;
      const deltaY = (moveEvent.clientY - startY) / scale;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startShapeX;
      let newY = startShapeY;

      switch (position) {
        case 'se':
          newWidth = Math.max(20, startWidth + deltaX);
          newHeight = Math.max(20, startHeight + deltaY);
          break;
        case 'sw':
          newWidth = Math.max(20, startWidth - deltaX);
          newHeight = Math.max(20, startHeight + deltaY);
          newX = startShapeX + (startWidth - newWidth);
          break;
        case 'ne':
          newWidth = Math.max(20, startWidth + deltaX);
          newHeight = Math.max(20, startHeight - deltaY);
          newY = startShapeY + (startHeight - newHeight);
          break;
        case 'nw':
          newWidth = Math.max(20, startWidth - deltaX);
          newHeight = Math.max(20, startHeight - deltaY);
          newX = startShapeX + (startWidth - newWidth);
          newY = startShapeY + (startHeight - newHeight);
          break;
        case 'n':
          newHeight = Math.max(20, startHeight - deltaY);
          newY = startShapeY + (startHeight - newHeight);
          break;
        case 's':
          newHeight = Math.max(20, startHeight + deltaY);
          break;
        case 'e':
          newWidth = Math.max(20, startWidth + deltaX);
          break;
        case 'w':
          newWidth = Math.max(20, startWidth - deltaX);
          newX = startShapeX + (startWidth - newWidth);
          break;
      }

      onResize({
        width: newWidth,
        height: newHeight,
        ...(newX !== startShapeX && { x: newX }),
        ...(newY !== startShapeY && { y: newY })
      } as any);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <>
      {handles.map((handle) => (
        <div
          key={handle.position}
          style={handle.style}
          onMouseDown={(e) => handleMouseDown(e, handle.position)}
        />
      ))}
    </>
  );
};

export default ResizeHandles;
