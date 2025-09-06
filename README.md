# Collaborative Whiteboard Application

A production-ready collaborative whiteboard application built with React, TypeScript, and TailwindCSS. Similar to Excalidraw, this application provides real-time collaborative drawing capabilities with smooth canvas performance.

## 🚀 Features

### ✅ Currently Implemented
- **Core Drawing Tools**: Rectangle, Circle, Line, Arrow, Text, Sticky Notes
- **Canvas Interaction**: Zoom, Pan, Grid with snap-to-grid functionality
- **Shape Management**: Select, move, resize, rotate, delete shapes
- **Modern UI**: Clean toolbar with tool selection and view controls
- **State Management**: Centralized store using Zustand
- **TypeScript**: Full type safety with comprehensive interfaces
- **Responsive Design**: TailwindCSS-based responsive layout

### 🚧 In Development
- **Freehand Drawing**: Pen tool with pressure sensitivity
- **Undo/Redo System**: Complete history management
- **Shape Grouping**: Group and ungroup multiple shapes
- **Layer Management**: Multiple layers with visibility controls
- **Keyboard Shortcuts**: Quick access to common actions

### 🔜 Planned Features
- **Real-time Collaboration**: WebSocket-based multi-user editing
- **Live Cursors**: Show other users' cursors with names/colors
- **Conflict Resolution**: CRDT-based synchronization using Y.js
- **Export/Import**: PNG, SVG, JSON format support
- **Offline Support**: IndexedDB persistence with sync
- **User Authentication**: OAuth and email-based login
- **Room Management**: Private rooms with shareable links

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety and better development experience
- **TailwindCSS**: Utility-first CSS framework for rapid styling
- **Konva.js**: 2D canvas rendering for smooth graphics performance
- **Zustand**: Lightweight state management with minimal boilerplate

### Planned Backend
- **Node.js + Express**: RESTful API server
- **WebSockets**: Real-time communication
- **MongoDB/PostgreSQL**: Data persistence
- **Y.js**: Conflict-free replicated data types (CRDT)
- **Docker**: Containerized deployment

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Canvas.tsx       # Main canvas component with Konva
│   ├── Grid.tsx         # Grid overlay component
│   ├── SelectionBox.tsx # Selection rectangle
│   ├── ShapeRenderer.tsx# Individual shape rendering
│   └── Toolbar.tsx      # Tool selection sidebar
├── store/               # State management
│   └── whiteboardStore.ts # Zustand store
├── types/               # TypeScript definitions
│   └── index.ts         # Shape and event interfaces
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles with Tailwind
```

## 🎯 Core Architecture

### Shape System
All shapes inherit from a `BaseShape` interface with common properties:
- Position, dimensions, rotation
- Styling (fill, stroke, opacity)
- State (visible, locked, zIndex)
- Metadata (id, timestamps)

### State Management
Centralized store using Zustand provides:
- Shape CRUD operations
- Selection management
- Tool state
- Canvas view state (zoom, pan)
- History for undo/redo

### Canvas Rendering
Konva.js handles:
- High-performance 2D rendering
- Mouse/touch event handling
- Shape transformations
- Layered rendering system

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whiteboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎮 Usage

### Basic Drawing
1. Select a tool from the toolbar (Rectangle, Circle, Line, etc.)
2. Click and drag on the canvas to create shapes
3. Use the Select tool to move and modify existing shapes

### Canvas Navigation
- **Zoom**: Mouse wheel or zoom controls
- **Pan**: Select Hand tool and drag, or hold space while dragging
- **Grid**: Toggle grid visibility and snap-to-grid functionality

### Keyboard Shortcuts (Planned)
- `V` - Select tool
- `R` - Rectangle tool
- `C` - Circle tool
- `L` - Line tool
- `T` - Text tool
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Delete` - Delete selected shapes
- `Ctrl+A` - Select all

## 🏗️ Development Roadmap

### Phase 1: Core Features ✅
- [x] Basic shape tools and canvas
- [x] State management setup
- [x] TypeScript interfaces
- [x] UI/UX foundation

### Phase 2: Enhanced Editing 🚧
- [ ] Complete undo/redo system
- [ ] Freehand drawing tool
- [ ] Shape grouping and layers
- [ ] Keyboard shortcuts
- [ ] Export functionality

### Phase 3: Collaboration 🔜
- [ ] WebSocket server setup
- [ ] Real-time shape synchronization
- [ ] Live cursors and user presence
- [ ] Room management system

### Phase 4: Persistence & Deployment 🔜
- [ ] Backend API development
- [ ] User authentication
- [ ] Cloud storage integration
- [ ] Docker containerization
- [ ] Production deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Style

This project follows:
- **ESLint** configuration for code quality
- **Prettier** for code formatting
- **TypeScript strict mode** for type safety
- **React Hooks** patterns for component logic
- **TailwindCSS** utility classes for styling

## 🐛 Known Issues

- Grid rendering optimization needed for large canvases
- Shape selection handles not yet implemented
- Mobile touch interactions need refinement

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Excalidraw](https://excalidraw.com/)
- Built with [Konva.js](https://konvajs.org/) for canvas rendering
- Uses [Y.js](https://github.com/yjs/yjs) approach for collaboration
- UI design inspired by modern collaborative tools

---

**Status**: Active Development | **Version**: 0.1.0 | **Last Updated**: September 2025
