import React, { useEffect } from 'react';
import { Rect } from 'react-konva';
import type { Point, BoundingBox } from '../types';

interface SelectionBoxProps {
  startPoint: Point;
  currentPoint: Point | null;
  onSelectionComplete: (bounds: BoundingBox) => void;
}

export const SelectionBox: React.FC<SelectionBoxProps> = ({
  startPoint,
  currentPoint,
  onSelectionComplete,
}) => {
  useEffect(() => {
    // Call selection complete when component unmounts (mouse up)
    return () => {
      if (currentPoint) {
        const bounds: BoundingBox = {
          x: Math.min(startPoint.x, currentPoint.x),
          y: Math.min(startPoint.y, currentPoint.y),
          width: Math.abs(currentPoint.x - startPoint.x),
          height: Math.abs(currentPoint.y - startPoint.y),
        };
        onSelectionComplete(bounds);
      }
    };
  }, [startPoint, currentPoint, onSelectionComplete]);

  if (!currentPoint) return null;

  const x = Math.min(startPoint.x, currentPoint.x);
  const y = Math.min(startPoint.y, currentPoint.y);
  const width = Math.abs(currentPoint.x - startPoint.x);
  const height = Math.abs(currentPoint.y - startPoint.y);

  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="rgba(59, 130, 246, 0.1)"
      stroke="#3b82f6"
      strokeWidth={1}
      dash={[5, 5]}
    />
  );
};
