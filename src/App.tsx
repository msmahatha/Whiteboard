import { useState, useEffect } from 'react';
import { SimpleToolbar } from './components/SimpleToolbar';
import { SimplifiedCanvas } from './components/SimplifiedCanvas';
import { useWhiteboardStore } from './store/whiteboardStore';
import './App.css';

function App() {
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  
  const { theme, setTool, undo, redo } = useWhiteboardStore();

  useEffect(() => {
    const updateCanvasSize = () => {
      const toolbarHeight = 70;
      const padding = 20;

      setCanvasSize({
        width: window.innerWidth - padding,
        height: window.innerHeight - toolbarHeight - padding,
      });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Check for Ctrl/Cmd modifiers for special actions
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 's':
            e.preventDefault();
            // TODO: Implement save
            break;
        }
        return;
      }

      const key = e.key.toLowerCase();
      switch (key) {
        case '1':
          setTool('select');
          break;
        case '2':
          setTool('hand');
          break;
        case '3':
          setTool('rectangle');
          break;
        case '4':
          setTool('diamond');
          break;
        case '5':
          setTool('ellipse');
          break;
        case '6':
          setTool('arrow');
          break;
        case '7':
          setTool('line');
          break;
        case '8':
          setTool('draw');
          break;
        case '9':
          setTool('eraser');
          break;
        case 't':
          setTool('text');
          break;
        case 'v':
          setTool('select');
          break;
        case 'r':
          setTool('rectangle');
          break;
        case 'o':
          setTool('ellipse');
          break;
        case 'a':
          setTool('arrow');
          break;
        case 'l':
          setTool('line');
          break;
        case 'd':
          setTool('diamond');
          break;
        case 'p':
          setTool('draw');
          break;
        case 'h':
          setTool('hand');
          break;
        case 'e':
          setTool('eraser');
          break;
        case 'escape':
          setTool('select');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setTool, undo, redo]);

  console.log('Full App rendering, theme:', theme, 'canvasSize:', canvasSize);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
      color: theme === 'light' ? '#000000' : '#ffffff'
    }}>
      {/* Toolbar */}
      <SimpleToolbar />
      
      {/* Canvas Area */}
      <main style={{
        flex: 1,
        position: 'relative',
        backgroundColor: theme === 'light' ? '#f9fafb' : '#111827',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
                <SimplifiedCanvas 
          width={canvasSize.width} 
          height={canvasSize.height} 
        />
      </main>
    </div>
  );
}

export default App;
