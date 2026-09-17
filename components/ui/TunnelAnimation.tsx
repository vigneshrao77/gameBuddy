import React from 'react';
import './TunnelAnimation.css';

export const TunnelAnimation = () => {
  const circles = [
    { color: '#240046', index: 0 },
    { color: '#3c096c', index: 1 },
    { color: '#5a189a', index: 2 },
    { color: '#7b2cbf', index: 3 },
    { color: '#9d4edd', index: 4 },
    { color: '#c77dff', index: 5 },
    { color: '#e0aaff', index: 6 },
  ];

  return (
    <div className="tunnel-container">
      <div className="tunnel-loader" style={{ '--animationSpeed': '2s', '--circlesCount': 7 } as React.CSSProperties}>
        {circles.map((circle) => (
          <div 
            key={circle.index} 
            className="tunnel-circle" 
            style={{ '--color': circle.color, '--index': circle.index } as React.CSSProperties} 
          />
        ))}
      </div>
    </div>
  );
};
