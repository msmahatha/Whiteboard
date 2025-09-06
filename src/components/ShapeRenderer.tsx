import React from 'react';
import { Group, Rect, Circle, Line, Text, Arrow } from 'react-konva';
import Konva from 'konva';
import type { Shape, RectangleShape, CircleShape, LineShape, ArrowShape, TextShape } from '../types';

interface ShapeRendererProps {
  shape: Shape;
  isSelected: boolean;
  onClick: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

export const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  shape,
  isSelected,
  onClick,
}) => {
  const getStrokeDashArray = (strokeStyle: string, strokeWidth: number): number[] => {
    switch (strokeStyle) {
      case 'dashed':
        return [strokeWidth * 3, strokeWidth * 2];
      case 'dotted':
        return [strokeWidth, strokeWidth];
      default:
        return [];
    }
  };

  const commonProps = {
    x: shape.x,
    y: shape.y,
    rotation: shape.rotation,
    opacity: shape.opacity,
    visible: shape.visible,
    stroke: isSelected ? '#3b82f6' : shape.stroke,
    strokeWidth: isSelected ? shape.strokeWidth + 1 : shape.strokeWidth,
    onClick,
    draggable: !shape.locked,
  };

  const renderShape = () => {
    switch (shape.type) {
      case 'rectangle': {
        const rectShape = shape as RectangleShape;
        return (
          <Rect
            {...commonProps}
            width={rectShape.width}
            height={rectShape.height}
            fill={rectShape.fill}
            cornerRadius={rectShape.cornerRadius}
            strokeDashArray={getStrokeDashArray(rectShape.strokeStyle, rectShape.strokeWidth)}
          />
        );
      }

      case 'circle': {
        const circleShape = shape as CircleShape;
        return (
          <Circle
            {...commonProps}
            x={shape.x + shape.width / 2}
            y={shape.y + shape.height / 2}
            radius={circleShape.radius}
            fill={circleShape.fill}
            strokeDashArray={getStrokeDashArray(circleShape.strokeStyle, circleShape.strokeWidth)}
          />
        );
      }

      case 'line': {
        const lineShape = shape as LineShape;
        return (
          <Line
            {...commonProps}
            points={[
              lineShape.startPoint.x,
              lineShape.startPoint.y,
              lineShape.endPoint.x,
              lineShape.endPoint.y,
            ]}
            strokeDashArray={getStrokeDashArray(lineShape.strokeStyle, lineShape.strokeWidth)}
          />
        );
      }

      case 'arrow': {
        const arrowShape = shape as ArrowShape;
        return (
          <Arrow
            {...commonProps}
            points={[
              arrowShape.startPoint.x,
              arrowShape.startPoint.y,
              arrowShape.endPoint.x,
              arrowShape.endPoint.y,
            ]}
            pointerLength={arrowShape.arrowHeadSize}
            pointerWidth={arrowShape.arrowHeadSize}
            strokeDashArray={getStrokeDashArray(arrowShape.strokeStyle, arrowShape.strokeWidth)}
          />
        );
      }

      case 'text': {
        const textShape = shape as TextShape;
        return (
          <Text
            {...commonProps}
            text={textShape.text}
            fontSize={textShape.fontSize}
            fontFamily={textShape.fontFamily}
            fontStyle={textShape.fontWeight}
            fill={textShape.fill}
            align={textShape.textAlign}
            verticalAlign={textShape.verticalAlign}
            width={textShape.width}
            height={textShape.height}
          />
        );
      }

      case 'sticky-note': {
        const stickyShape = shape as any; // Simplified for now
        return (
          <Group>
            <Rect
              {...commonProps}
              width={stickyShape.width}
              height={stickyShape.height}
              fill={stickyShape.noteColor || '#fef08a'}
              cornerRadius={4}
            />
            <Text
              x={shape.x + 8}
              y={shape.y + 8}
              text={stickyShape.text}
              fontSize={stickyShape.fontSize}
              fill="#1f2937"
              width={stickyShape.width - 16}
              height={stickyShape.height - 16}
            />
          </Group>
        );
      }

      case 'freehand': {
        const freehandShape = shape as any; // Simplified for now
        if (!freehandShape.points || freehandShape.points.length === 0) {
          return null;
        }

        const points = freehandShape.points.flatMap((point: any) => [point.x, point.y]);
        return (
          <Line
            {...commonProps}
            points={points}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <Group>
      {renderShape()}
      {/* Selection handles would go here */}
    </Group>
  );
};
