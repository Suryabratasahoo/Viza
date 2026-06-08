'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DownloadCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    const currentRef = cardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    interface Star {
      r: number; // orbital radius
      angle: number;
      speed: number;
      size: number;
      alpha: number;
      color: string;
    }

    const stars: Star[] = [];
    const count = 180;

    // Vortex center: offset to the right side of the card
    let centerX = width * 0.7;
    let centerY = height * 0.5;

    for (let i = 0; i < count; i++) {
      const isBlue = Math.random() > 0.45;
      stars.push({
        r: 30 + Math.random() * Math.max(width, height) * 0.6,
        angle: Math.random() * Math.PI * 2,
        speed: 0.0015 + Math.random() * 0.003,
        size: 0.8 + Math.random() * 1.2,
        alpha: 0.15 + Math.random() * 0.6,
        color: isBlue ? '147, 197, 253' : '255, 255, 255', // blue/white
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      centerX = width * 0.7;
      centerY = height * 0.5;
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw vortex
      stars.forEach((star) => {
        star.angle += star.speed;
        const x = centerX + Math.cos(star.angle) * star.r;
        const y = centerY + Math.sin(star.angle) * star.r;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${star.color}, ${star.alpha})`;
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <section ref={cardRef} className="relative w-full bg-white py-16 px-6 md:px-12 lg:px-[72px] max-w-[1440px] mx-auto select-none overflow-hidden">
      
      {/* Large black container */}
      <div className="relative bg-black rounded-[36px] px-8 py-14 md:px-16 md:py-20 text-white min-h-[340px] md:min-h-[400px] flex flex-col justify-between items-start group overflow-hidden shadow-2xl">
        
        {/* Vortex Canvas Background */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full pointer-events-none z-0" 
        />
        
        {/* Text Details */}
        <div 
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(35px)',
            opacity: isVisible ? 1 : 0,
            transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
          }}
          className="relative z-10 max-w-xl text-left"
        >
          <h2 className="text-4xl sm:text-5xl md:text-[56px] leading-[1.05] font-medium tracking-tighter mb-8">
            Start Chatting With Your Documents
          </h2>
        </div>

        {/* Buttons Row */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button onClick={() => router.push('/signup')} className="btn-curvy-fill font-semibold px-6 py-3 rounded-full text-xs md:text-sm cursor-pointer shadow-md hover:scale-[1.02] flex items-center justify-center gap-1.5">
            <span >Get Started</span>
          </button>
          <button onClick={() => router.push('/signin')} className="bg-grey-1000 hover:bg-grey-900 text-white border border-grey-800 font-semibold px-6 py-3 rounded-full text-xs md:text-sm transition-all duration-200 cursor-pointer shadow-md hover:scale-[1.02] flex items-center justify-center gap-1.5">
            Begin Your Analysis
          </button>
        </div>

      </div>
    </section>
  );
}
