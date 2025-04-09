import React from 'react';

const Test: React.FC = () => {
  return (
    <div style={{ 
      padding: '1rem', 
      backgroundColor: '#dbeafe', 
      marginBottom: '2rem',
      borderRadius: '0.5rem'
    }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        Test Component
      </h1>
      <p style={{ marginBottom: '0.5rem' }}>If you can see this, React is working correctly.</p>
      <p style={{ marginBottom: '0.5rem' }}>
        Claude API Key: {window.env?.REACT_APP_CLAUDE_API_KEY ? 'Present' : 'Missing'}
      </p>
      <p>Claude Model: {window.env?.REACT_APP_CLAUDE_MODEL || 'Not set'}</p>
    </div>
  );
};

export default Test; 