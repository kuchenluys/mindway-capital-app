import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-dark-300 text-sm font-medium mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <span className="absolute left-3 top-3 text-lg">{icon}</span>}
          <input
            ref={ref}
            {...props}
            className={clsx(
              'w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500',
              'focus:outline-none focus:border-primary-500 transition',
              icon && 'pl-10',
              error && 'border-red-500 focus:border-red-500',
              className
            )}
          />
        </div>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
