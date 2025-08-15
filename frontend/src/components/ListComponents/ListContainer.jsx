import React from 'react';

export default function ListContainer({ children, extraElement }) {
  return (
    <div className="space-y-4">
      {extraElement}
      {children}
    </div>
  );
}