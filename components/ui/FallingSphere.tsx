import React from "react";
import "./FallingSphere.css";

export const FallingSphere = () => {
  return (
    <div className="falling-sphere-container" aria-hidden="true">
      <div className="fs-x">
        <div className="fs-y">
          <div className="fs-trail" />
          <div className="fs-ball">
            <div className="fs-core" />
            <div className="fs-glow" />
          </div>
        </div>
      </div>
    </div>
  );
};
