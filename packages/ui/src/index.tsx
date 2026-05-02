import React from 'react';

export const Button = ({ children, onClick, variant = 'primary', className = '' }: any) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-bold transition-all';
  const variants: any = {
    primary: 'bg-[#FFD700] text-black hover:bg-[#FFC800]',
    secondary: 'bg-gray-800 text-white hover:bg-gray-700',
    outline: 'border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black'
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white dark:bg-[#121212] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 ${className}`}>
    {children}
  </div>
);

export const StatusBadge = ({ status, className = '' }: any) => {
  const getColors = (s: string) => {
    switch (s.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColors(status)} ${className}`}>
      {status.toUpperCase()}
    </span>
  );
};

export const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-sm font-semibold opacity-70">{label}</label>}
    <input 
      className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:border-[#FFD700]" 
      {...props} 
    />
  </div>
);

export const UI_VERSION = "1.1.0";
