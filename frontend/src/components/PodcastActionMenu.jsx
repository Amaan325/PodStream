// components/PodcastActionMenu.jsx
import React from "react";

const PodcastActionMenu = ({ onDelete, onIgnore, onClose }) => {
  return (
    <div className="absolute right-2 top-10 bg-gray-800 text-white rounded shadow-lg z-20 w-40">
      <button
        onClick={() => {
          onIgnore();
          onClose();
        }}
        className="block w-full text-left px-4 py-2 hover:bg-gray-700"
      >
        Ignore
      </button>
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="block w-full text-left px-4 py-2 hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
};

export default PodcastActionMenu;
