import React, { useState, useEffect, useRef } from 'react';
import './MicroInteractions.css';

interface SelectionFeedbackProps {
  children: React.ReactNode;
  onSelect?: () => void;
  isSelected?: boolean;
  disabled?: boolean;
  className?: string;
  glowColor?: string;
  intensity?: number;
}

export const SelectionFeedback: React.FC<SelectionFeedbackProps> = ({
  children,
  onSelect,
  isSelected = false,
  disabled = false,
  className = '',
  glowColor = '#FF6B6B',
  intensity = 70
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (disabled) return;

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);

    if (onSelect) {
      onSelect();
    }
  };

  return (
    <div
      ref={elementRef}
      className={`
        selection-feedback
        ${isSelected ? 'selected' : ''}
        ${isAnimating ? 'animating' : ''}
        ${disabled ? 'disabled' : ''}
        ${className}
      `}
      onClick={handleClick}
      style={{
        '--glow-color': glowColor,
        '--intensity': intensity / 100
      } as React.CSSProperties}
    >
      {children}
      <div className="selection-glow" />
      <div className="selection-pulse" />
    </div>
  );
};

interface PageTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  isVisible,
  direction = 'up',
  duration = 600,
  className = ''
}) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  if (!shouldRender) return null;

  const getTransformValue = () => {
    switch (direction) {
      case 'up': return 'translateY(20px)';
      case 'down': return 'translateY(-20px)';
      case 'left': return 'translateX(20px)';
      case 'right': return 'translateX(-20px)';
      default: return 'translateY(20px)';
    }
  };

  return (
    <div
      className={`
        page-transition
        ${isVisible ? 'visible' : 'hidden'}
        ${className}
      `}
      style={{
        '--transform-start': getTransformValue(),
        '--duration': `${duration}ms`
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  intensity?: number;
  direction?: 'vertical' | 'horizontal' | 'circular';
  duration?: number;
  className?: string;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  intensity = 50,
  direction = 'vertical',
  duration = 3000,
  className = ''
}) => {
  return (
    <div
      className={`
        floating-element
        floating-${direction}
        ${className}
      `}
      style={{
        '--intensity': intensity / 100,
        '--duration': `${duration}ms`
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

interface PulseEffectProps {
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  duration?: number;
  className?: string;
}

export const PulseEffect: React.FC<PulseEffectProps> = ({
  children,
  color = '#FF6B6B',
  intensity = 70,
  duration = 2000,
  className = ''
}) => {
  return (
    <div
      className={`
        pulse-effect
        ${className}
      `}
      style={{
        '--pulse-color': color,
        '--intensity': intensity / 100,
        '--duration': `${duration}ms`
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

interface ShimmerEffectProps {
  children: React.ReactNode;
  color?: string;
  duration?: number;
  className?: string;
}

export const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  children,
  color = 'rgba(255, 255, 255, 0.3)',
  duration = 2000,
  className = ''
}) => {
  return (
    <div
      className={`
        shimmer-effect
        ${className}
      `}
      style={{
        '--shimmer-color': color,
        '--duration': `${duration}ms`
      } as React.CSSProperties}
    >
      {children}
      <div className="shimmer-overlay" />
    </div>
  );
};

interface MagneticEffectProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const MagneticEffect: React.FC<MagneticEffectProps> = ({
  children,
  strength = 0.3,
  className = ''
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={elementRef}
      className={`magnetic-effect ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 && position.y === 0 ? 'transform 0.3s ease-out' : 'none'
      }}
    >
      {children}
    </div>
  );
};