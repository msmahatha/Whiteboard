# Collaborative Whiteboard Application - Copilot Instructions

## Project Overview
This is a production-ready collaborative whiteboard application built with React, TypeScript, and TailwindCSS. The application allows users to create and manipulate shapes on a canvas with real-time collaboration capabilities (planned).

## Architecture & Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **TailwindCSS** for styling and responsive design
- **Konva.js** for high-performance 2D canvas rendering
- **Zustand** for lightweight state management
- **Vite** as the build tool and development server

### Key Design Patterns
- **Component-based architecture** with clear separation of concerns
- **Centralized state management** using Zustand store
- **Type-first development** with comprehensive TypeScript interfaces
- **Functional programming** approach with React hooks

## Code Organization

### Directory Structure
```
src/
├── components/     # Reusable UI components
├── store/         # Zustand state management
├── types/         # TypeScript type definitions
├── hooks/         # Custom React hooks (future)
├── utils/         # Utility functions (future)
└── services/      # API/collaboration services (future)
```

### Key Components
- **Canvas.tsx**: Main canvas component handling Konva rendering and interactions
- **Toolbar.tsx**: Tool selection sidebar with drawing tools and controls
- **ShapeRenderer.tsx**: Individual shape rendering logic for all shape types
- **Grid.tsx**: Grid overlay with snap-to-grid functionality
- **SelectionBox.tsx**: Selection rectangle for multi-select operations

### State Management
- **whiteboardStore.ts**: Central Zustand store managing:
  - Shape data and operations (CRUD)
  - Tool selection and canvas state
  - Selection management
  - View state (zoom, pan, grid)
  - History for undo/redo operations

## Development Guidelines

### Code Style
- Use **functional components** with React hooks
- Prefer **const assertions** over enums for better TypeScript integration
- Use **explicit typing** for all function parameters and returns
- Follow **TailwindCSS utility-first** approach for styling
- Keep components **small and focused** on single responsibilities

### TypeScript Patterns
- All shapes extend `BaseShape` interface with common properties
- Use discriminated unions for shape types (`type` field as discriminator)
- Prefer `as const` for constant objects over enums
- Use generic types for reusable functions and components

### State Management Patterns
- Use Zustand's `subscribeWithSelector` for performance optimization
- Implement optimistic updates for smooth user interactions
- Keep store actions pure and predictable
- Separate business logic from UI components

### Canvas Development
- Use Konva.js for all canvas operations and rendering
- Implement proper event handling with `KonvaEventObject`
- Handle coordinate transformations for zoom/pan operations
- Optimize rendering with proper layering and caching

### Performance Considerations
- Minimize re-renders using React.memo and useMemo where appropriate
- Use Konva's built-in performance optimizations (caching, layering)
- Implement virtualization for large numbers of shapes (future)
- Debounce expensive operations like auto-save

## Shape System

### Base Shape Properties
All shapes inherit these properties:
- Position: `x`, `y`, `width`, `height`, `rotation`
- Styling: `fill`, `stroke`, `strokeWidth`, `opacity`
- State: `visible`, `locked`, `zIndex`
- Metadata: `id`, `createdAt`, `updatedAt`

### Shape Types
- **Rectangle**: Basic rectangle with optional corner radius
- **Circle**: Circle with configurable radius
- **Line**: Simple line between two points
- **Arrow**: Line with arrowhead at the end
- **Text**: Text with font properties and alignment
- **Sticky Note**: Rectangle with text content
- **Freehand**: Path-based drawing with multiple points

### Shape Operations
- Creation with default properties and auto-generated IDs
- Updates through partial shape objects
- Deletion with cleanup from layers and selection
- Bulk operations for multiple selected shapes

## Collaboration Architecture (Planned)

### Real-time Synchronization
- Use **Y.js** for conflict-free replicated data types (CRDTs)
- Implement **WebSocket** connections for real-time updates
- Show **live cursors** with user information
- Handle **offline/online** state transitions gracefully

### Event System
- Shape events: created, updated, deleted
- User events: cursor moved, user joined/left
- Room events: room created, permission changes

### Conflict Resolution
- Use CRDT operations for automatic conflict resolution
- Implement **operational transformation** for text editing
- Handle **concurrent shape modifications** gracefully

## Future Enhancements

### Phase 2: Enhanced Editing
- Complete undo/redo system with command pattern
- Freehand drawing with pressure sensitivity
- Shape grouping and layer management
- Comprehensive keyboard shortcuts
- Export to PNG, SVG, and JSON formats

### Phase 3: Collaboration
- WebSocket server with Express.js
- Real-time shape synchronization with Y.js
- Live cursors and user presence indicators
- Room-based collaboration with permissions

### Phase 4: Persistence & Deployment
- Backend API with Node.js and Express
- User authentication with OAuth and JWT
- Cloud storage integration (AWS S3/Google Cloud)
- Docker containerization for deployment
- CI/CD pipeline with automated testing

## Testing Strategy (Future)

### Unit Testing
- Test shape operations and transformations
- Test state management actions and selectors
- Test utility functions and calculations

### Integration Testing
- Test component interactions and data flow
- Test canvas operations and event handling
- Test collaboration synchronization

### E2E Testing
- Test complete user workflows
- Test real-time collaboration scenarios
- Test performance under load

## Common Patterns to Follow

### Component Creation
```typescript
interface ComponentProps {
  // Define props with proper types
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Use hooks at the top
  // Define event handlers with useCallback
  // Return JSX with proper TypeScript types
};
```

### Store Actions
```typescript
const action = useCallback((params: ParamType) => {
  set((state) => {
    // Immutable state updates
    return { ...state, property: newValue };
  });
}, [dependencies]);
```

### Shape Rendering
```typescript
const renderShape = () => {
  switch (shape.type) {
    case 'rectangle':
      return <Rect {...shapeProps} />;
    // Handle all shape types
    default:
      return null;
  }
};
```

## Performance Optimization Notes

### Canvas Optimization
- Use Konva's caching for complex shapes
- Implement proper layering (grid, shapes, selection, UI)
- Minimize redraws with intelligent dirty checking
- Use object pooling for frequently created/destroyed objects

### React Optimization
- Use React.memo for expensive components
- Implement proper dependency arrays in hooks
- Use useMemo for expensive calculations
- Avoid inline object creation in render methods

### Memory Management
- Clean up event listeners in useEffect cleanup
- Properly dispose of Konva objects when unmounting
- Implement proper cleanup in store actions
- Monitor for memory leaks in development

---

This is a living document that should be updated as the project evolves. All contributors should familiarize themselves with these patterns and guidelines.
