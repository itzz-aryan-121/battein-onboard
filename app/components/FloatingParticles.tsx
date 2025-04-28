// components/FloatingParticles.tsx
'use client'

import { useEffect, useRef } from 'react';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  speed?: number;
  size?: number;
  opacity?: number;
}

export default function FloatingParticles({
  count = 50,
  color = '#F5BC1C',
  speed = 2,
  size = 5,
  opacity = 0.7
}: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Make canvas full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      constructor() {
        this.x = Math.random() * (canvas?.width ?? window.innerWidth);
        this.y = Math.random() * (canvas?.height ?? window.innerHeight);
        this.size = Math.random() * size + 1;
        this.speedX = (Math.random() * speed) - (speed / 2);
        this.speedY = (Math.random() * speed) - (speed / 2);
        this.color = color;
        this.opacity = Math.random() * opacity;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // Bounce off edges
        if (this.x > (canvas?.width ?? window.innerWidth) || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > (canvas?.height ?? window.innerHeight) || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + Math.floor(this.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      }
    }

    // Create particles
    const particlesArray: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particlesArray.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [count, color, speed, size, opacity]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}