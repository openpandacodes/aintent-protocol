import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('Script starting...');

// Simple test component
const App = () => {
  console.log('App component rendering...');
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
      <h1 style={{ color: 'black' }}>Hello from React!</h1>
      <p style={{ color: 'black' }}>If you can see this, React is working.</p>
    </div>
  );
};

// Get the root element
console.log('Looking for root element...');
const container = document.getElementById('root');
console.log('Root element found:', !!container);

// Make sure we found it
if (!container) {
  console.error('Root element not found!');
  throw new Error('Root element not found!');
}

// Create and render root
console.log('Creating root...');
const root = createRoot(container);
console.log('Rendering app...');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 