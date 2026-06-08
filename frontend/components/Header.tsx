'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const AntigravityLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 flex-shrink-0 animate-pulse">
    <path d="M12 3L3 20H7.5L12 10.5L16.5 20H21L12 3Z" fill="url(#antigravity-grad)" />
    <path d="M10 14H14L12 10L10 14Z" fill="#FFFFFF" opacity="0.8" />
    <defs>
      <linearGradient id="antigravity-grad" x1="3" y1="3" x2="21" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="35%" stopColor="#EA4335" />
        <stop offset="70%" stopColor="#FBBC05" />
        <stop offset="100%" stopColor="#34A853" />
      </linearGradient>
    </defs>
  </svg>
);

const ExploreIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

interface HeaderProps {
  onScrollToSection?: (sectionId: string) => void;
}

export default function Header({ onScrollToSection }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (sectionId: string) => {
    if (pathname === '/' && onScrollToSection) {
      onScrollToSection(sectionId);
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[52px] z-50 flex items-center justify-between px-6 md:px-12 lg:px-[72px] bg-white/60 backdrop-blur-md border-b border-grey-100/10 transition-all duration-300">
      {/* Left: Brand Logo & Text */}
      <div 
        className="flex items-center gap-2.5 cursor-pointer group"
        onClick={() => handleNavClick('hero')}
      >
        <AntigravityLogo />
        <span className="text-sm font-medium tracking-tight text-grey-1200 font-sans flex items-center gap-1">
          <span className="opacity-60 font-normal"></span> VIZA
        </span>
      </div>

      {/* Center: Nav Menus */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-grey-800">
        <div 
          className="group flex items-center gap-1 cursor-pointer hover:text-grey-1200 transition-colors"
          onClick={() => handleNavClick('features')}
        >
          <span>About</span>
          
        </div>
        <div 
          className="group flex items-center gap-1 cursor-pointer hover:text-grey-1200 transition-colors"
          onClick={() => handleNavClick('developers')}
        >
          <span>Use Cases</span>
          
        </div>
        <span 
          className="cursor-pointer hover:text-grey-1200 transition-colors"
          onClick={() => handleNavClick('blogs')}
        >
          Features
        </span>
        <span 
          className="cursor-pointer hover:text-grey-1200 transition-colors"
          onClick={() => handleNavClick('cta')}
        >
          explore
        </span>
        <div 
          className="group flex items-center gap-1 cursor-pointer hover:text-grey-1200 transition-colors"
          onClick={() => handleNavClick('download')}
        >
          <span>Start Working</span>
          
        </div>
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {pathname !== '/signin' && pathname !== '/signup' && (
          <Link 
            href="/signin" 
            className="text-xs font-semibold text-grey-800 hover:text-grey-1200 transition-colors cursor-pointer"
          >
            Sign In
          </Link>
        )}
        {pathname === '/signin' && (
          <Link 
            href="/signup" 
            className="text-xs font-semibold text-grey-800 hover:text-grey-1200 transition-colors cursor-pointer"
          >
            Create Account
          </Link>
        )}
        {pathname === '/signup' && (
          <Link 
            href="/signin" 
            className="text-xs font-semibold text-grey-800 hover:text-grey-1200 transition-colors cursor-pointer"
          >
            Sign In
          </Link>
        )}

        <button 
          onClick={() => handleNavClick('download')}
          className="bg-[#121317] hover:bg-grey-900 text-white font-medium px-4 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer shadow-sm flex items-center gap-1.5 hover:scale-[1.02]"
        >
          <span>explore</span>
          <ExploreIcon />
        </button>
      </div>
    </header>
  );
}
