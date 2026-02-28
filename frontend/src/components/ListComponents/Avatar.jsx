import React from 'react';

const Avatar = ({ src, name, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (!src) {
    return (
      <div className={`${sizeClasses[size]} bg-gray-300 rounded-full flex items-center justify-center`}>
        <span className={`${textSizes[size]} font-medium text-gray-600`}>
          {name ? name.charAt(0).toUpperCase() : '?'}
        </span>
      </div>
    );
  }

  const isBase64 = typeof src === 'string' && 
                   (src.startsWith('data:image/') || 
                    src.startsWith('/9j/') || 
                    src.startsWith('iVBORw0KGgo'));

  return (
    <div className="relative">
      <img
        src={isBase64 ? src : src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover`}
        onError={(e) => {
          e.target.style.display = 'none';
          // Show fallback when image fails to load
          const fallback = e.target.nextSibling;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      {/* Fallback displayed if image fails to load */}
      <div 
        className={`${sizeClasses[size]} bg-gray-300 rounded-full flex items-center justify-center absolute top-0 left-0 hidden`}
      >
        <span className={`${textSizes[size]} font-medium text-gray-600`}>
          {name ? name.charAt(0).toUpperCase() : '?'}
        </span>
      </div>
    </div>
  );
};

export default Avatar;