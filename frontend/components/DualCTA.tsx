'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
// Custom SVGs for background dot patterns to look exactly like keyframes
const ScatteredDots = () => {
  // Generate random coords for dots
  const dots = [
    { x: 10, y: 15, r: 1.5, o: 0.25 },
    { x: 25, y: 35, r: 1.0, o: 0.15 },
    { x: 45, y: 12, r: 2.0, o: 0.35 },
    { x: 75, y: 22, r: 1.2, o: 0.20 },
    { x: 88, y: 48, r: 1.5, o: 0.30 },
    { x: 15, y: 68, r: 1.0, o: 0.12 },
    { x: 38, y: 82, r: 2.0, o: 0.40 },
    { x: 62, y: 60, r: 1.5, o: 0.25 },
    { x: 92, y: 85, r: 1.2, o: 0.18 },
    { x: 52, y: 45, r: 1.0, o: 0.15 },
    { x: 80, y: 72, r: 1.8, o: 0.28 },
    { x: 5,  y: 50, r: 1.5, o: 0.22 },
  ];
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
      {dots.map((dot, idx) => (
        <circle 
          key={idx} 
          cx={`${dot.x}%`} 
          cy={`${dot.y}%`} 
          r={dot.r} 
          fill="#121317" 
          opacity={dot.o}
          className="transition-all duration-700 hover:scale-150"
        />
      ))}
    </svg>
  );
};

const RingDots = () => {
  // Concentric circle orbits of dots
  const rings = [35, 60, 85];
  const dotsPerRing = [12, 18, 24];
  
  return (
    <svg className="absolute -right-20 -bottom-20 w-80 h-80 pointer-events-none opacity-40 animate-[spin_100s_linear_infinite]" viewBox="0 0 200 200">
      {rings.map((r, ringIdx) => {
        const count = dotsPerRing[ringIdx];
        const dots = [];
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const x = 100 + r * Math.cos(angle);
          const y = 100 + r * Math.sin(angle);
          dots.push({ x, y });
        }
        return (
          <g key={ringIdx}>
            <circle cx="100" cy="100" r={r} stroke="#121317" strokeWidth="0.5" strokeDasharray="3,6" fill="none" opacity="0.08" />
            {dots.map((d, dIdx) => (
              <circle key={dIdx} cx={d.x} cy={d.y} r="1.5" fill="#4285F4" opacity="0.35" />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

export default function DualCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
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
    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-white py-16 px-6 md:px-12 lg:px-[72px] max-w-[1440px] mx-auto select-none overflow-hidden border-b border-grey-50/50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Card: For developers */}
        <div className="relative bg-[#F8F9FC] border border-grey-100 rounded-[32px] p-8 md:p-12 flex flex-col justify-between items-start min-h-[320px] md:min-h-[380px] group overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <ScatteredDots />
          
          <div 
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(25px)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
            }}
            className="relative z-10 text-left"
          >
            <span className="text-xs text-grey-800 font-sans tracking-wide mb-3 block opacity-75">
              Available at no charge
            </span>
            <h3 className="text-3xl sm:text-4xl md:text-[44px] font-medium tracking-tighter text-[#121317] leading-tight max-w-md">
              For Curious Minds. Discover Knowledge Faster.
            </h3>
          </div>
          
          <button onClick={()=>router.push('/signin')} className="relative z-10 bg-[#121317] hover:bg-grey-900 text-white font-medium px-6 py-3 rounded-full text-sm transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02]">
            explore
          </button>
        </div>

        {/* Right Card: For organizations */}
        <div className="relative bg-[#F8F9FC] border border-grey-100 rounded-[32px] p-8 md:p-12 flex flex-col justify-between items-start min-h-[320px] md:min-h-[380px] group overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <RingDots />
          
          <div 
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(25px)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 100ms, opacity 0.8s ease 100ms',
            }}
            className="relative z-10 text-left"
          >
            <span className="text-xs text-grey-800 font-sans tracking-wide mb-3 block opacity-75">
              Now Available!
            </span>
            <h3 className="text-3xl sm:text-4xl md:text-[44px] font-medium tracking-tighter text-[#121317] leading-tight max-w-md">
              For Teams. Find Answers Faster, Together.
            </h3>
          </div>
          
          <button onClick={() => router.push('/signin')} className="btn-curvy-fill relative z-10 border border-grey-200 font-medium px-6 py-3 rounded-full text-sm cursor-pointer shadow-sm hover:scale-[1.02]">
            <span className="relative z-10">Get Started</span>
          </button>
        </div>

      </div>
    </section>
  );
}
