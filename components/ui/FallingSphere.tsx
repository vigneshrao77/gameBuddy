import React from 'react';
import './FallingSphere.css';

export const FallingSphere = () => {
  return (
    <div className="falling-sphere-container" aria-hidden="true">
      <div className="fs-x">
        <div className="fs-y">
          <div className="fs-ball">
            <div className="fs-glow" />
            <div className="fs-trail" />
          </div>
        </div>
      </div>
    </div>
  );
};
