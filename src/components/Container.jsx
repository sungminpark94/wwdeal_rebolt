import React from 'react';

export const Container = ({ children, className = '' }) => {
  return (
    <div className={`px-4 w-full max-w-md mx-auto ${className}`}>
      {children}
    </div>
  );
};

export default Container; 