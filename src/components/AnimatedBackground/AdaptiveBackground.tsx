import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Star, Sparkles, Cloud, Leaf, Fish, Castle } from 'lucide-react';
import './AdaptiveBackground.css';

interface ParticleConfig {
  count: number;
  speed: number;
  size: number[];
  colors: string[];
}

interface AtmosphericEffects {
  blur: number;
  glow: number;
  overlay?: string;
}

interface BackgroundProps {
  setting: 'forest' | 'ocean' | 'space' | 'castle' | 'mountain' | 'village';
  intensity?: number; // 0-100
  particleConfig?: Partial<ParticleConfig>;
  atmosphericEffects?: Partial<AtmosphericEffects>;
  className?: string;
  reducedMotion?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  color: string;
  type: 'star' | 'bubble' | 'leaf' | 'sparkle' | 'cloud' | 'magic';
}

const settingConfigs = {
  forest: {
    gradient: 'linear-gradient(135deg, #2d5016 0%, #3e7b27 50%, #4a9d2a 100%)',
    particles: {
      count: 40,
      speed: 0.3,
      size: [2, 6],
      colors: ['#90EE90', '#32CD32', '#228B22', '#FFD700'],
      types: ['leaf', 'sparkle']
    },
    atmosphere: { blur: 1.5, glow: 0.8, overlay: 'rgba(46, 125, 50, 0.1)' }
  },
  ocean: {
    gradient: 'linear-gradient(135deg, #006064 0%, #0097A7 50%, #00BCD4 100%)',
    particles: {
      count: 35,
      speed: 0.4,
      size: [3, 8],
      colors: ['#87CEEB', '#4682B4', '#1E90FF', '#00CED1'],
      types: ['bubble', 'sparkle']
    },
    atmosphere: { blur: 2, glow: 1.2, overlay: 'rgba(0, 188, 212, 0.15)' }
  },
  space: {
    gradient: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 50%, #415A77 100%)',
    particles: {
      count: 60,
      speed: 0.2,
      size: [1, 4],
      colors: ['#FFFFFF', '#FFD700', '#87CEEB', '#DDA0DD'],
      types: ['star', 'sparkle']
    },
    atmosphere: { blur: 0.5, glow: 1.5, overlay: 'rgba(13, 27, 42, 0.2)' }
  },
  castle: {
    gradient: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 50%, #9C27B0 100%)',
    particles: {
      count: 45,
      speed: 0.35,
      size: [2, 5],
      colors: ['#FFD700', '#FF69B4', '#DDA0DD', '#F0E68C'],
      types: ['magic', 'sparkle']
    },
    atmosphere: { blur: 1.8, glow: 1, overlay: 'rgba(156, 39, 176, 0.12)' }
  },
  mountain: {
    gradient: 'linear-gradient(135deg, #37474F 0%, #546E7A 50%, #78909C 100%)',
    particles: {
      count: 30,
      speed: 0.25,
      size: [2, 6],
      colors: ['#FFFFFF', '#E3F2FD', '#BBDEFB', '#90CAF9'],
      types: ['cloud', 'sparkle']
    },
    atmosphere: { blur: 1.2, glow: 0.6, overlay: 'rgba(120, 144, 156, 0.1)' }
  },
  village: {
    gradient: 'linear-gradient(135deg, #FF8A65 0%, #FFAB91 50%, #FFCCBC 100%)',
    particles: {
      count: 25,
      speed: 0.3,
      size: [3, 7],
      colors: ['#FFE082', '#FFCC02', '#FFA726', '#FF7043'],
      types: ['sparkle', 'magic']
    },
    atmosphere: { blur: 1, glow: 0.9, overlay: 'rgba(255, 171, 145, 0.08)' }
  }
};

