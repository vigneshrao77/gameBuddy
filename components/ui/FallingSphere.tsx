import React from "react";
import "./FallingSphere.css";

export const FallingSphere = () => {
  return (
    <div className="falling-sphere-container" aria-hidden="true">
      <div className="fs-x">
        <div className="fs-y">
          <div className="fs-trail" />
          {/* Glow is now a sibling of the ball, not a child — it fades
              in sync with the ball but no longer inherits its squash. */}
          <div className="fs-glow-wrap">
            <div className="fs-glow" />
          </div>
          <div className="fs-ball">
            <div className="fs-core" />
          </div>
        </div>
      </div>
    </div>
  );
};
