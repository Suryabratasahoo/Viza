'use client';

import React, { useEffect, useRef, useState } from 'react';

// Custom lightweight SVG Icons for the arched menu
const iconsData = [
  // 1. Document
  // eslint-disable-next-line react/jsx-key
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  // 2. Node Connection
  // eslint-disable-next-line react/jsx-key
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  // 3. Lambda / Agent User
  // eslint-disable-next-line react/jsx-key
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><polyline points="8 2 12 6 16 2"/></svg>,
  // 4. Folder
  // eslint-disable-next-line react/jsx-key
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  // 5. Refresh
  // eslint-disable-next-line react/jsx-key
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  // 6. Spark
  // eslint-disable-next-line react/jsx-key
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  // 7. Code Block
  // eslint-disable-next-line react/jsx-key
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  // 8. Terminal
  // eslint-disable-next-line react/jsx-key
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  // 9. Command Key
  // eslint-disable-next-line react/jsx-key
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM9 9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0v-6a2 2 0 0 0-2-2z"/></svg>,
];


// Highlight colors for hover (Google themed)
const glowColors = [
  'rgba(66, 133, 244, 0.4)',  // Blue
  'rgba(234, 67, 53, 0.4)',   // Red
  'rgba(251, 188, 5, 0.4)',   // Yellow
  'rgba(52, 168, 83, 0.4)',   // Green
];

export default function Hero({ onScrollNext }: { onScrollNext: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [isFlowing, setIsFlowing] = useState(false);
  const [progress, setProgress] = useState(0);

  const isFlowingRef = useRef(false);

  const fullText = "Your passport to instant data visibility.";
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    isFlowingRef.current = isFlowing;
  }, [isFlowing]);

  useEffect(() => {
    // Stagger animation trigger
    const timer = setTimeout(() => setMounted(true), 100);
    // Start flow animation after entrance completes (1.5 seconds)
    const flowTimer = setTimeout(() => setIsFlowing(true), 1500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(flowTimer);
    };
  }, []);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const update = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (isFlowingRef.current) {
        setProgress((prev) => (prev + delta * 0.00003) % 1.4); // very smooth movement around track length 1.4
      }

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    let index = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayedText("");
    setIsTyping(true);

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsTyping(false), 1500);
      }
    }, 35);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[82vh] flex flex-col items-center justify-between pt-[48px] pb-8 px-6 max-w-[1440px] mx-auto text-center overflow-hidden select-none">
      
      {/* Top portion containing fanning arched menu */}
      <div 
        className="relative w-full max-w-[1100px] h-[160px] md:h-[220px] mt-4 md:mt-8 flex items-center justify-center"
      >
        {iconsData.map((icon, index) => {
          const total = iconsData.length;
          const trackLength = 1.4; // Reduced track length to decrease spacing between circles
          const visibleStart = 0.2;
          const visibleEnd = 1.2;
          
          // Calculate coordinate along path t
          // If flowing, offset by progress. If entrance, use even distribution across visible range.
          const t = isFlowing 
            ? (index / total * trackLength + progress) % trackLength 
            : visibleStart + (index / (total - 1)) * (visibleEnd - visibleStart);
          
          // Map visible range [visibleStart, visibleEnd] to [-1, 1] for x coordinate
          const x = (t - 0.7) * 2; 
          
          // Responsive horizontal/vertical curve offsets
          const xOffset = x * 46; // horizontal percentage spread
          const yOffset = Math.pow(x, 2) * 58; // vertical arch depth in pixels
          const rotation = x * 22; // rotation angle in degrees

          // Calculate boundary opacity to seamlessly fade out at edges
          let boundaryOpacity = 1;
          const fadeRange = 0.15; // fade in/out over 0.15 of the track
          
          if (t < visibleStart || t > visibleEnd) {
            boundaryOpacity = 0;
          } else if (t < visibleStart + fadeRange) {
            boundaryOpacity = (t - visibleStart) / fadeRange;
          } else if (t > visibleEnd - fadeRange) {
            boundaryOpacity = (visibleEnd - t) / fadeRange;
          }

          const finalOpacity = mounted ? boundaryOpacity : 0;
          const transitionStyle = isFlowing
            ? 'opacity 0.4s ease'
            : `transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${index * 45}ms, opacity 0.8s ease ${index * 30}ms`;

          return (
            <div
              key={index}
              style={{
                left: `calc(50% + ${xOffset}%)`,
                transform: mounted 
                  ? `translate(-50%, ${yOffset}px) rotate(${rotation}deg) scale(1)`
                  : `translate(-50%, 150px) rotate(0deg) scale(0)`,
                opacity: finalOpacity,
                transition: transitionStyle,
              }}
              className="absolute w-11 h-11 md:w-14 md:h-14 bg-white/90 border border-grey-100 rounded-full flex items-center justify-center text-grey-800 shadow-[0_3px_10px_rgba(0,0,0,0.04)] select-none"
            >
              <div className="transform transition-transform duration-200">
                {icon}
              </div>
            </div>
          );
        })}
      </div>

      {/* Center portion containing title text */}
      <div className="relative z-10 max-w-4xl mx-auto flex-grow flex flex-col items-center justify-center my-4 md:my-6">
        <h1 className="text-[38px] sm:text-[48px] md:text-[62px] lg:text-[76px] xl:text-[88px] leading-[1.08] text-[#121317] tracking-tighter max-w-[90vw] md:max-w-[80vw] lg:max-w-5xl select-text transition-all duration-1000 ease-out">
          <span>{displayedText}</span>
          {isTyping && (
            <span className="inline-block w-[4px] h-[0.8em] bg-[#121317] ml-2 align-middle animate-pulse" />
          )}
          <span className="opacity-0 select-none pointer-events-none">
            {fullText.slice(displayedText.length)}
          </span>
        </h1>
      </div>

      {/* Bottom portion containing scroll indicator */}
      <div 
        className="cursor-pointer hover:opacity-100 transition-opacity flex flex-col items-center gap-2 group pb-2"
        onClick={onScrollNext}
      >
        <div className="w-[30px] h-[48px] border-2 border-[#121317]/20 rounded-full flex justify-center p-1.5 transition-colors group-hover:border-[#121317]/40">
          <div className="w-1.5 h-1.5 bg-[#121317] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
