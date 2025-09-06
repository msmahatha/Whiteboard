import { useEffect, useState } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';

const AUTOSAVE_INTERVAL = 30000; // 30 seconds
const AUTOSAVE_KEY = 'whiteboard-autosave';

export const useAutoSave = () => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  const { 
    shapes, 
    currentColor, 
    currentBackgroundColor, 
    currentStrokeWidth, 
    currentOpacity, 
    currentFont,
    theme,
    gridEnabled,
    gridSize,
    zoom,
    panX,
    panY
  } = useWhiteboardStore();

  // Auto-save function
  const autoSave = async () => {
    try {
      setIsAutoSaving(true);
      
      const saveData = {
        shapes,
        settings: {
          currentColor,
          currentBackgroundColor,
          currentStrokeWidth,
          currentOpacity,
          currentFont,
          theme,
          gridEnabled,
          gridSize,
          zoom,
          panX,
          panY
        },
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };

      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(saveData));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  // Load auto-saved data
  const loadAutoSave = () => {
    try {
      const savedData = localStorage.getItem(AUTOSAVE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        return {
          ...parsed,
          lastSaved: parsed.timestamp ? new Date(parsed.timestamp) : null
        };
      }
    } catch (error) {
      console.error('Failed to load auto-save:', error);
    }
    return null;
  };

  // Clear auto-save
  const clearAutoSave = () => {
    localStorage.removeItem(AUTOSAVE_KEY);
    setLastSaved(null);
  };

  // Check if there's recent auto-save data
  const hasRecentAutoSave = () => {
    const saved = loadAutoSave();
    if (saved && saved.lastSaved) {
      const savedTime = new Date(saved.lastSaved);
      const timeDiff = Date.now() - savedTime.getTime();
      return timeDiff < 300000; // 5 minutes
    }
    return false;
  };

  // Auto-save effect
  useEffect(() => {
    const interval = setInterval(autoSave, AUTOSAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [shapes, currentColor, currentBackgroundColor, currentStrokeWidth, currentOpacity, currentFont, theme, gridEnabled, gridSize, zoom, panX, panY]);

  // Manual save trigger
  useEffect(() => {
    const handleBeforeUnload = (_e: BeforeUnloadEvent) => {
      if (Object.keys(shapes).length > 0) {
        autoSave();
        // Optional: Show confirmation dialog
        // e.preventDefault();
        // e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shapes]);

  return {
    lastSaved,
    isAutoSaving,
    autoSave,
    loadAutoSave,
    clearAutoSave,
    hasRecentAutoSave
  };
};

export default useAutoSave;
