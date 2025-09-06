import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { 
  Shape, 
  WhiteboardState, 
  ToolType, 
  Layer, 
  BoundingBox,
  CreateShapeOptions 
} from '../types';

interface WhiteboardStore extends WhiteboardState {
  // Shape operations
  createShape: (shapeOptions: Partial<Shape>) => string;
  updateShape: (shapeId: string, updates: Partial<Shape>) => void;
  deleteShape: (shapeId: string) => void;
  deleteSelectedShapes: () => void;
  duplicateSelectedShapes: () => void;
  
  // Selection operations
  selectShape: (shapeId: string, multiSelect?: boolean) => void;
  selectShapes: (shapeIds: string[]) => void;
  selectAll: () => void;
  clearSelection: () => void;
  selectShapesInBounds: (bounds: BoundingBox) => void;
  
  // Layer operations
  createLayer: (name: string) => string;
  deleteLayer: (layerId: string) => void;
  setActiveLayer: (layerId: string) => void;
  reorderLayers: (layerIds: string[]) => void;
  
  // Tool operations
  setTool: (tool: ToolType) => void;
  
  // Canvas operations
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;
  
  // Grid operations
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  setGridSize: (size: number) => void;
  
  // Lock operations
  toggleLocked: () => void;
  setLocked: (locked: boolean) => void;
  
  // Theme operations
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setCurrentFont: (font: string) => void;
  setCurrentColor: (color: string) => void;
  setCurrentBackgroundColor: (color: string) => void;
  setCurrentStrokeWidth: (width: number) => void;
  setCurrentStrokeStyle: (style: 'solid' | 'dashed' | 'dotted') => void;
  setCurrentFillStyle: (style: 'solid' | 'hachure' | 'cross-hatch' | 'none') => void;
  setCurrentOpacity: (opacity: number) => void;
  setRoughness: (roughness: number) => void;
  
  // Undo/Redo
  history: WhiteboardState[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  
  // Export/Import/Save operations
  exportToJSON: () => string;
  importFromJSON: (jsonData: string) => void;
  exportToPNG: (canvas: HTMLCanvasElement) => void;
  exportToSVG: () => string;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  clearCanvas: () => void;
  
  // Utility functions
  getSelectedShapes: () => Shape[];
  getShapesByLayer: (layerId: string) => Shape[];
  getBoundingBoxForShapes: (shapeIds: string[]) => BoundingBox | null;
}

const createDefaultLayer = (): Layer => ({
  id: uuidv4(),
  name: 'Layer 1',
  visible: true,
  locked: false,
  opacity: 1,
  shapeIds: [],
});

const initialState: WhiteboardState = {
  shapes: {},
  layers: [createDefaultLayer()],
  selectedShapeIds: [],
  activeLayerId: '',
  tool: 'select' as ToolType,
  zoom: 1,
  panX: 0,
  panY: 0,
  gridEnabled: false,
  snapToGrid: false,
  gridSize: 20,
  locked: false,
  theme: 'light',
  currentFont: 'Virgil',
  currentColor: '#000000',
  currentBackgroundColor: 'transparent',
  currentStrokeWidth: 2,
  currentStrokeStyle: 'solid',
  currentFillStyle: 'solid',
  currentOpacity: 1,
  roughness: 1,
};

// Set the initial active layer ID
initialState.activeLayerId = initialState.layers[0].id;

export const useWhiteboardStore = create<WhiteboardStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,
    history: [initialState],
    historyIndex: 0,

    createShape: (shapeOptions: Partial<Shape>): string => {
      const id = uuidv4();
      const now = Date.now();
      const state = get();
      
      const shape = {
        ...shapeOptions,
        id,
        createdAt: now,
        updatedAt: now,
        zIndex: Object.keys(state.shapes).length,
      } as Shape;

      set((state) => {
        const newShapes = { ...state.shapes, [id]: shape };
        const updatedLayers = state.layers.map(layer => 
          layer.id === state.activeLayerId
            ? { ...layer, shapeIds: [...layer.shapeIds, id] }
            : layer
        );

        return {
          shapes: newShapes,
          layers: updatedLayers,
          selectedShapeIds: [id],
        };
      });

      get().saveToHistory();
      return id;
    },

