// Excalidraw-style SVG icons for the toolbar
export const Icons = {
  // Selection & Manipulation Tools
  Select: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M3 3l1.5 13L9 12h7l-13-9z" />
    </svg>
  ),

  Hand: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10 2L6 6v6l4 4 4-4V6l-4-4z" />
      <path d="M6 8h8M6 12h8" stroke="currentColor" strokeWidth="0.5" fill="none" />
    </svg>
  ),

  Laser: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <circle cx="10" cy="10" r="3" />
      <path d="M10 1v2M10 17v2M18.66 6.34l-1.41 1.41M2.75 17.25l1.41-1.41M1 10h2M17 10h2M18.66 13.66l-1.41-1.41M2.75 2.75l1.41 1.41" strokeWidth="1.5" stroke="currentColor" fill="none"/>
    </svg>
  ),

  // Drawing Tools
  Rectangle: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4">
      <rect x="3" y="5" width="14" height="10" strokeWidth="1.5" rx="1"/>
    </svg>
  ),

  Diamond: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4">
      <path d="M10 3l7 7-7 7-7-7z" strokeWidth="1.5"/>
    </svg>
  ),

  Ellipse: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4">
      <ellipse cx="10" cy="10" rx="7" ry="5" strokeWidth="1.5"/>
    </svg>
  ),

  Arrow: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4">
      <path d="M3 10h14M13 6l4 4-4 4" strokeWidth="1.5"/>
    </svg>
  ),

  Line: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4">
      <path d="M3 17l14-14" strokeWidth="1.5"/>
    </svg>
  ),

  Draw: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4">
      <path d="M3 17s3-3 7-3 7 3 7 3M5 8s3-3 5-3 5 3 5 3" strokeWidth="1.5"/>
    </svg>
  ),

  Text: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M6 4h8v2H6zM8 6h4v10h2v2H6v-2h2V6z"/>
    </svg>
  ),

  Image: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4">
      <rect x="3" y="3" width="14" height="14" strokeWidth="1.5" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <path d="m13 13-3-3-3 3" strokeWidth="1.5"/>
    </svg>
  ),

  Eraser: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M8.5 3.5L16.5 11.5L13 15L5 7L8.5 3.5zM11 16h6v1h-6z"/>
    </svg>
  ),

  // UI Controls
  Undo: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4">
      <path d="M3 10h8a4 4 0 004-4V5" strokeWidth="1.5"/>
      <path d="M7 6L3 10l4 4" strokeWidth="1.5"/>
    </svg>
  ),

  Redo: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4">
      <path d="M17 10H9a4 4 0 00-4 4v1" strokeWidth="1.5"/>
      <path d="M13 6l4 4-4 4" strokeWidth="1.5"/>
    </svg>
  ),

  Grid: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4">
      <path d="M5 5h10v10H5zM5 9h10M9 5v10" strokeWidth="1"/>
    </svg>
  ),

  Lock: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <rect x="5" y="9" width="10" height="7" rx="2"/>
      <path d="M7 9V7a3 3 0 016 0v2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),

  Unlock: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4">
      <rect x="5" y="9" width="10" height="7" rx="2" strokeWidth="1.5"/>
      <path d="M7 9V7a3 3 0 015.12-2.12" strokeWidth="1.5"/>
    </svg>
  ),

  // Theme toggle
  Sun: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <circle cx="10" cy="10" r="3"/>
      <path d="M10 1v2M10 17v2M18.66 6.34l-1.41 1.41M2.75 17.25l1.41-1.41M1 10h2M17 10h2M18.66 13.66l-1.41-1.41M2.75 2.75l1.41 1.41"/>
    </svg>
  ),

  Moon: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
    </svg>
  ),

  // Alignment tools
  AlignLeft: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M3 4h14v2H3zM3 8h10v2H3zM3 12h14v2H3zM3 16h10v2H3z"/>
    </svg>
  ),

  AlignCenter: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M3 4h14v2H3zM5 8h10v2H5zM3 12h14v2H3zM5 16h10v2H5z"/>
    </svg>
  ),

  AlignRight: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M3 4h14v2H3zM7 8h10v2H7zM3 12h14v2H3zM7 16h10v2H7z"/>
    </svg>
  ),

  // More tools
  Group: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4">
      <rect x="3" y="3" width="6" height="6" strokeWidth="1.5" rx="1"/>
      <rect x="11" y="11" width="6" height="6" strokeWidth="1.5" rx="1"/>
      <path d="M9 9l2 2" strokeWidth="1.5"/>
    </svg>
  ),

  Copy: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4">
      <rect x="7" y="7" width="10" height="10" strokeWidth="1.5" rx="2"/>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="1.5"/>
    </svg>
  ),

  Delete: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M6 2l1-1h6l1 1M4 4v12a2 2 0 002 2h8a2 2 0 002-2V4M8 8v6M12 8v6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
};

export type IconName = keyof typeof Icons;
