// src/components/ui/button.js

import React from 'react';

const Button = ({ children, variant = 'default', size = 'md', className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded focus:outline-none focus:ring-2';
  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };
  const variantStyles = {
    default: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    ghost: 'bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-100 focus:ring-blue-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
