# 🎨 WhiteBoard - Collaborative Drawing Application

A feature-rich, production-ready collaborative whiteboard application built with React, TypeScript, and modern web technologies. Similar to Excalidraw with enhanced functionality and performance optimizations.

![Whiteboard Preview](https://img.shields.io/badge/Status-Production%20Ready-green)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🖊️ Drawing Tools
- **Selection Tool** (V) - Select and manipulate shapes
- **Hand Tool** (H) - Pan around the canvas
- **Rectangle** (R) - Draw rectangles
- **Diamond** (D) - Draw diamond shapes
- **Ellipse/Circle** (O) - Draw ellipses and circles
- **Arrow** (A) - Draw arrows with customizable arrowheads
- **Line** (L) - Draw straight lines
- **Freehand Drawing** (P) - Free drawing with smooth curves
- **Text Tool** (T) - Add and edit text with advanced typography
- **Eraser** (E) - Remove parts of drawings
- **Laser Pointer** - Highlight areas temporarily

### 🎨 Styling & Customization
- **Color Picker** - Full color palette with custom colors
- **Stroke Width** - Adjustable line thickness
- **Fill Options** - Solid colors, transparent, or no fill
- **Opacity Control** - Adjustable transparency (0-100%)
- **Font Options** - Multiple font families and sizes
- **Text Formatting** - Bold, italic, and alignment options
- **Edge Styles** - Round or sharp line endings
- **Roughness/Sloppiness** - Hand-drawn aesthetic control

### � Advanced Functionality
- **Zoom & Pan** - Smooth zoom (Ctrl+Scroll) and pan controls
- **Grid System** - Toggleable alignment grid
- **Layer Management** - Organize shapes in layers
- **Undo/Redo** - Full history support (Ctrl+Z/Ctrl+Y)
- **Copy/Paste/Duplicate** - Efficient shape duplication (Ctrl+C/Ctrl+D)
- **Selection Box** - Multi-select with drag selection
- **Drag & Drop** - Move shapes by dragging
- **Resize Handles** - Visual resize controls for shapes

### 💾 File Management
- **Auto-Save** - Automatic saving every 30 seconds
- **Export Options** - PNG, SVG, and JSON formats
- **Import/Load** - Load saved whiteboard files
- **Project Management** - Save and organize multiple projects

### 🌓 User Experience
- **Dark/Light Theme** - Toggle between themes
- **Responsive Design** - Works on desktop and tablet
- **Keyboard Shortcuts** - Extensive hotkey support
- **Performance Monitor** - FPS and performance tracking (Ctrl+Shift+P)
- **Help Modal** - Built-in keyboard shortcut reference
- **Status Bar** - Real-time tool and canvas information
- **Error Boundaries** - Graceful error handling

### 🚀 Performance Features
- **Shape Culling** - Only render visible shapes for better performance
- **Optimized Rendering** - Efficient canvas drawing with transform matrices
- **Viewport Management** - Smart zoom and pan calculations
- **Memory Management** - Efficient state management with Zustand

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: CSS3 with CSS Variables
- **Canvas**: HTML5 Canvas API
- **Deployment**: Netlify

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/msmahatha/Whiteboard.git
cd Whiteboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## ⌨️ Keyboard Shortcuts

### Tools
- `1` or `V` - Selection tool
- `2` or `H` - Hand tool
- `3` or `R` - Rectangle
- `4` or `D` - Diamond
- `5` or `O` - Ellipse
- `6` or `A` - Arrow
- `7` or `L` - Line
- `8` or `P` - Draw/Pen
- `9` or `E` - Eraser
- `T` - Text tool
- `Escape` - Return to selection

### Actions
- `Ctrl+Z` - Undo
- `Ctrl+Shift+Z` or `Ctrl+Y` - Redo
- `Ctrl+C` or `Ctrl+D` - Copy/Duplicate
- `Delete` or `Backspace` - Delete selected
- `Ctrl+S` - Save (manual save)
- `Ctrl+Shift+P` - Toggle performance monitor

### Navigation
- `Ctrl+Scroll` - Zoom in/out
- `Mouse Drag` (with Hand tool) - Pan canvas
- `Double-click` (text) - Edit text
- `Click outside` - Finish text editing

## � Usage Guide

### Creating Shapes
1. Select a drawing tool from the toolbar
2. Click and drag on the canvas to create shapes
3. Use the style panel to customize appearance
4. Double-click text shapes to edit content

### Text Editing
1. Select the text tool (T)
2. Click anywhere to create instant text
3. Type your content
4. Double-click existing text to edit
5. Use the text formatting toolbar for styling

### Advanced Features
- **Multi-select**: Drag to create selection box
- **Zoom Navigation**: Use zoom controls or Ctrl+Scroll
- **Performance**: Monitor FPS with Ctrl+Shift+P
- **Layers**: Manage shape layers in the layer panel
- **Auto-save**: Automatic saving with status indicator

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── SimpleToolbar.tsx      # Main toolbar
│   ├── SimplifiedCanvas.tsx   # Canvas component
│   ├── StylePanel.tsx         # Styling controls
│   ├── TextEditor.tsx         # Text editing
│   ├── ZoomControls.tsx       # Zoom interface
│   ├── LayerPanel.tsx         # Layer management
│   ├── StatusBar.tsx          # Status information
│   ├── HelpModal.tsx          # Keyboard shortcuts
│   ├── ErrorBoundary.tsx      # Error handling
│   └── ...
├── hooks/               # Custom React hooks
│   └── useAutoSave.ts         # Auto-save functionality
├── store/               # State management
│   └── whiteboardStore.ts     # Zustand store
├── types/               # TypeScript definitions
│   └── index.ts               # Type definitions
└── App.tsx             # Main application
```

## 🎨 Customization

### Themes
Themes are managed through CSS variables in the store:
- Light theme with professional colors
- Dark theme for low-light environments
- Easily extensible for additional themes

### Adding New Tools
1. Define tool type in `types/index.ts`
2. Add tool logic in `SimplifiedCanvas.tsx`
3. Update toolbar in `SimpleToolbar.tsx`
4. Add keyboard shortcut in `App.tsx`

## 📊 Performance

- **Optimized Rendering**: Shape culling for large canvases
- **Memory Efficient**: Smart state management
- **Smooth Interactions**: 60fps target with performance monitoring
- **Responsive**: Sub-100ms tool switching

## 🚀 Deployment

The application is deployed on Netlify with automatic builds:
- **GitHub Repository**: [https://github.com/msmahatha/Whiteboard](https://github.com/msmahatha/Whiteboard)
- **Auto-deploy**: Pushes to main branch trigger deployment
- **Performance**: CDN-optimized static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## � Bug Reports

Please report bugs through GitHub Issues with:
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Performance monitor data (if applicable)

## � License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Excalidraw's intuitive design
- Built with modern React patterns and TypeScript
- Optimized for production deployment

## 📈 Roadmap

- [ ] Real-time collaboration with WebSocket
- [ ] Cloud storage integration
- [ ] Mobile app version
- [ ] Advanced shape libraries
- [ ] Plugin system
- [ ] Presentation mode
- [ ] Version history
- [ ] Team workspaces

---

**Made with ❤️ by the WhiteBoard Team**
