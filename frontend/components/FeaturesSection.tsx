'use client';

import React, { useEffect, useRef, useState } from 'react';

// Custom single intersection observer hook for checking visibility
function useIntersectionObserver() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return [ref, isVisible] as const;
}

// -------------------------------------------------------------
// Sub-component: Feature 1 Card (Antigravity 2.0 Browser Mockup)
// -------------------------------------------------------------
function Antigravity20Mockup() {
  const [step, setStep] = useState(0); // 0: Idle, 1: AI text typing, 2: Table rendering, 3: Anomaly alert & complete
  const [aiText, setAiText] = useState("");
  const targetText = "Here is the sales summary for May 2026:";

  useEffect(() => {
    let active = true;

    const runCycle = () => {
      if (!active) return;
      setStep(0);
      setAiText("");

      // Step 1: Start typing AI response after 1.5 seconds
      setTimeout(() => {
        if (!active) return;
        setStep(1);

        let index = 0;
        const typeInterval = setInterval(() => {
          if (!active) {
            clearInterval(typeInterval);
            return;
          }
          if (index < targetText.length) {
            setAiText(targetText.slice(0, index + 1));
            index++;
          } else {
            clearInterval(typeInterval);
            // Step 2: Render Table after typing finishes
            setTimeout(() => {
              if (!active) return;
              setStep(2);
            }, 600);
          }
        }, 30);
      }, 1500);

      // Step 3: Complete cycle after 8 seconds (show anomaly alert)
      setTimeout(() => {
        if (!active) return;
        setStep(3);
      }, 8000);
    };

    runCycle();
    const mainLoop = setInterval(runCycle, 12500); // 12.5s loop

    return () => {
      active = false;
      clearInterval(mainLoop);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[480px] mx-auto group font-sans">
      {/* Colorful Gradient Glow Outer border */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 rounded-[22px] blur-xl opacity-15 group-hover:opacity-25 transition-opacity duration-700 -z-10" />
      
      {/* Main card */}
      <div className="relative bg-[#F8F9FC] border border-grey-100 rounded-3xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.02)] select-none h-[340px] flex flex-col justify-between">
        
        {/* Mock Window Header */}
        <div className="flex items-center justify-between border-b border-grey-100 pb-2 mb-2">
          {/* Windows Style Circles */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EA4335]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#34A853]/80" />
          </div>
          <span className="text-[10px] text-grey-800 font-semibold opacity-70 tracking-wider">ANTIGRAVITY CHAT</span>
          <div className="w-6" /> {/* spacer */}
        </div>

        {/* Chat Area */}
        <div className="flex-grow flex flex-col gap-3 overflow-hidden text-xs leading-relaxed justify-start">
          
          {/* User Bubble */}
          <div className="flex justify-end items-start gap-2">
            <div className="bg-grey-20 text-grey-1200 rounded-2xl rounded-tr-sm px-3 py-1.5 max-w-[85%] text-left text-[11px] font-medium shadow-sm">
              Summarize sales by category
            </div>
            <div className="w-6 h-6 rounded-full bg-grey-200 text-grey-800 text-[10px] font-bold flex items-center justify-center border border-grey-100 flex-shrink-0">
              U
            </div>
          </div>

          {/* AI Response Area */}
          <div className="flex justify-start items-start gap-2 text-left">
            {/* Logo Icon */}
            <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100/50 flex items-center justify-center flex-shrink-0 animate-pulse">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-indigo-600">
                <path d="M12 3L3 20H7.5L12 10.5L16.5 20H21L12 3Z" fill="currentColor" />
              </svg>
            </div>

            {/* AI Answer bubble */}
            <div className="flex-grow flex flex-col gap-2">
              {/* Typewriter text */}
              {step >= 1 && (
                <div className="text-[11px] text-grey-1200 font-medium leading-normal">
                  <span>{aiText}</span>
                  {step === 1 && aiText.length < targetText.length && (
                    <span className="inline-block w-[3px] h-[1em] bg-indigo-500 ml-0.5 align-middle animate-pulse" />
                  )}
                </div>
              )}

              {/* Table Data */}
              <div 
                style={{
                  opacity: step >= 2 ? 1 : 0,
                  transform: step >= 2 ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                }}
                className="w-full max-w-[280px]"
              >
                <div className="border border-grey-100 rounded-lg overflow-hidden bg-white text-[10px]">
                  <div className="flex bg-grey-10 border-b border-grey-100 text-grey-800 font-semibold">
                    <div className="w-20 px-2 py-1">Category</div>
                    <div className="flex-1 px-2 py-1 text-right">Sales</div>
                    <div className="w-16 px-2 py-1 text-center">Trend</div>
                  </div>
                  
                  {/* Row 1 */}
                  <div 
                    style={{
                      opacity: step >= 2 ? 1 : 0,
                      transform: step >= 2 ? 'translateY(0)' : 'translateY(8px)',
                      transition: 'opacity 0.4s ease 100ms, transform 0.4s ease 100ms',
                    }}
                    className="flex border-b border-grey-50 text-grey-1200 font-medium"
                  >
                    <div className="w-20 px-2 py-1">Enterprise</div>
                    <div className="flex-1 px-2 py-1 text-right font-mono font-semibold">$45,200</div>
                    <div className="w-16 px-2 py-1 text-center text-emerald-500 font-semibold">+12%</div>
                  </div>

                  {/* Row 2 */}
                  <div 
                    style={{
                      opacity: step >= 2 ? 1 : 0,
                      transform: step >= 2 ? 'translateY(0)' : 'translateY(8px)',
                      transition: 'opacity 0.4s ease 400ms, transform 0.4s ease 400ms',
                    }}
                    className="flex border-b border-grey-50 text-grey-1200 font-medium"
                  >
                    <div className="w-20 px-2 py-1">SaaS</div>
                    <div className="flex-1 px-2 py-1 text-right font-mono font-semibold">$28,800</div>
                    <div className="w-16 px-2 py-1 text-center text-emerald-500 font-semibold">+8%</div>
                  </div>

                  {/* Row 3 */}
                  <div 
                    style={{
                      opacity: step >= 2 ? 1 : 0,
                      transform: step >= 2 ? 'translateY(0)' : 'translateY(8px)',
                      transition: 'opacity 0.4s ease 700ms, transform 0.4s ease 700ms',
                    }}
                    className="flex text-grey-1200 font-medium"
                  >
                    <div className="w-20 px-2 py-1">Developer</div>
                    <div className="flex-1 px-2 py-1 text-right font-mono font-semibold">$15,400</div>
                    <div className="w-16 px-2 py-1 text-center text-red-500 font-semibold">-2%</div>
                  </div>
                </div>
              </div>

              {/* Anomaly Warning Alert */}
              {step >= 3 && (
                <div 
                  style={{
                    opacity: step === 3 ? 1 : 0,
                    transform: step === 3 ? 'translateY(0)' : 'translateY(6px)',
                    transition: 'opacity 0.4s ease, transform 0.4s ease',
                  }}
                  className="bg-[#EA4335]/5 border border-[#EA4335]/15 rounded-lg px-2.5 py-1 text-[9px] text-[#EA4335] font-medium flex items-center gap-1.5 w-full max-w-[280px]"
                >
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#EA4335] animate-pulse" />
                  <span>Growth anomaly detected in Developer segment (-2%)</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Input Bar */}
        <div className="bg-white border border-grey-100 rounded-xl px-3 py-1.5 mt-2 flex items-center justify-between text-[11px] text-grey-800 font-medium shadow-sm">
          <span className="opacity-60">Ask anything about dataset...</span>
          <div className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-60 hover:opacity-100 cursor-pointer"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v4"/></svg>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-indigo-600 opacity-80 hover:opacity-100 cursor-pointer"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </div>
        </div>

      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Sub-component: Feature 2 Card (Antigravity CLI Terminal)
// -------------------------------------------------------------
function AntigravityCLIMockup() {
  const [step, setStep] = useState(0); // 0: Loaded, 1: Running, 2: Compiling, 3: Completed
  const [salesVal, setSalesVal] = useState(0);
  const [totalVal, setTotalVal] = useState(399);

  useEffect(() => {
    let active = true;
    
    const runCycle = () => {
      if (!active) return;
      // Step 0: Initial state
      setStep(0);
      setSalesVal(0);
      setTotalVal(399);

      // Step 1: After 2 seconds, start running cleaning
      setTimeout(() => {
        if (!active) return;
        setStep(1);
        
        // Count up sales from 0 to 240
        let currentSales = 0;
        const countInterval = setInterval(() => {
          if (!active) {
            clearInterval(countInterval);
            return;
          }
          currentSales += 20;
          if (currentSales >= 240) {
            currentSales = 240;
            clearInterval(countInterval);
          }
          setSalesVal(currentSales);
          setTotalVal(399 + currentSales);
        }, 80);
      }, 2000);

      // Step 2: After 5.5 seconds, compile sheet
      setTimeout(() => {
        if (!active) return;
        setStep(2);
      }, 5500);

      // Step 3: After 7.5 seconds, completed
      setTimeout(() => {
        if (!active) return;
        setStep(3);
      }, 7500);
    };

    runCycle();
    const mainLoop = setInterval(runCycle, 11000); // Repeat every 11s

    return () => {
      active = false;
      clearInterval(mainLoop);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[480px] mx-auto">
      {/* Background card with rounded corners */}
      <div className="relative bg-[#121317] border border-grey-900 rounded-2xl p-5 shadow-2xl overflow-hidden h-[340px] flex flex-col justify-between font-mono">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-grey-900 pb-3 mb-2">
          {/* Windows Style close/min/max circles */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EA4335]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#34A853]/80" />
          </div>
          <span className="text-[10px] text-grey-800 font-semibold opacity-70 tracking-wider">TERMINAL - SYNC</span>
          <div className="w-6" /> {/* spacer */}
        </div>

        {/* Content area: Split layout inside terminal */}
        <div className="flex-grow flex gap-4 text-xs text-grey-300 leading-relaxed overflow-hidden">
          
          {/* Left panel: Terminal commands */}
          <div className="w-[45%] border-r border-grey-900/60 pr-3 flex flex-col justify-between h-full font-mono text-[9px] text-grey-400">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>VIZA CLI</span>
              </div>
              
              <div className="flex flex-col gap-1.5 leading-relaxed">
                <div>
                  <span className="text-grey-800">$ </span>
                  <span className="text-grey-300">agy load sales_may.csv</span>
                </div>
                {step >= 0 && (
                  <div className="text-emerald-500 font-semibold pl-2">
                    ✓ Loaded 4 rows
                  </div>
                )}

                {step >= 1 ? (
                  <div>
                    <span className="text-grey-800">$ </span>
                    <span className="text-indigo-400">agy clean B5 --target=status</span>
                    <div className="text-indigo-300/80 pl-2 animate-pulse mt-0.5">
                      ⚙ Cleaning cell B5...
                    </div>
                  </div>
                ) : (
                  <div className="opacity-20">
                    <span className="text-grey-800">$ </span>
                    <span>agy clean B5 --target=status</span>
                  </div>
                )}

                {step >= 2 ? (
                  <div className="mt-1">
                    <span className="text-grey-800">$ </span>
                    <span className="text-grey-300">agy sync --output=report.xlsx</span>
                    <div className="text-emerald-500 font-semibold pl-2 mt-0.5">
                      ✓ Synchronized sheet
                    </div>
                  </div>
                ) : (
                  <div className="opacity-20 mt-1">
                    <span className="text-grey-800">$ </span>
                    <span>agy sync --output=report.xlsx</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-[8px] text-grey-800 border-t border-grey-900/50 pt-1.5 opacity-80 whitespace-nowrap font-sans">
              agy CLI v1.0.4 · Production Build
            </div>
          </div>

          {/* Right panel: Animating Spreadsheet */}
          <div className="w-[55%] pl-1 flex flex-col justify-start h-full">
            {/* Formula Bar */}
            <div className="flex items-center gap-1.5 bg-[#18191D] border border-grey-900 rounded-lg px-2 py-1 mb-2 text-[8px] font-mono text-grey-400">
              <span className="text-indigo-400 font-bold italic">fx</span>
              <span className="text-grey-900 opacity-30">|</span>
              <span className="text-grey-300">
                {step === 0 ? '=SUM(B2:B4)' : step === 1 ? '=CLEAN(B5)' : '=SUM(B2:B5)'}
              </span>
            </div>

            {/* Spreadsheet Table Grid */}
            <div className="w-full border-collapse border border-grey-900/60 text-[9px] bg-[#121317] rounded-lg overflow-hidden flex flex-col">
              {/* Columns Header */}
              <div className="flex border-b border-grey-900/60 bg-[#1A1C20] text-grey-400 font-semibold font-mono">
                <div className="w-6 border-r border-grey-900/60 py-0.5 text-center flex-shrink-0 bg-[#212226] text-[8px]"></div>
                <div className="flex-1 border-r border-grey-900/60 py-0.5 text-center">A</div>
                <div className="flex-1 border-r border-grey-900/60 py-0.5 text-center bg-[#2A2C32]/30">B</div>
                <div className="flex-1 py-0.5 text-center">C</div>
              </div>

              {/* Rows */}
              {/* Row 1 */}
              <div className="flex border-b border-grey-900/60 font-mono text-grey-300">
                <div className="w-6 border-r border-grey-900/60 py-0.5 text-center bg-[#212226] text-grey-400 text-[8px] flex-shrink-0">1</div>
                <div className="flex-1 border-r border-grey-900/60 py-0.5 px-1.5 truncate">101</div>
                <div className="flex-1 border-r border-grey-900/60 py-0.5 px-1.5 text-right font-semibold">120</div>
                <div className="flex-1 py-0.5 px-1.5 text-center text-emerald-500 font-semibold">OK</div>
              </div>

              {/* Row 2 */}
              <div className="flex border-b border-grey-900/60 font-mono text-grey-300">
                <div className="w-6 border-r border-grey-900/60 py-0.5 text-center bg-[#212226] text-grey-400 text-[8px] flex-shrink-0">2</div>
                <div className="flex-1 border-r border-grey-900/60 py-0.5 px-1.5 truncate">102</div>
                <div className="flex-1 border-r border-grey-900/60 py-0.5 px-1.5 text-right font-semibold">185</div>
                <div className="flex-1 py-0.5 px-1.5 text-center text-emerald-500 font-semibold">OK</div>
              </div>

              {/* Row 3 */}
              <div className="flex border-b border-grey-900/60 font-mono text-grey-300">
                <div className="w-6 border-r border-grey-900/60 py-0.5 text-center bg-[#212226] text-grey-400 text-[8px] flex-shrink-0">3</div>
                <div className="flex-1 border-r border-grey-900/60 py-0.5 px-1.5 truncate">103</div>
                <div className="flex-1 border-r border-grey-900/60 py-0.5 px-1.5 text-right font-semibold">94</div>
                <div className="flex-1 py-0.5 px-1.5 text-center text-emerald-500 font-semibold">OK</div>
              </div>

              {/* Row 4 (Selected/Cleaning row) */}
              <div className={`flex border-b border-grey-900/60 font-mono text-grey-300 relative transition-all duration-300 ${
                step === 1 ? 'bg-indigo-500/5' : ''
              }`}>
                <div className="w-6 border-r border-grey-900/60 py-0.5 text-center bg-[#212226] text-grey-400 text-[8px] flex-shrink-0">4</div>
                
                <div className="flex-1 border-r border-grey-900/60 py-0.5 px-1.5 truncate">104</div>
                
                <div className={`flex-1 border-r border-grey-900/60 py-0.5 px-1.5 text-right font-semibold transition-all duration-300 relative ${
                  step === 1 ? 'outline outline-1 outline-indigo-500 outline-offset-[-1px]' : ''
                }`}>
                  {step === 0 ? '-' : salesVal}
                  {/* Selection dot helper */}
                  {step === 1 && (
                    <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-indigo-500 border border-white rounded-sm -translate-x-[1px] translate-y-[1px]" />
                  )}
                </div>
                
                <div className="flex-1 py-0.5 px-1.5 text-center flex items-center justify-center gap-1 text-[8px] font-semibold">
                  {step === 0 && <span className="text-grey-800">QUEUE</span>}
                  {step === 1 && (
                    <span className="text-indigo-400 animate-pulse flex items-center gap-0.5">
                      <span className="inline-block w-1 h-1 rounded-full bg-indigo-400 animate-ping" />
                      CLEANING
                    </span>
                  )}
                  {(step === 2 || step === 3) && <span className="text-emerald-500">OK</span>}
                </div>
              </div>

              {/* Total Row */}
              <div className="flex font-mono text-grey-1200 bg-[#1A1C20] border-t border-grey-900 font-semibold">
                <div className="w-6 border-r border-grey-900/60 py-0.5 text-center bg-[#212226] text-grey-400 text-[8px] flex-shrink-0">5</div>
                <div className="flex-1 border-r border-grey-900/60 py-0.5 px-1.5 uppercase tracking-wide text-grey-400 text-[8px]">Total</div>
                <div className="flex-1 border-r border-grey-900/60 py-0.5 px-1.5 text-right text-indigo-400 font-bold bg-[#2A2C32]/20">
                  {totalVal}
                </div>
                <div className="flex-1 py-0.5 px-1.5 text-center text-grey-800 font-normal">-</div>
              </div>
            </div>
            
            {/* Visual sheet tabs bar for extra realism */}
            <div className="flex items-center gap-1.5 mt-2 text-[8px] text-grey-800 font-medium font-sans">
              <span className="bg-[#18191D] border border-grey-900 text-grey-300 px-1.5 py-0.5 rounded-t-sm border-b-transparent">Sheet1</span>
              <span className="opacity-45 hover:opacity-100 cursor-pointer">MaySales</span>
              <span className="opacity-45 hover:opacity-100 cursor-pointer">+ Add</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Sub-component: Feature 3 Card (Antigravity SDK Indigo Glow)
// -------------------------------------------------------------
function AntigravitySDKMockup() {
  return (
    <div className="relative w-full max-w-[480px] mx-auto">
      {/* Background card with rounded corners and glowing indigo vortex */}
      <div className="relative bg-[#0B0D17] border border-grey-900 rounded-2xl p-8 shadow-2xl h-[340px] flex items-center justify-center overflow-hidden">
        
        {/* Soft Indigo Vortex Glow Background */}
        <div className="absolute w-[240px] h-[240px] bg-indigo-600/35 rounded-full blur-[70px] animate-pulse" />
        
        {/* Second layered glow for depth */}
        <div className="absolute w-[140px] h-[140px] bg-blue-500/20 rounded-full blur-[45px] translate-x-12 -translate-y-8" />
        
        {/* Content: Centered text with sleek blue reflection */}
        <div className="relative z-10 text-center">
          <h3 className="text-2xl md:text-3xl font-medium text-white tracking-wide font-sans filter drop-shadow-[0_0_15px_rgba(96,165,250,0.75)]">
            VIZA SDK
          </h3>
          <p className="text-[10px] text-indigo-300/60 tracking-widest uppercase font-mono mt-2.5">
            py-engine v2.0
          </p>
        </div>

      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Sub-component: Feature 4 Card (Antigravity IDE Code Editor)
// -------------------------------------------------------------
function AntigravityIDEMockup() {
  const [chartProgress, setChartProgress] = useState(0); // 0 to 1

  useEffect(() => {
    let active = true;
    const runAnim = () => {
      if (!active) return;
      setChartProgress(0);
      setTimeout(() => {
        if (!active) return;
        setChartProgress(1);
      }, 500);
    };
    runAnim();
    const interval = setInterval(runAnim, 4000); // loop every 4s
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[480px] mx-auto">
      {/* Background card with rounded corners */}
      <div className="relative bg-[#F0F1F5] border border-grey-100 rounded-2xl p-4 shadow-xl h-[340px] flex flex-col overflow-hidden font-sans">
        
        {/* File Tabs & Header */}
        <div className="flex items-center justify-between border-b border-grey-200/50 pb-2 mb-2 text-[10px] font-semibold text-grey-800">
          <div className="flex gap-2">
            <span className="flex items-center gap-1 opacity-60">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              Implementation plan
            </span>
            <span className="flex items-center gap-1 text-[#4285F4] bg-[#4285F4]/5 border-b border-[#4285F4] pb-2 -mb-2 px-1">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              ChartPreview.tsx
            </span>
          </div>
          <span className="opacity-45">18 lines</span>
        </div>

        {/* Editor Body */}
        <div className="flex-grow flex text-[10px] leading-normal font-mono text-grey-1200 h-full relative">
          
          {/* Sidebar Navigation */}
          <div className="w-[10%] border-r border-grey-200/50 pr-2 flex flex-col gap-2.5 py-1 text-grey-800 opacity-60">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="hover:opacity-100 cursor-pointer"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="hover:opacity-100 cursor-pointer"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <div className="relative">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="hover:opacity-100 cursor-pointer"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span className="absolute -top-1.5 -right-2 bg-indigo-500 text-[6px] text-white px-0.5 rounded-full scale-75">4</span>
            </div>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="hover:opacity-100 cursor-pointer"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </div>

          {/* Right Editor Pane / Chart Preview */}
          <div className="w-[90%] pl-3 flex flex-col gap-1.5 h-full">
            {/* Breadcrumb line */}
            <div className="text-[9px] text-grey-800 opacity-60 pl-0.5 font-mono">
              app &gt; components &gt; ChartPreview.tsx
            </div>

            {/* Split panel: Code on left, Visual Preview on right */}
            <div className="flex-grow flex gap-3 mt-1.5 h-[230px] overflow-hidden">
              {/* Mini Code Panel */}
              <div className="w-[38%] border-r border-grey-200/50 pr-2 flex flex-col font-mono text-[9px] text-grey-400 gap-1.5">
                <div>
                  <span className="text-[#A71D5D]">import</span> <span className="text-grey-1200">agy</span>
                </div>
                <div>
                  <span className="text-[#A71D5D]">const</span> <span className="text-grey-1200">sales</span> = [
                </div>
                <div className="pl-3 text-indigo-500 font-semibold">
                  120, 240, 180
                </div>
                <div>
                  ];
                </div>
                <div className="mt-1">
                  <span className="text-[#A71D5D]">agy</span>.<span className="text-[#0086B3]">plot</span>(sales, &#123;
                </div>
                <div className="pl-3">
                  type: <span className="text-[#183691]">&apos;bar&apos;</span>
                </div>
                <div>
                  &#125;);
                </div>
                <div className="h-4" />
                <div className="text-grey-800 text-[8px] border-t border-grey-200/50 pt-1.5 leading-normal font-sans">
                  Press <kbd className="bg-grey-15 px-1 py-0.5 rounded text-grey-1200 border border-grey-100 shadow-sm font-sans font-semibold">Ctrl+R</kbd> to compile.
                </div>
              </div>

              {/* Chart Preview Panel */}
              <div className="w-[62%] pl-1 flex flex-col justify-between h-full bg-white border border-grey-100 rounded-xl p-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-grey-50 pb-1.5">
                  <span className="text-[9px] font-semibold text-grey-1200">PREVIEW: sales_chart.png</span>
                  <span className="text-[7.5px] px-1 bg-emerald-50 text-emerald-500 rounded font-semibold border border-emerald-100/50">LIVE</span>
                </div>

                {/* Charts Area */}
                <div className="flex-grow flex flex-col justify-center gap-3 pt-1.5">
                  {/* Bar Chart SVG */}
                  <div className="w-full flex justify-center">
                    <svg width="150" height="52" viewBox="0 0 150 52" className="overflow-visible">
                      {/* Grid lines */}
                      <line x1="0" y1="10" x2="140" y2="10" stroke="#EFF2F7" strokeWidth="0.5" strokeDasharray="2,2" />
                      <line x1="0" y1="28" x2="140" y2="28" stroke="#EFF2F7" strokeWidth="0.5" strokeDasharray="2,2" />
                      <line x1="0" y1="46" x2="140" y2="46" stroke="#EFF2F7" strokeWidth="0.5" />

                      {/* Bar 1 */}
                      <rect 
                        x="15" 
                        y={46 - chartProgress * 22} 
                        width="14" 
                        height={chartProgress * 22} 
                        rx="2" 
                        fill="url(#blue-grad)" 
                        className="transition-all duration-500"
                      />
                      {/* Bar 2 */}
                      <rect 
                        x="55" 
                        y={46 - chartProgress * 42} 
                        width="14" 
                        height={chartProgress * 42} 
                        rx="2" 
                        fill="url(#red-grad)" 
                        className="transition-all duration-500"
                      />
                      {/* Bar 3 */}
                      <rect 
                        x="95" 
                        y={46 - chartProgress * 32} 
                        width="14" 
                        height={chartProgress * 32} 
                        rx="2" 
                        fill="url(#yellow-grad)" 
                        className="transition-all duration-500"
                      />

                      {/* Gradients */}
                      <defs>
                        <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4285F4" />
                          <stop offset="100%" stopColor="#4285F4" stopOpacity="0.4" />
                        </linearGradient>
                        <linearGradient id="red-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#EA4335" />
                          <stop offset="100%" stopColor="#EA4335" stopOpacity="0.4" />
                        </linearGradient>
                        <linearGradient id="yellow-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FBBC05" />
                          <stop offset="100%" stopColor="#FBBC05" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Bottom: Donut and Chart Legend */}
                  <div className="flex items-center justify-between px-1">
                    {/* Donut SVG */}
                    <svg width="42" height="42" viewBox="0 0 36 36" className="flex-shrink-0 overflow-visible">
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#EFF2F7" strokeWidth="3" />
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        fill="transparent" 
                        stroke="#4285F4" 
                        strokeWidth="3.5" 
                        strokeDasharray={`${chartProgress * 45} ${100 - chartProgress * 45}`} 
                        strokeDashoffset="0" 
                        transform="rotate(-90 18 18)" 
                      />
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        fill="transparent" 
                        stroke="#EA4335" 
                        strokeWidth="3.5" 
                        strokeDasharray={`${chartProgress * 30} ${100 - chartProgress * 30}`} 
                        strokeDashoffset={-45} 
                        transform="rotate(-90 18 18)" 
                      />
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        fill="transparent" 
                        stroke="#FBBC05" 
                        strokeWidth="3.5" 
                        strokeDasharray={`${chartProgress * 25} ${100 - chartProgress * 25}`} 
                        strokeDashoffset={-75} 
                        transform="rotate(-90 18 18)" 
                      />
                    </svg>

                    {/* Chart Legend */}
                    <div className="flex flex-col gap-1 text-[7.5px] text-grey-800 font-semibold pr-1">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-sm bg-[#4285F4]" />
                        <span>Direct (45%)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-sm bg-[#EA4335]" />
                        <span>Referral (30%)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-sm bg-[#FBBC05]" />
                        <span>Organic (25%)</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Main Exported Component
// -------------------------------------------------------------
interface FeaturesProps {
  onExploreProduct?: () => void;
}

export default function FeaturesSection({ onExploreProduct }: FeaturesProps) {
  // Use intersection observer hook for each of the 4 sections
  const [sec1Ref, sec1Vis] = useIntersectionObserver();
  const [sec2Ref, sec2Vis] = useIntersectionObserver();
  const [sec3Ref, sec3Vis] = useIntersectionObserver();
  const [sec4Ref, sec4Vis] = useIntersectionObserver();

  return (
    <section className="relative w-full overflow-hidden select-none bg-white py-16">
      
      {/* SECTION 1: Antigravity 2.0 */}
      <div 
        ref={sec1Ref}
        className="min-h-[75vh] md:min-h-[85vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-[72px] max-w-[1440px] mx-auto gap-12 md:gap-8 pb-16 md:pb-24 border-b border-grey-50/50"
      >
        {/* Left Side: Text */}
        <div 
          style={{
            transform: sec1Vis ? 'translateY(0)' : 'translateY(35px)',
            opacity: sec1Vis ? 1 : 0,
            transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
          }}
          className="w-full md:w-[45%] flex flex-col justify-center items-start text-left"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tighter text-[#121317] mb-6">
            AI Workspace
          </h2>
          <p className="text-sm md:text-base text-grey-800 leading-relaxed font-sans max-w-md">
            Your intelligent workspace for uploading, analyzing, and chatting with documents. Get instant insights, organize conversations, and streamline your workflow with AI.
          </p>
        </div>

        {/* Right Side: Mockup Card */}
        <div className="w-full md:w-[50%]">
          <Antigravity20Mockup />
        </div>
      </div>

      {/* SECTION 2: Antigravity CLI */}
      <div 
        ref={sec2Ref}
        className="min-h-[75vh] md:min-h-[85vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-[72px] max-w-[1440px] mx-auto gap-12 md:gap-8 py-16 md:py-24 border-b border-grey-50/50"
      >
        {/* Left Side: Text */}
        <div 
          style={{
            transform: sec2Vis ? 'translateY(0)' : 'translateY(35px)',
            opacity: sec2Vis ? 1 : 0,
            transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
          }}
          className="w-full md:w-[45%] flex flex-col justify-center items-start text-left"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tighter text-[#121317] mb-6">
            Smart Document Chat
          </h2>
          <p className="text-sm md:text-base text-grey-800 leading-relaxed font-sans max-w-md">
            Your AI-powered gateway to document understanding. Query PDFs, summarize content, and uncover key information through interactive conversations.
          </p>
        </div>

        {/* Right Side: Mockup Card */}
        <div className="w-full md:w-[50%]">
          <AntigravityCLIMockup />
        </div>
      </div>

      {/* SECTION 3: Antigravity SDK */}
      <div 
        ref={sec3Ref}
        className="min-h-[75vh] md:min-h-[85vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-[72px] max-w-[1440px] mx-auto gap-12 md:gap-8 py-16 md:py-24 border-b border-grey-50/50"
      >
        {/* Left Side: Text */}
        <div 
          style={{
            transform: sec3Vis ? 'translateY(0)' : 'translateY(35px)',
            opacity: sec3Vis ? 1 : 0,
            transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
          }}
          className="w-full md:w-[45%] flex flex-col justify-center items-start text-left"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tighter text-[#121317] mb-6">
            VIZA SDK
          </h2>
          <p className="text-sm md:text-base text-grey-800 leading-relaxed font-sans max-w-md">
            Prototype custom agents leveraging VIZA&apos;s harness with minimal code. Simple Python scripts to iterate on agentic applications, automate software engineering tasks, and run evaluations on top of the VIZA agent harness.
          </p>
        </div>

        {/* Right Side: Mockup Card */}
        <div className="w-full md:w-[50%]">
          <AntigravitySDKMockup />
        </div>
      </div>

      {/* SECTION 4: Antigravity IDE */}
      <div 
        ref={sec4Ref}
        className="min-h-[75vh] md:min-h-[85vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-[72px] max-w-[1440px] mx-auto gap-12 md:gap-8 pt-16 md:pt-24"
      >
        {/* Left Side: Text */}
        <div 
          style={{
            transform: sec4Vis ? 'translateY(0)' : 'translateY(35px)',
            opacity: sec4Vis ? 1 : 0,
            transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
          }}
          className="w-full md:w-[45%] flex flex-col justify-center items-start text-left"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tighter text-[#121317] mb-6">
            VIZA IDE
          </h2>
          <p className="text-sm md:text-base text-grey-800 leading-relaxed font-sans max-w-md mb-8">
            The fully-featured, agentic IDE. Complete with the agent manager, artifacts, and a deep understanding of your codebase.
          </p>
          <button
            onClick={onExploreProduct}
            className="btn-curvy-fill border border-[#121317] text-[#121317] font-medium px-6 py-2.5 rounded-full text-xs cursor-pointer shadow-sm"
          >
            <span className="relative z-10">Explore Product</span>
          </button>
        </div>

        {/* Right Side: Mockup Card */}
        <div className="w-full md:w-[50%]">
          <AntigravityIDEMockup />
        </div>
      </div>

    </section>
  );
}
