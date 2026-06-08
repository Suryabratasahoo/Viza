'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getChatSessions } from '@/services/ChatSession.service';

// --- Custom SVGs for UI Icons ---

const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="w-5.5 h-5.5 flex-shrink-0 animate-pulse">
    <path d="M12 3L3 20H7.5L12 10.5L16.5 20H21L12 3Z" fill="url(#sidebar-comp-grad)" />
    <path d="M10 14H14L12 10L10 14Z" fill="#FFFFFF" opacity="0.8" />
    <defs>
      <linearGradient id="sidebar-comp-grad" x1="3" y1="3" x2="21" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="35%" stopColor="#EA4335" />
        <stop offset="70%" stopColor="#FBBC05" />
        <stop offset="100%" stopColor="#34A853" />
      </linearGradient>
    </defs>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 text-grey-800">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);


interface ChatSession {
  session_id: string;
  dataset_id: string;
  title: string;
  created_at: string;
}
interface SidebarProps {
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
  onOpenSettings?: () => void;
  hideHistory?: boolean;
  sessions?: ChatSession[];
}

export default function Sidebar({
  sessions = [],
  isSidebarOpen,
  onCloseSidebar,
  onOpenSettings,
  hideHistory = false
}: SidebarProps) {
  const router = useRouter();
  const [searchHistory, setSearchHistory] =
    useState("");


  const handleSelectHistorySession =
    (session: ChatSession) => {
      
        // If we are on another route, redirect to dashboard and load the session
        router.push(
          `/chat/${session.session_id}`
        );
      
      onCloseSidebar();
    };

  const handleNewAnalysisClick = () => {
    router.push('/upload');
    onCloseSidebar();
  };

  const handleSignOut = (e: React.MouseEvent) => {
  e.preventDefault();

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  router.push("/");
};

  const filteredHistory =
    sessions.filter(
      (session) =>
        session.title
          .toLowerCase()
          .includes(
            searchHistory
              .toLowerCase()
          )
    );

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-[#F8F9FC]/95 backdrop-blur-md border-r border-grey-100 flex flex-col justify-between p-5 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Top brand */}
        <div className="flex flex-col gap-5 text-left">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <LogoIcon />
              <span className="text-sm font-semibold tracking-tight text-grey-1200 flex items-center gap-1 font-sans">
                <span className="opacity-60 font-normal"></span> Viza
              </span>
            </Link>
            <button
              onClick={onCloseSidebar}
              className="md:hidden text-grey-800 hover:text-grey-1200 p-1 hover:bg-grey-50 rounded-lg cursor-pointer"
            >
              <CloseIcon />
            </button>
          </div>

          {/* New Analysis Trigger */}
          <button
            onClick={handleNewAnalysisClick}
            className="w-full bg-[#121317] hover:bg-grey-900 text-white font-semibold py-2.5 px-4 rounded-full text-xs transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <PlusIcon />
            <span>New Analysis</span>
          </button>

          {/* History Section */}
          {!hideHistory && (
            <div className="flex flex-col gap-2 mt-4">
              <span className="text-[9px] font-bold text-grey-800 uppercase tracking-widest ml-1">
                History
              </span>
              <div className="relative w-full mb-1">
                <input
                  type="text"
                  placeholder="Search history..."
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  className="w-full bg-white border border-grey-100/70 rounded-full pl-8 pr-3 py-1.5 text-[10px] text-grey-1200 placeholder-grey-300 focus:outline-none focus:border-grey-1200 transition-colors"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <SearchIcon />
                </div>
              </div>

              <div className="flex flex-col gap-1 max-h-[45vh] overflow-y-auto">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((session) => (
                    <button
                      key={session.session_id}
                      onClick={() => handleSelectHistorySession(session)}
                      className="w-full flex items-center gap-2.5 text-left text-xs font-semibold py-2 px-3 rounded-xl hover:bg-grey-50 text-grey-800 hover:text-grey-1200 cursor-pointer transition-all duration-150"
                    >
                      <ClockIcon />
                      <span className="truncate">{session.title}</span>
                    </button>
                  ))
                ) : (
                  <span className="text-[10px] text-grey-800/60 font-medium italic p-2">
                    No sessions found
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Sidebar settings */}
        <div className="flex flex-col gap-1 border-t border-grey-100/60 pt-4">
          <button
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              onCloseSidebar();
            }}
            className="w-full flex items-center gap-2.5 text-left text-xs font-semibold py-2.5 px-3 rounded-xl hover:bg-grey-50 text-grey-800 hover:text-grey-1200 cursor-pointer transition-colors"
          >
            <SettingsIcon />
            <span>Settings</span>
          </button>
          <a
            href="#"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 text-left text-xs font-semibold py-2.5 px-3 rounded-xl hover:bg-red-50 text-grey-800 hover:text-red-600 cursor-pointer transition-colors"
          >
            <LogOutIcon />
            <span>Sign Out</span>
          </a>
        </div>
      </aside>

      {/* Sidebar background overlay on mobile */}
      {isSidebarOpen && (
        <div
          onClick={onCloseSidebar}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-xs md:hidden"
        />
      )}
    </>
  );
}