const AdaptiveBackground: React.FC<BackgroundProps> = ({
  setting,
  intensity = 70,
  particleConfig = {},
  atmosphericEffects = {},
  className = '',
  reducedMotion = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  const config = useMemo(() => {
    const baseConfig = settingConfigs[setting];
    const intensityMultiplier = intensity / 100;
    
    return {
      ...baseConfig,
      particles: {
        ...baseConfig.particles,
        count: Math.floor(baseConfig.particles.count * intensityMultiplier),
        speed: baseConfig.particles.speed * intensityMultiplier,
        ...particleConfig
      },
      atmosphere: {
        ...baseConfig.atmosphere,
        ...atmosphericEffects
      }
    };
  }, [setting, intensity, particleConfig, atmosphericEffects]);

  // Create particle based on type
  const createParticle = (id: number, type?: string): Particle => {
    const particleType = type || config.particles.types[Math.floor(Math.random() * config.particles.types.length)];
    const sizeRange = config.particles.size;
    
    return {
      id,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
      opacity: Math.random() * 0.3 + 0.4,
      velocityX: (Math.random() - 0.5) * config.particles.speed,
      velocityY: (Math.random() - 0.5) * config.particles.speed,
      life: 0,
      maxLife: Math.random() * 400 + 200,
      color: config.particles.colors[Math.floor(Math.random() * config.particles.colors.length)],
      type: particleType as any
    };
  };

  // Initialize particles
  useEffect(() => {
    if (reducedMotion) return;
    
    particlesRef.current = Array.from({ length: config.particles.count }, (_, i) => 
      createParticle(i)
    );
  }, [config.particles.count, reducedMotion]);

  // Handle visibility for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Animation loop
  useEffect(() => {
    if (reducedMotion || !isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.life += 1;

        // Wrap around screen edges
        if (particle.x < -20) particle.x = canvas.width + 20;
        if (particle.x > canvas.width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = canvas.height + 20;
        if (particle.y > canvas.height + 20) particle.y = -20;

        // Calculate fade in/out opacity
        const lifeCycle = particle.life / particle.maxLife;
        let fadeOpacity = particle.opacity;
        
        if (lifeCycle < 0.2) {
          fadeOpacity = particle.opacity * (lifeCycle / 0.2);
        } else if (lifeCycle > 0.8) {
          fadeOpacity = particle.opacity * ((1 - lifeCycle) / 0.2);
        }

        // Reset particle when life cycle completes
        if (particle.life >= particle.maxLife) {
          particlesRef.current[index] = createParticle(particle.id);
          return;
        }

        // Draw particle based on type
        ctx.save();
        ctx.globalAlpha = Math.max(0, fadeOpacity);
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 2;

        drawParticleByType(ctx, particle);
        
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, reducedMotion, isVisible]);

  const drawParticleByType = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    const { x, y, size, type } = particle;

    switch (type) {
      case 'star':
        drawStar(ctx, x, y, size);
        break;
      case 'bubble':
        drawBubble(ctx, x, y, size);
        break;
      case 'leaf':
        drawLeaf(ctx, x, y, size);
        break;
      case 'sparkle':
        drawSparkle(ctx, x, y, size);
        break;
      case 'cloud':
        drawCloud(ctx, x, y, size);
        break;
      case 'magic':
        drawMagic(ctx, x, y, size);
        break;
      default:
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
  };

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawBubble = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Add highlight
    ctx.globalAlpha *= 0.6;
    ctx.beginPath();
    ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  };

  const drawLeaf = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.6, size, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawSparkle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const lines = 4;
    for (let i = 0; i < lines; i++) {
      const angle = (i * Math.PI) / (lines / 2);
      const length = size * 1.5;
      
      ctx.beginPath();
      ctx.moveTo(x - Math.cos(angle) * length, y - Math.sin(angle) * length);
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
      ctx.lineWidth = size * 0.3;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  };

  const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const circles = 3;
    for (let i = 0; i < circles; i++) {
      const offsetX = (i - 1) * size * 0.6;
      const radius = size * (0.8 + Math.random() * 0.4);
      
      ctx.beginPath();
      ctx.arc(x + offsetX, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawMagic = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    // Draw diamond shape
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size * 0.7, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size * 0.7, y);
    ctx.closePath();
    ctx.fill();
    
    // Add inner glow
    ctx.globalAlpha *= 0.5;
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.5);
    ctx.lineTo(x + size * 0.35, y);
    ctx.lineTo(x, y + size * 0.5);
    ctx.lineTo(x - size * 0.35, y);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
  };

  return (
    <div className={`adaptive-background ${setting} ${className}`}>
      {/* Background Gradient */}
      <div 
        className="background-gradient"
        style={{
          background: config.gradient,
          filter: `blur(${config.atmosphere.blur}px)`
        }}
      />
      
      {/* Atmospheric Overlay */}
      {config.atmosphere.overlay && (
        <div 
          className="atmospheric-overlay"
          style={{
            background: config.atmosphere.overlay,
            filter: `blur(${config.atmosphere.glow}px)`
          }}
        />
      )}
      
      {/* Particle Canvas */}
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          className="particle-canvas"
          aria-hidden="true"
        />
      )}
      
      {/* Static Fallback for Reduced Motion */}
      {reducedMotion && (
        <div className="static-particles">
          {Array.from({ length: Math.min(config.particles.count, 15) }, (_, i) => {
            const IconComponent = getStaticIcon(setting);
            return (
              <IconComponent
                key={i}
                className="static-particle"
                size={Math.random() * 12 + 8}
                style={{
                  position: 'absolute',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.4 + 0.2,
                  color: config.particles.colors[Math.floor(Math.random() * config.particles.colors.length)]
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const getStaticIcon = (setting: string) => {
  const iconMap = {
    forest: Leaf,
    ocean: Fish,
    space: Star,
    castle: Castle,
    mountain: Cloud,
    village: Sparkles
  };
  return iconMap[setting as keyof typeof iconMap] || Star;
};

export default AdaptiveBackground;