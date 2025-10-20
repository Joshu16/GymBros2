import React from 'react';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center min-h-screen bg-gray-900 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-gray-700 border-t-white rounded-full animate-spin`}
      />
    </div>
  );
};
