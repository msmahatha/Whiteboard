import React, { useState } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';
import { Icons } from './Icons';
import { STROKE_COLORS, BACKGROUND_COLORS, STROKE_WIDTHS } from '../utils/colors';
import type { ToolType } from '../types';

export const Toolbar: React.FC = () => {
  const {
    tool,
    setTool,
    undo,
    redo,
    clearCanvas,
    theme,
    toggleTheme,
    currentColor,
    currentBackgroundColor,
    currentStrokeWidth,
    currentStrokeStyle,
    currentFillStyle,
    setCurrentColor,
    setCurrentBackgroundColor,
    setCurrentStrokeWidth,
    setCurrentStrokeStyle,
    setCurrentFillStyle,
  } = useWhiteboardStore();

  const [showColorPicker, setShowColorPicker] = useState<'stroke' | 'background' | null>(null);

  const drawingTools: Array<{ tool: ToolType; icon: keyof typeof Icons; title: string }> = [
    { tool: 'select', icon: 'Select', title: 'Selection (V)' },
    { tool: 'hand', icon: 'Hand', title: 'Hand (H)' },
    { tool: 'rectangle', icon: 'Rectangle', title: 'Rectangle (R)' },
    { tool: 'diamond', icon: 'Diamond', title: 'Diamond (D)' },
    { tool: 'ellipse', icon: 'Ellipse', title: 'Ellipse (O)' },
    { tool: 'arrow', icon: 'Arrow', title: 'Arrow (A)' },
    { tool: 'line', icon: 'Line', title: 'Line (L)' },
    { tool: 'draw', icon: 'Draw', title: 'Draw (P)' },
    { tool: 'text', icon: 'Text', title: 'Text (T)' },
    { tool: 'image', icon: 'Image', title: 'Image (I)' },
    { tool: 'eraser', icon: 'Eraser', title: 'Eraser (E)' },
  ];

  return (
    <div className="bg-primary border-b border-primary px-4 py-3">
      <div className="flex items-center justify-center">
        <div className="flex items-center bg-secondary rounded-lg p-1 shadow-md border border-primary">
          {/* Lock/Unlock toggle */}
          <div className="flex items-center mr-2 pr-2 border-r border-primary">
            <button
              className="p-2 rounded-md hover:bg-accent transition-colors"
              title="Lock/unlock canvas"
            >
              <Icons.Lock />
            </button>
          </div>

          {/* Main drawing tools */}
          <div className="flex items-center space-x-1">
            {drawingTools.map(({ tool: toolName, icon, title }) => {
              const IconComponent = Icons[icon];
              return (
                <button
                  key={toolName}
                  onClick={() => setTool(toolName)}
                  className={`
                    p-2 rounded-md transition-all
                    ${tool === toolName 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'text-primary hover:bg-accent'
                    }
                  `}
                  title={title}
                >
                  <IconComponent />
                </button>
              );
            })}
          </div>

          {/* Color picker section */}
          <div className="flex items-center ml-2 pl-2 border-l border-primary relative">
            {/* Stroke color */}
            <button
              onClick={() => setShowColorPicker(showColorPicker === 'stroke' ? null : 'stroke')}
              className="w-8 h-8 rounded border-2 border-gray-300 mr-1 flex items-center justify-center hover:border-gray-400 transition-colors"
              style={{ backgroundColor: currentColor }}
              title="Stroke color"
            >
              <div className="w-4 h-1 bg-current rounded"></div>
            </button>

            {/* Fill color */}
            <button
              onClick={() => setShowColorPicker(showColorPicker === 'background' ? null : 'background')}
              className="w-8 h-8 rounded border-2 border-gray-300 mr-2 flex items-center justify-center hover:border-gray-400 transition-colors relative"
              style={{ backgroundColor: currentBackgroundColor === 'transparent' ? '#fff' : currentBackgroundColor }}
              title="Background color"
            >
              {currentBackgroundColor === 'transparent' ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-0.5 bg-red-500 rotate-45"></div>
                </div>
              ) : (
                <div className="w-4 h-4 rounded" style={{ backgroundColor: currentBackgroundColor }}></div>
              )}
            </button>

            {/* Color picker dropdown */}
            {showColorPicker && (
              <div className="absolute top-full mt-2 left-0 z-50 bg-primary border border-primary rounded-lg shadow-lg p-2">
                <div className="grid grid-cols-7 gap-1">
                  {(showColorPicker === 'stroke' ? STROKE_COLORS : BACKGROUND_COLORS).map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        if (showColorPicker === 'stroke') {
                          setCurrentColor(color);
                        } else {
                          setCurrentBackgroundColor(color);
                        }
                        setShowColorPicker(null);
                      }}
                      className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors"
                      style={{ backgroundColor: color === 'transparent' ? '#fff' : color }}
                      title={color}
                    >
                      {color === 'transparent' && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-4 h-0.5 bg-red-500 rotate-45"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stroke width */}
            <div className="flex items-center space-x-1 mr-2">
              {Object.entries(STROKE_WIDTHS).slice(0, 3).map(([name, width]) => (
                <button
                  key={name}
                  onClick={() => setCurrentStrokeWidth(width)}
                  className={`
                    w-8 h-8 rounded border flex items-center justify-center transition-all
                    ${currentStrokeWidth === width 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400 hover:bg-accent'
                    }
                  `}
                  title={`${name} (${width}px)`}
                >
                  <div 
                    className="bg-current rounded-full"
                    style={{ 
                      width: `${Math.max(2, Math.min(width, 8))}px`,
                      height: `${Math.max(2, Math.min(width, 8))}px`
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Stroke style */}
            <div className="flex items-center space-x-1 mr-2">
              {(['solid', 'dashed', 'dotted'] as const).slice(0, 2).map((style) => (
                <button
                  key={style}
                  onClick={() => setCurrentStrokeStyle(style)}
                  className={`
                    w-8 h-8 rounded border flex items-center justify-center transition-all
                    ${currentStrokeStyle === style 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400 hover:bg-accent'
                    }
                  `}
                  title={style}
                >
                  <div 
                    className="w-5 h-0.5 bg-current"
                    style={{
                      backgroundImage: style === 'solid' ? 'none' : 
                                     style === 'dashed' ? 'repeating-linear-gradient(to right, currentColor 0px, currentColor 2px, transparent 2px, transparent 4px)' : 
                                     'repeating-linear-gradient(to right, currentColor 0px, currentColor 1px, transparent 1px, transparent 2px)'
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Fill style */}
            <div className="flex items-center space-x-1">
              {(['solid', 'hachure', 'none'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setCurrentFillStyle(style)}
                  className={`
                    w-8 h-8 rounded border flex items-center justify-center transition-all text-xs
                    ${currentFillStyle === style 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400 hover:bg-accent'
                    }
                  `}
                  title={`Fill: ${style}`}
                >
                  {style === 'none' ? '∅' : style === 'solid' ? '█' : '⧵'}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center ml-2 pl-2 border-l border-primary space-x-1">
            <button
              onClick={undo}
              className="p-2 rounded-md hover:bg-accent transition-colors"
              title="Undo"
            >
              <Icons.Undo />
            </button>
            
            <button
              onClick={redo}
              className="p-2 rounded-md hover:bg-accent transition-colors"
              title="Redo"
            >
              <Icons.Redo />
            </button>

            <button
              onClick={() => {
                if (confirm('Clear the entire canvas? This cannot be undone.')) {
                  clearCanvas();
                }
              }}
              className="p-2 rounded-md hover:bg-accent transition-colors"
              title="Clear canvas"
            >
              <Icons.Grid />
            </button>
          </div>

          {/* Menu/More options */}
          <div className="flex items-center ml-2 pl-2 border-l border-primary">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-accent transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
