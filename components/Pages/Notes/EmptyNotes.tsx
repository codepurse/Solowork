import React from "react";

const EmptyNotes: React.FC = () => {
  return (
    <div className="empty-notes-container">
      <div className="empty-notes-animation">
        <svg
          width="170"
          height="170"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="empty-notes-svg"
        >
          {/* Paper stack background */}
          <rect
            className="paper-stack-bg"
            x="40"
            y="40"
            width="120"
            height="140"
            rx="8"
          />

          {/* Paper stack middle */}
          <rect
            className="paper-stack-middle"
            x="35"
            y="35"
            width="120"
            height="140"
            rx="8"
          />

          {/* Main paper */}
          <rect
            className="paper-main"
            x="30"
            y="30"
            width="120"
            height="140"
            rx="8"
          />

          {/* Note lines */}
          <line className="note-line" x1="50" y1="60" x2="130" y2="60" />
          <line className="note-line" x1="50" y1="85" x2="130" y2="85" />
          <line className="note-line" x1="50" y1="110" x2="100" y2="110" />

          {/* Pencil */}
          <path
            className="pencil"
            d="M140 70L120 90M120 90L110 100M120 90L130 80"
          />
        </svg>
      </div>
      <h3 className="empty-notes-title">No Notes Selected</h3>
      <p className="empty-notes-description">
        Select a note from the sidebar or create a new one to get started
      </p>
    </div>
  );
};

export default EmptyNotes;
