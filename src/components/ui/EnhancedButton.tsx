import React, { useState, useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import './EnhancedButton.css';

interface EnhancedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  highContrast?: boolean;
  animationIntensity?: number;
  glowColor?: string;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  highContrast = false,
  animationIntensity = 70,
  glowColor,
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Create ripple effect
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }

    // Trigger press animation
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    // Call onClick handler
    if (onClick) {
      onClick();
    }
  };

  const getVariantClasses = () => {
    if (highContrast) {
      return {
        primary: 'bg-white text-black border-2 border-black hover:bg-gray-200',
        secondary: 'bg-gray-800 text-white border-2 border-white hover:bg-gray-700',
        accent: 'bg-yellow-400 text-black border-2 border-black hover:bg-yellow-300',
        ghost: 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-black'
      };
    }

    return {
      primary: 'bg-gradient-to-r from-coral to-yellow text-white hover:shadow-xl',
      secondary: 'bg-gradient-to-r from-teal to-blue-400 text-white hover:shadow-lg',
      accent: 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:shadow-lg',
      ghost: 'bg-transparent text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
    };
  };

  const getSizeClasses = () => {
    return {
      small: 'px-3 py-2 text-sm',
      medium: 'px-6 py-3 text-base',
      large: 'px-8 py-4 text-lg'
    };
  };

  const variantClasses = getVariantClasses()[variant];
  const sizeClasses = getSizeClasses()[size];

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`
        enhanced-button
        ${variantClasses}
        ${sizeClasses}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'disabled' : ''}
        ${loading ? 'loading' : ''}
        ${isPressed ? 'pressed' : ''}
        ${highContrast ? 'high-contrast' : ''}
        ${className}
        relative overflow-hidden
        font-medium rounded-xl
        transition-all duration-200 ease-out
        transform hover:scale-105 active:scale-95
        focus:outline-none focus:ring-4 focus:ring-opacity-50
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      `}
      style={{
        '--animation-intensity': animationIntensity / 100,
        '--glow-color': glowColor || 'rgba(255, 107, 107, 0.3)',
        '--transition-duration': '200ms',
        '--timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)'
      } as React.CSSProperties}
      {...props}
    >
      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}

      {/* Button Content */}
      <span className="button-content flex items-center justify-center space-x-2">
        {Icon && iconPosition === 'left' && (
          <Icon className={`icon ${loading ? 'animate-spin' : ''} ${size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-6 h-6' : 'w-5 h-5'}`} />
        )}
        
        {loading ? (
          <span className="loading-spinner" />
        ) : (
          <span className="button-text">{children}</span>
        )}
        
        {Icon && iconPosition === 'right' && !loading && (
          <Icon className={`icon ${size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-6 h-6' : 'w-5 h-5'}`} />
        )}
      </span>

      {/* Glow Effect */}
      <div className="button-glow" />
      
      {/* Shine Effect */}
      <div className="button-shine" />
    </button>
  );
};

export default EnhancedButton;