'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="relative w-full bg-white pt-16 pb-8 px-6 md:px-12 lg:px-[72px] max-w-[1440px] mx-auto select-none overflow-hidden">
      
      {/* Top Row: Links and Branding */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-6 border-t border-grey-100/50 pt-12 mb-16">
        
        {/* Left Column: Heading */}
        <div className="md:w-1/3">
          <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-grey-1200">
            Experience liftoff
          </h3>
        </div>

        {/* Right Columns: Links */}
        <div className="flex gap-16 sm:gap-24 md:w-2/3 justify-start md:justify-end">
          {/* Column 1 */}
          <div className="flex flex-col gap-3.5 text-xs text-grey-800 font-medium">
            <span className="hover:text-grey-1200 cursor-pointer transition-colors">Download</span>
            <span className="hover:text-grey-1200 cursor-pointer transition-colors">Product</span>
            <span className="hover:text-grey-1200 cursor-pointer transition-colors">Docs</span>
            <span className="hover:text-grey-1200 cursor-pointer transition-colors">Changelog</span>
            <span className="hover:text-grey-1200 cursor-pointer transition-colors">Press</span>
            <span className="hover:text-grey-1200 cursor-pointer transition-colors">Releases</span>
          </div>
          
          {/* Column 2 */}
          <div className="flex flex-col gap-3.5 text-xs text-grey-800 font-medium">
            <span className="hover:text-grey-1200 cursor-pointer transition-colors">Blog</span>
            <span className="hover:text-grey-1200 cursor-pointer transition-colors">Pricing</span>
            <span className="hover:text-grey-1200 cursor-pointer transition-colors">Use Cases</span>
          </div>
        </div>

      </div>

      {/* Middle Row: Massive "Antigravity" signature */}
      <div className="w-full flex justify-center mb-12">
        <h1 
          className="text-[12vw] sm:text-[10vw] md:text-[8.5vw] font-bold text-grey-1200/90 tracking-tighter leading-none select-none text-center"
        >
          VIZA FOR YOU
        </h1>
      </div>

      {/* Bottom Row: Google logo and policy links */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-grey-50 pt-8 text-[11px] text-grey-800 font-medium">
        
        {/* Left: Google signature */}
        <div className="flex items-center gap-1.5 opacity-80">
          <span className="font-semibold text-grey-1200 tracking-tight text-sm">Viza</span>
        </div>

        {/* Right: Policies */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 opacity-80">
          <span className="hover:text-grey-1200 cursor-pointer transition-colors">About Viza</span>
          <span className="hover:text-grey-1200 cursor-pointer transition-colors">Viza Products</span>
          <span className="hover:text-grey-1200 cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-grey-1200 cursor-pointer transition-colors">Terms</span>
        </div>

      </div>

    </footer>
  );
}
