import { useState, useEffect } from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { useWhiteboardStore } from './store/whiteboardStore';
import './App.css';

function App() {
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [showShareModal, setShowShareModal] = useState(false);
  
  const { zoom, exportToJSON, theme, toggleTheme } = useWhiteboardStore();

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    
    if (savedTheme !== theme) {
      toggleTheme();
    }
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, [theme, toggleTheme]);

  const handleShare = () => {
    setShowShareModal(true);
  };

  useEffect(() => {
    const updateCanvasSize = () => {
      // Calculate canvas size based on window size, accounting for toolbar
      const toolbarHeight = 70; // Horizontal toolbar height
      const statusBarHeight = 40; // Status bar height
      const padding = 20;

      setCanvasSize({
        width: window.innerWidth - padding,
        height: window.innerHeight - toolbarHeight - statusBarHeight - padding,
      });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-primary">
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Horizontal Toolbar */}
        <Toolbar />
        
        {/* Canvas Area */}
        <main className="flex-1 bg-secondary relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Canvas 
              width={canvasSize.width} 
              height={canvasSize.height} 
            />
          </div>
        </main>
      </div>

      {/* Status Bar */}
      <footer className="bg-primary border-t border-primary px-4 py-2">
        <div className="flex items-center justify-between text-sm text-muted">
          <div className="flex items-center space-x-4">
            <span>Zoom: {Math.round(zoom * 100)}%</span>
            <button className="text-xs px-2 py-1 rounded hover:bg-accent transition-colors">
              {Math.round(zoom * 100)}%
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleShare}
              className="px-3 py-1 bg-purple-500 text-white text-sm rounded-md hover:bg-purple-600 transition-colors"
            >
              Share
            </button>
            <button
              className="px-3 py-1 bg-accent text-primary text-sm rounded-md hover:bg-tertiary transition-colors"
              title="Library"
            >
              Library
            </button>
          </div>
        </div>
      </footer>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary rounded-lg p-6 max-w-md w-full mx-4 border border-primary">
            <h2 className="text-xl font-bold mb-4 text-primary">Share Whiteboard</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-secondary">Share Options</label>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const shareData = exportToJSON();
                      if (navigator.share) {
                        navigator.share({
                          title: 'WhiteBoard Drawing',
                          text: 'Check out my whiteboard drawing!',
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(shareData).then(() => {
                          alert('Drawing data copied to clipboard!');
                        });
                      }
                    }}
                    className="w-full p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Share via Native Share API
                  </button>
                  <button
                    onClick={() => {
                      const shareData = exportToJSON();
                      navigator.clipboard.writeText(shareData).then(() => {
                        alert('Drawing data copied to clipboard!');
                      });
                    }}
                    className="w-full p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={() => {
                      alert('Shareable URLs coming soon!');
                    }}
                    className="w-full p-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                  >
                    Generate Shareable Link
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-accent text-primary rounded-md hover:bg-tertiary transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
