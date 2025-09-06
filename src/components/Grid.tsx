import React from 'react';
import { Group, Line } from 'react-konva';

interface GridProps {
  width: number;
  height: number;
  gridSize: number;
  zoom: number;
  panX: number;
  panY: number;
}

export const Grid: React.FC<GridProps> = ({ 
  width, 
  height, 
  gridSize, 
  zoom, 
  panX, 
  panY 
}) => {
  const lines: React.ReactElement[] = [];
  
  // Calculate visible area
  const startX = Math.floor((-panX / zoom) / gridSize) * gridSize;
  const endX = Math.ceil((width - panX) / zoom / gridSize) * gridSize;
  const startY = Math.floor((-panY / zoom) / gridSize) * gridSize;
  const endY = Math.ceil((height - panY) / zoom / gridSize) * gridSize;
  
  // Vertical lines
  for (let x = startX; x <= endX; x += gridSize) {
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, startY, x, endY]}
        stroke="#e0e0e0"
        strokeWidth={0.5 / zoom}
        dash={[2 / zoom, 2 / zoom]}
      />
    );
  }
  
  // Horizontal lines
  for (let y = startY; y <= endY; y += gridSize) {
    lines.push(
      <Line
        key={`h-${y}`}
        points={[startX, y, endX, y]}
        stroke="#e0e0e0"
        strokeWidth={0.5 / zoom}
        dash={[2 / zoom, 2 / zoom]}
      />
    );
  }
  
  return <Group>{lines}</Group>;
};
