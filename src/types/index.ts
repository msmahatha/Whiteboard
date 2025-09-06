// Core shape types and interfaces for the whiteboard application

export type Point = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Transform = {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
};

export type Color = {
  fill: string;
  stroke: string;
  strokeWidth: number;
};

export const ShapeType = {
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  LINE: 'line',
  ARROW: 'arrow',
  TEXT: 'text',
  STICKY_NOTE: 'sticky-note',
  FREEHAND: 'freehand',
} as const;

export type ShapeType = typeof ShapeType[keyof typeof ShapeType];

// Tool types
export const TOOLS = {
  // Selection & Manipulation
  select: 'select',
  hand: 'hand',
  laser: 'laser',
  
  // Drawing Tools
  rectangle: 'rectangle',
  diamond: 'diamond',
  ellipse: 'ellipse',
  arrow: 'arrow',
  line: 'line',
  draw: 'draw',
  text: 'text',
  image: 'image',
  eraser: 'eraser',
} as const;

export type ToolType = typeof TOOLS[keyof typeof TOOLS];

export interface BaseShape {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  fillStyle: 'solid' | 'hachure' | 'cross-hatch' | 'none';
  stroke: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  roughness: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  createdAt: number;
  updatedAt: number;
}

export interface RectangleShape extends BaseShape {
  type: 'rectangle';
  cornerRadius: number;
}

export interface CircleShape extends BaseShape {
  type: 'circle';
  radius: number;
}

export interface EllipseShape extends BaseShape {
  type: 'ellipse';
  radiusX: number;
  radiusY: number;
}

export interface DiamondShape extends BaseShape {
  type: 'diamond';
}

export interface LineShape extends BaseShape {
  type: 'line';
  startPoint: Point;
  endPoint: Point;
}

export interface ArrowShape extends BaseShape {
  type: 'arrow';
  startPoint: Point;
  endPoint: Point;
  arrowHeadSize: number;
}

export interface TextShape extends BaseShape {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  textAlign: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'middle' | 'bottom';
  lineHeight?: number;
  lines?: string[];
}

export interface StickyNoteShape extends BaseShape {
  type: 'sticky-note';
  text: string;
  fontSize: number;
  noteColor: string;
}

export interface FreehandShape extends BaseShape {
  type: 'freehand';
  points: Point[];
  smoothing: number;
}

export interface ImageShape extends BaseShape {
  type: 'image';
  src: string;
  naturalWidth: number;
  naturalHeight: number;
}

export interface EraserShape extends BaseShape {
  type: 'eraser';
  points: Point[];
}

export type Shape = 
  | RectangleShape 
  | CircleShape 
  | EllipseShape
  | DiamondShape
  | LineShape 
  | ArrowShape 
  | TextShape 
  | StickyNoteShape 
  | FreehandShape
  | ImageShape
  | EraserShape;

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  shapeIds: string[];
}

export interface WhiteboardState {
  shapes: Record<string, Shape>;
  layers: Layer[];
  selectedShapeIds: string[];
  activeLayerId: string;
  tool: ToolType;
  zoom: number;
  panX: number;
  panY: number;
  gridEnabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
  locked: boolean;
  theme: 'light' | 'dark';
  currentFont: string;
  currentColor: string;
  currentBackgroundColor: string;
  currentStrokeWidth: number;
  currentStrokeStyle: 'solid' | 'dashed' | 'dotted';
  currentFillStyle: 'solid' | 'hachure' | 'cross-hatch' | 'none';
  currentOpacity: number;
  roughness: number;
}

export interface User {
  id: string;
  name: string;
  color: string;
  cursor?: Point;
}

export interface Room {
  id: string;
  name: string;
  users: Record<string, User>;
  whiteboard: WhiteboardState;
  createdAt: number;
  updatedAt: number;
}

// Event types for real-time collaboration
export interface BaseEvent {
  type: string;
  userId: string;
  timestamp: number;
}

export interface ShapeCreatedEvent extends BaseEvent {
  type: 'shape-created';
  shape: Shape;
}

export interface ShapeUpdatedEvent extends BaseEvent {
  type: 'shape-updated';
  shapeId: string;
  updates: Partial<Shape>;
}

export interface ShapeDeletedEvent extends BaseEvent {
  type: 'shape-deleted';
  shapeId: string;
}

export interface CursorMovedEvent extends BaseEvent {
  type: 'cursor-moved';
  position: Point;
}

export type WhiteboardEvent = 
  | ShapeCreatedEvent 
  | ShapeUpdatedEvent 
  | ShapeDeletedEvent 
  | CursorMovedEvent;

// Utility types for shape creation
export type CreateShapeOptions<T extends Shape> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | 'zIndex'
>;

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SelectionBox extends BoundingBox {
  rotation: number;
}

// Canvas interaction types
export interface PointerEvent {
  x: number;
  y: number;
  pressure: number;
  buttons: number;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

export interface DragState {
  isDragging: boolean;
  startPoint: Point;
  currentPoint: Point;
  draggedShapeIds: string[];
}

export interface ResizeHandle {
  position: 'tl' | 'tr' | 'bl' | 'br' | 'ml' | 'mr' | 'mt' | 'mb';
  x: number;
  y: number;
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: string;
}
