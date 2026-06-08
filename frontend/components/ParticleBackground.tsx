'use client';

import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates tracking
    let mouse = { x: -1000, y: -1000, active: false };

    // Google color palette base strings (RGB format to append alpha channel)
    const colors = [
      'rgba(66, 133, 244, ',  // Google Blue
      'rgba(234, 67, 53, ',  // Google Red
      'rgba(251, 188, 5, ',  // Google Yellow
      'rgba(52, 168, 83, ',   // Google Green
    ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      px: number;
      py: number;
      color: string;
      alpha: number;
      size: number;
      speedModifier: number;
    }

    const particles: Particle[] = [];
    const particleCount = 1200; // Optimal density

    // Vortex center (slightly offset to the left as seen on antigravity.google)
    let centerX = width * 0.35;
    let centerY = height * 0.5;

    const initParticle = (p: Partial<Particle> = {}): Particle => {
      const angle = Math.random() * Math.PI * 2;
      // Distribute particles in a wide cloud centered around centerX, centerY
      const r = 100 + Math.random() * Math.max(width, height) * 0.8;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        px: x,
        py: y,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.15 + Math.random() * 0.5, // Subtle variance in opacity
        size: 1.0 + Math.random() * 1.5,   // Dash stroke width
        speedModifier: 0.6 + Math.random() * 0.8,
        ...p,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(initParticle());
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      centerX = width * 0.35;
      centerY = height * 0.5;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      // Clear with full transparency (we rely on CSS background of body/canvas to be white)
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.px = p.x;
        p.py = p.y;

        // Calculate vector from vortex center
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Circular flow angle with a slight outward spiral (angle + Math.PI/2 + epsilon)
        const flowAngle = Math.atan2(dy, dx) + Math.PI / 2 + 0.08;
        
        // Base target speeds: particles move slightly faster when further away
        const baseSpeed = p.speedModifier * (1.2 + Math.min(dist / 400, 1.5));
        const targetVx = Math.cos(flowAngle) * baseSpeed;
        const targetVy = Math.sin(flowAngle) * baseSpeed;

        // Smoothly interpolate current velocity towards flow field velocity
        p.vx += (targetVx - p.vx) * 0.02;
        p.vy += (targetVy - p.vy) * 0.02;

        // Interaction with mouse cursor
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < 180) {
            const force = (180 - mdist) / 180;
            
            // Antigravity (repulsion) force - pushes particles away from pointer
            p.vx += (mdx / mdist) * force * 2.0;
            p.vy += (mdy / mdist) * force * 2.0;

            // Swirl force around pointer - adds orbital motion relative to cursor
            p.vx += (-mdy / mdist) * force * 1.2;
            p.vy += (mdx / mdist) * force * 1.2;
          }
        }

        // Add soft random Brownian motion for natural organic drift
        p.vx += (Math.random() - 0.5) * 0.1;
        p.vy += (Math.random() - 0.5) * 0.1;

        // Cap maximum speed to maintain visual clarity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = mouse.active ? 6.0 : 3.5;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        // Apply velocity to move particle
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen or reset position if drifted too far
        if (
          p.x < -100 ||
          p.x > width + 100 ||
          p.y < -100 ||
          p.y > height + 100
        ) {
          const angle = Math.random() * Math.PI * 2;
          const r = 200 + Math.random() * Math.max(width, height) * 0.6;
          p.x = centerX + Math.cos(angle) * r;
          p.y = centerY + Math.sin(angle) * r;
          p.px = p.x;
          p.py = p.y;
          p.vx = (Math.random() - 0.5) * 0.5;
          p.vy = (Math.random() - 0.5) * 0.5;
        }

        // Draw particle as a speed-aligned dash (motion blur effect)
        ctx.beginPath();
        ctx.strokeStyle = `${p.color}${p.alpha})`;
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';
        
        // Calculate displacement vector
        const dx_move = p.x - p.px;
        const dy_move = p.y - p.py;
        const moveDist = Math.sqrt(dx_move * dx_move + dy_move * dy_move);
        
        // Draw a line connecting the previous position and current position
        if (moveDist < 1) {
          // If stationary or moving very slowly, draw a tiny segment
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + 1, p.y + 1);
        } else {
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 bg-[#FFFFFF] pointer-events-none"
    />
  );
}
