import React, { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [inputType, setInputType] = React.useState(type);

  React.useEffect(() => {
    if (showPasswordToggle && type === 'password') {
      setInputType(showPassword ? 'text' : 'password');
    }
  }, [showPassword, showPasswordToggle, type]);

  const baseClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200';
  const errorClasses = error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '';
  const leftPaddingClass = leftIcon ? 'pl-10' : '';
  const rightPaddingClass = rightIcon || showPasswordToggle ? 'pr-10' : '';

  const inputClasses = `${baseClasses} ${errorClasses} ${leftPaddingClass} ${rightPaddingClass} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">{leftIcon}</span>
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={inputClasses}
          {...props}
        />
        {(rightIcon || showPasswordToggle) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {showPasswordToggle ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            ) : (
              <span className="text-gray-400 text-sm">{rightIcon}</span>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;