    updateShape: (shapeId: string, updates: Partial<Shape>) => {
      set((state) => {
        const existingShape = state.shapes[shapeId];
        if (!existingShape) return state;

        const updatedShape = {
          ...existingShape,
          ...updates,
          updatedAt: Date.now(),
        } as Shape;

        return {
          ...state,
          shapes: {
            ...state.shapes,
            [shapeId]: updatedShape,
          },
        };
      });
    },

    deleteShape: (shapeId: string) => {
      set((state) => {
        const { [shapeId]: deletedShape, ...remainingShapes } = state.shapes;
        const updatedLayers = state.layers.map(layer => ({
          ...layer,
          shapeIds: layer.shapeIds.filter(id => id !== shapeId),
        }));

        return {
          shapes: remainingShapes,
          layers: updatedLayers,
          selectedShapeIds: state.selectedShapeIds.filter(id => id !== shapeId),
        };
      });
      get().saveToHistory();
    },

    deleteSelectedShapes: () => {
      const { selectedShapeIds, deleteShape } = get();
      selectedShapeIds.forEach(deleteShape);
    },

    duplicateSelectedShapes: () => {
      const { selectedShapeIds, shapes, createShape } = get();
      const newShapeIds: string[] = [];

      selectedShapeIds.forEach(shapeId => {
        const shape = shapes[shapeId];
        if (shape) {
          const duplicatedShape = {
            ...shape,
            x: shape.x + 20,
            y: shape.y + 20,
          };
          // Remove properties that should be auto-generated
          const { id, createdAt, updatedAt, zIndex, ...shapeOptions } = duplicatedShape;
          const newId = createShape(shapeOptions as CreateShapeOptions<Shape>);
          newShapeIds.push(newId);
        }
      });

      set({ selectedShapeIds: newShapeIds });
    },

    selectShape: (shapeId: string, multiSelect = false) => {
      set((state) => {
        if (multiSelect) {
          const isSelected = state.selectedShapeIds.includes(shapeId);
          return {
            selectedShapeIds: isSelected
              ? state.selectedShapeIds.filter(id => id !== shapeId)
              : [...state.selectedShapeIds, shapeId],
          };
        }
        return { selectedShapeIds: [shapeId] };
      });
    },

    selectShapes: (shapeIds: string[]) => {
      set({ selectedShapeIds: shapeIds });
    },

    selectAll: () => {
      const { shapes } = get();
      set({ selectedShapeIds: Object.keys(shapes) });
    },

    clearSelection: () => {
      set({ selectedShapeIds: [] });
    },

    selectShapesInBounds: (bounds: BoundingBox) => {
      const { shapes } = get();
      const selectedIds = Object.values(shapes)
        .filter(shape => {
          return (
            shape.x >= bounds.x &&
            shape.y >= bounds.y &&
            shape.x + shape.width <= bounds.x + bounds.width &&
            shape.y + shape.height <= bounds.y + bounds.height
          );
        })
        .map(shape => shape.id);
      
      set({ selectedShapeIds: selectedIds });
    },

    createLayer: (name: string): string => {
      const id = uuidv4();
      const newLayer: Layer = {
        id,
        name,
        visible: true,
        locked: false,
        opacity: 1,
        shapeIds: [],
      };

      set((state) => ({
        layers: [...state.layers, newLayer],
      }));

      return id;
    },

    deleteLayer: (layerId: string) => {
      set((state) => {
        if (state.layers.length <= 1) return state; // Keep at least one layer
        
        const layerToDelete = state.layers.find(l => l.id === layerId);
        if (!layerToDelete) return state;

        // Delete all shapes in the layer
        const shapesToDelete = layerToDelete.shapeIds;
        const remainingShapes = { ...state.shapes };
        shapesToDelete.forEach(shapeId => {
          delete remainingShapes[shapeId];
        });

        const remainingLayers = state.layers.filter(l => l.id !== layerId);
        
        return {
          shapes: remainingShapes,
          layers: remainingLayers,
          activeLayerId: state.activeLayerId === layerId 
            ? remainingLayers[0].id 
            : state.activeLayerId,
          selectedShapeIds: state.selectedShapeIds.filter(
            id => !shapesToDelete.includes(id)
          ),
        };
      });
    },

    setActiveLayer: (layerId: string) => {
      set({ activeLayerId: layerId });
    },

