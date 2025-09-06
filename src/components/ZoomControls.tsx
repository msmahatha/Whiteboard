import React, { useCallback, useEffect } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';

interface ZoomControlsProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ canvasRef }) => {
  const { theme, zoom, setZoom, panX, panY, setPan } = useWhiteboardStore();

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom * 1.2, 5); // Max 5x zoom
    setZoom(newZoom);
  }, [zoom, setZoom]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom / 1.2, 0.1); // Min 0.1x zoom
    setZoom(newZoom);
  }, [zoom, setZoom]);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPan(0, 0);
  }, [setZoom, setPan]);

  const handleWheelZoom = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, zoom * delta));

      // Calculate pan adjustment to zoom towards mouse position
      const zoomDiff = newZoom - zoom;
      const newPanX = panX - (mouseX - rect.width / 2) * zoomDiff;
      const newPanY = panY - (mouseY - rect.height / 2) * zoomDiff;

      setZoom(newZoom);
      setPan(newPanX, newPanY);
    }
  }, [zoom, panX, panY, setZoom, setPan]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleWheelZoom, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheelZoom);
    };
  }, [handleWheelZoom]);

  const buttonStyle = {
    width: '40px',
    height: '40px',
    border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
    borderRadius: '8px',
    backgroundColor: theme === 'light' ? '#ffffff' : '#374151',
    color: theme === 'light' ? '#374151' : '#f9fafb',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    fontWeight: 'bold'
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(31, 41, 55, 0.95)',
        padding: '12px',
        borderRadius: '12px',
        border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000
      }}
    >
      <button
        onClick={handleZoomIn}
        style={buttonStyle}
        title="Zoom In (Ctrl+Scroll)"
      >
        +
      </button>
      
      <button
        onClick={handleZoomOut}
        style={buttonStyle}
        title="Zoom Out (Ctrl+Scroll)"
      >
        −
      </button>
      
      <button
        onClick={handleResetZoom}
        style={{
          ...buttonStyle,
          fontSize: '12px',
          fontWeight: '600'
        }}
        title="Reset Zoom & Pan"
      >
        {Math.round(zoom * 100)}%
      </button>
      
      <div
        style={{
          fontSize: '10px',
          textAlign: 'center',
          color: theme === 'light' ? '#666' : '#999',
          marginTop: '4px',
          lineHeight: '1.2'
        }}
      >
        Ctrl+Scroll
        <br />
        to zoom
      </div>
    </div>
  );
};

export default ZoomControls;
