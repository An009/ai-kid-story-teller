import React, { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import "./AnimatedBackground.css";

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
}

interface AnimatedBackgroundProps {
  particleCount?: number;
  enableParticles?: boolean;
  blurIntensity?: number;
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  particleCount = 60,
  enableParticles = true,
  blurIntensity = 40,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // Create initial particles
  const createParticle = (id: number): Particle => {
    return {
      id,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 2, // 2-4px
      opacity: Math.random() * 0.2 + 0.6, // 60-80%
      velocityX: (Math.random() - 0.5) * 0.5, // Slow movement
      velocityY: (Math.random() - 0.5) * 0.5,
      life: 0,
      maxLife: Math.random() * 300 + 200, // Fade cycle duration
    };
  };

  // Initialize particles
  useEffect(() => {
    if (!enableParticles) return;

    particlesRef.current = Array.from({ length: particleCount }, (_, i) =>
      createParticle(i)
    );
  }, [particleCount, enableParticles]);

  // Handle visibility for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!enableParticles || !isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.life += 1;

        // Wrap around screen edges
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;

        // Calculate fade in/out opacity
        const lifeCycle = particle.life / particle.maxLife;
        let fadeOpacity = particle.opacity;

        if (lifeCycle < 0.2) {
          // Fade in
          fadeOpacity = particle.opacity * (lifeCycle / 0.2);
        } else if (lifeCycle > 0.8) {
          // Fade out
          fadeOpacity = particle.opacity * ((1 - lifeCycle) / 0.2);
        }

        // Reset particle when life cycle completes
        if (particle.life >= particle.maxLife) {
          particlesRef.current[index] = createParticle(particle.id);
          return;
        }

        // Draw star particle
        ctx.save();
        ctx.globalAlpha = Math.max(0, fadeOpacity);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = particle.size * 2;

        // Draw star shape
        const centerX = particle.x;
        const centerY = particle.y;
        const outerRadius = particle.size;
        const innerRadius = particle.size * 0.4;
        const spikes = 5;

        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / spikes;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fill();

        // Add subtle glow effect
        ctx.beginPath();
        ctx.arc(centerX, centerY, particle.size * 1.5, 0, Math.PI * 2);
        ctx.globalAlpha = fadeOpacity * 0.3;
        ctx.fill();

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enableParticles, isVisible]);

  return (
    <div className={`animated-background ${className}`}>
      {/* Background Image with Blur */}
      <div
        className="background-image"
        style={{
          backgroundImage: "url(/bg.jpg)",
          filter: `blur(${blurIntensity}px)`,
        }}
      />

      {/* Overlay for better content readability */}
      <div className="background-overlay" />

      {/* Particle Canvas */}
      {enableParticles && (
        <canvas
          ref={canvasRef}
          className="particle-canvas"
          aria-hidden="true"
        />
      )}

      {/* Fallback for reduced motion */}
      <div className="reduced-motion-fallback">
        {Array.from({ length: 20 }, (_, i) => (
          <Star
            key={i}
            className="static-star"
            size={Math.random() * 8 + 4}
            style={{
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.2,
              color: "white",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
