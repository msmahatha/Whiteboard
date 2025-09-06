import React, { useState, useEffect, useCallback } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';

interface PerformanceStats {
  fps: number;
  frameTime: number;
  shapeCount: number;
  visibleShapes: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    shapeCount: 0,
    visibleShapes: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  
  const { shapes, theme } = useWhiteboardStore();

  const updateStats = useCallback(() => {
    const shapeArray = Object.values(shapes);
    const visibleShapeArray = shapeArray.filter(shape => shape.visible);
    
    setStats(prev => ({
      ...prev,
      shapeCount: shapeArray.length,
      visibleShapes: visibleShapeArray.length
    }));
  }, [shapes]);

  useEffect(() => {
    updateStats();
  }, [updateStats]);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrame: number;

    const calculateFPS = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const frameTime = Math.round((currentTime - lastTime) / frameCount * 100) / 100;
        
        setStats(prev => ({
          ...prev,
          fps,
          frameTime
        }));
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationFrame = requestAnimationFrame(calculateFPS);
    };

    if (isVisible) {
      calculateFPS();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible]);

  // Keyboard shortcut to toggle performance monitor
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) {
    return null;
  }

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '80px',
    right: '20px',
    backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(31, 41, 55, 0.95)',
    border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
    borderRadius: '8px',
    padding: '12px',
    minWidth: '200px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(8px)',
    zIndex: 1001,
    fontSize: '12px',
    fontFamily: 'monospace',
    color: theme === 'light' ? '#374151' : '#f9fafb'
  };

  const statStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px'
  };

  const getPerformanceColor = (fps: number) => {
    if (fps >= 50) return '#10b981'; // green
    if (fps >= 30) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div style={containerStyle}>
      <div style={{
        fontWeight: 'bold',
        marginBottom: '8px',
        borderBottom: `1px solid ${theme === 'light' ? '#e5e7eb' : '#4b5563'}`,
        paddingBottom: '4px'
      }}>
        Performance Monitor
      </div>
      
      <div style={statStyle}>
        <span>FPS:</span>
        <span style={{ color: getPerformanceColor(stats.fps), fontWeight: 'bold' }}>
          {stats.fps}
        </span>
      </div>
      
      <div style={statStyle}>
        <span>Frame Time:</span>
        <span>{stats.frameTime}ms</span>
      </div>
      
      <div style={statStyle}>
        <span>Total Shapes:</span>
        <span>{stats.shapeCount}</span>
      </div>
      
      <div style={statStyle}>
        <span>Visible Shapes:</span>
        <span>{stats.visibleShapes}</span>
      </div>
      
      <div style={{
        marginTop: '8px',
        paddingTop: '8px',
        borderTop: `1px solid ${theme === 'light' ? '#e5e7eb' : '#4b5563'}`,
        fontSize: '10px',
        opacity: 0.7
      }}>
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
};

export default PerformanceMonitor;
