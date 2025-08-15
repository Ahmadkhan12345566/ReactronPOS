import React from 'react';

export default function ListControlButtons({ buttons }) {
  return (
    <div className="flex items-center space-x-2">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          title={button.title}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
}