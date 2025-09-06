// import React from 'react';

function TestApp() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Test Toolbar */}
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #e5e7eb',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <button style={{
            padding: '8px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#3b82f6',
            color: 'white',
            cursor: 'pointer'
          }}>
            Select Tool
          </button>
          <button style={{
            padding: '8px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            marginLeft: '8px',
            cursor: 'pointer'
          }}>
            Rectangle
          </button>
        </div>
      </div>

      {/* Test Canvas Area */}
      <div style={{
        flex: 1,
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '800px',
          height: '600px',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          color: '#6b7280'
        }}>
          Canvas Area - Working!
        </div>
      </div>

      {/* Test Footer */}
      <div style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>Zoom: 100%</span>
        <div>
          <button style={{
            padding: '6px 12px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginRight: '8px',
            cursor: 'pointer'
          }}>
            Share
          </button>
          <button style={{
            padding: '6px 12px',
            backgroundColor: '#e5e7eb',
            color: '#374151',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Library
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestApp;