    reorderLayers: (layerIds: string[]) => {
      set((state) => {
        const reorderedLayers = layerIds.map(id => 
          state.layers.find(layer => layer.id === id)!
        );
        return { layers: reorderedLayers };
      });
    },

    setTool: (tool: ToolType) => {
      set({ tool });
    },

    setZoom: (zoom: number) => {
      set({ zoom: Math.max(0.1, Math.min(5, zoom)) });
    },

    setPan: (x: number, y: number) => {
      set({ panX: x, panY: y });
    },

    resetView: () => {
      set({ zoom: 1, panX: 0, panY: 0 });
    },

    toggleGrid: () => {
      set((state) => ({ gridEnabled: !state.gridEnabled }));
    },

    toggleSnapToGrid: () => {
      set((state) => ({ snapToGrid: !state.snapToGrid }));
    },

    setGridSize: (size: number) => {
      set({ gridSize: Math.max(5, Math.min(100, size)) });
    },

    toggleLocked: () => {
      set((state) => ({ locked: !state.locked }));
    },

    setLocked: (locked: boolean) => {
      set({ locked });
    },

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        const previousState = history[newIndex];
        set({
          ...previousState,
          historyIndex: newIndex,
        });
      }
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        const nextState = history[newIndex];
        set({
          ...nextState,
          historyIndex: newIndex,
        });
      }
    },

    saveToHistory: () => {
      const state = get();
      const currentState: WhiteboardState = {
        shapes: state.shapes,
        layers: state.layers,
        selectedShapeIds: state.selectedShapeIds,
        activeLayerId: state.activeLayerId,
        tool: state.tool,
        zoom: state.zoom,
        panX: state.panX,
        panY: state.panY,
        gridEnabled: state.gridEnabled,
        snapToGrid: state.snapToGrid,
        gridSize: state.gridSize,
        locked: state.locked,
        theme: state.theme,
        currentFont: state.currentFont,
        currentColor: state.currentColor,
        currentBackgroundColor: state.currentBackgroundColor,
        currentStrokeWidth: state.currentStrokeWidth,
        currentStrokeStyle: state.currentStrokeStyle,
        currentFillStyle: state.currentFillStyle,
        currentOpacity: state.currentOpacity,
        roughness: state.roughness,
      };

      // Limit history size to prevent memory issues
      const maxHistorySize = 50;
      const newHistory = [
        ...state.history.slice(Math.max(0, state.historyIndex + 1 - maxHistorySize)),
        currentState
      ];

      set({
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    },

    getSelectedShapes: () => {
      const { shapes, selectedShapeIds } = get();
      return selectedShapeIds.map(id => shapes[id]).filter(Boolean);
    },

    getShapesByLayer: (layerId: string) => {
      const { shapes, layers } = get();
      const layer = layers.find(l => l.id === layerId);
      if (!layer) return [];
      return layer.shapeIds.map(id => shapes[id]).filter(Boolean);
    },

    getBoundingBoxForShapes: (shapeIds: string[]): BoundingBox | null => {
      const { shapes } = get();
      const validShapes = shapeIds.map(id => shapes[id]).filter(Boolean);
      
      if (validShapes.length === 0) return null;

      let minX = Infinity, minY = Infinity;
      let maxX = -Infinity, maxY = -Infinity;

      validShapes.forEach(shape => {
        minX = Math.min(minX, shape.x);
        minY = Math.min(minY, shape.y);
        maxX = Math.max(maxX, shape.x + shape.width);
        maxY = Math.max(maxY, shape.y + shape.height);
      });

      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    },

    // Export/Import/Save operations
    exportToJSON: (): string => {
      const state = get();
      const exportData = {
        shapes: state.shapes,
        layers: state.layers,
        version: '1.0',
        createdAt: new Date().toISOString(),
      };
      return JSON.stringify(exportData, null, 2);
    },

    importFromJSON: (jsonData: string) => {
      try {
        const importData = JSON.parse(jsonData);
        if (importData.shapes && importData.layers) {
          set({
            shapes: importData.shapes,
            layers: importData.layers,
            selectedShapeIds: [],
          });
          get().saveToHistory();
        } else {
          throw new Error('Invalid file format');
        }
      } catch (error) {
        alert('Failed to import file. Please check the file format.');
        console.error('Import error:', error);
      }
    },

    exportToPNG: (canvas: HTMLCanvasElement) => {
      try {
        const link = document.createElement('a');
        link.download = `whiteboard-${new Date().toISOString().slice(0, 19)}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        alert('Failed to export PNG. Please try again.');
        console.error('PNG export error:', error);
      }
    },

    exportToSVG: (): string => {
      const { shapes } = get();
      let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
`;
      
      Object.values(shapes).forEach(shape => {
        switch (shape.type) {
          case 'rectangle':
            svgContent += `  <rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" fill="${shape.fill}" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" />\n`;
            break;
          case 'circle':
            const radius = Math.min(shape.width, shape.height) / 2;
            const cx = shape.x + shape.width / 2;
            const cy = shape.y + shape.height / 2;
            svgContent += `  <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${shape.fill}" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" />\n`;
            break;
          case 'line':
            const lineShape = shape as any;
            if (lineShape.startPoint && lineShape.endPoint) {
              svgContent += `  <line x1="${lineShape.startPoint.x}" y1="${lineShape.startPoint.y}" x2="${lineShape.endPoint.x}" y2="${lineShape.endPoint.y}" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" />\n`;
            }
            break;
          case 'text':
            const textShape = shape as any;
            svgContent += `  <text x="${shape.x}" y="${shape.y + 20}" fill="${shape.fill}" font-size="${textShape.fontSize || 16}">${textShape.text || ''}</text>\n`;
            break;
        }
      });
      
      svgContent += '</svg>';
      
      // Download SVG
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `whiteboard-${new Date().toISOString().slice(0, 19)}.svg`;
      link.click();
      
      return svgContent;
    },

    saveToLocalStorage: () => {
      const state = get();
      const saveData = {
        shapes: state.shapes,
        layers: state.layers,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('whiteboard-save', JSON.stringify(saveData));
    },

    loadFromLocalStorage: () => {
      try {
        const saveData = localStorage.getItem('whiteboard-save');
        if (saveData) {
          const parsed = JSON.parse(saveData);
          set({
            shapes: parsed.shapes || {},
            layers: parsed.layers || [createDefaultLayer()],
            selectedShapeIds: [],
          });
          get().saveToHistory();
        } else {
          alert('No saved data found.');
        }
      } catch (error) {
        alert('Failed to load saved data.');
        console.error('Load error:', error);
      }
    },

    clearCanvas: () => {
      set({
        shapes: {},
        layers: [createDefaultLayer()],
        selectedShapeIds: [],
        activeLayerId: createDefaultLayer().id,
      });
      get().saveToHistory();
    },

    // Theme operations
    toggleTheme: () => {
      const currentTheme = get().theme;
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      set({ theme: newTheme });
      
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // Save theme preference
      localStorage.setItem('theme', newTheme);
    },

    setTheme: (theme: 'light' | 'dark') => {
      set({ theme });
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    },

    setCurrentFont: (font: string) => {
      set({ currentFont: font });
      localStorage.setItem('currentFont', font);
    },

    setCurrentColor: (color: string) => {
      set({ currentColor: color });
      localStorage.setItem('currentColor', color);
    },

    setCurrentBackgroundColor: (color: string) => {
      set({ currentBackgroundColor: color });
      localStorage.setItem('currentBackgroundColor', color);
    },

    setCurrentStrokeWidth: (width: number) => {
      set({ currentStrokeWidth: width });
      localStorage.setItem('currentStrokeWidth', width.toString());
    },

    setCurrentStrokeStyle: (style: 'solid' | 'dashed' | 'dotted') => {
      set({ currentStrokeStyle: style });
      localStorage.setItem('currentStrokeStyle', style);
    },

    setCurrentFillStyle: (style: 'solid' | 'hachure' | 'cross-hatch' | 'none') => {
      set({ currentFillStyle: style });
      localStorage.setItem('currentFillStyle', style);
    },

    setCurrentOpacity: (opacity: number) => {
      set({ currentOpacity: opacity });
      localStorage.setItem('currentOpacity', opacity.toString());
    },

    setRoughness: (roughness: number) => {
      set({ roughness: roughness });
      localStorage.setItem('roughness', roughness.toString());
    },
  })));
