'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { deleteChatSession, getChatSession } from "@/services/ChatSession.service"
import { useSessions } from '@/hooks/useSessions';
import ChartRenderer from '@/components/charts/ChartRenderer';
import MiniChart from '@/components/charts/MiniChart';
import { updateProfile } from '@/services/auth.service';


// --- Custom SVGs for UI Icons ---

const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="w-5.5 h-5.5 flex-shrink-0 animate-pulse">
    <path d="M12 3L3 20H7.5L12 10.5L16.5 20H21L12 3Z" fill="url(#dashboard-grad)" />
    <path d="M10 14H14L12 10L10 14Z" fill="#FFFFFF" opacity="0.8" />
    <defs>
      <linearGradient id="dashboard-grad" x1="3" y1="3" x2="21" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="35%" stopColor="#EA4335" />
        <stop offset="70%" stopColor="#FBBC05" />
        <stop offset="100%" stopColor="#34A853" />
      </linearGradient>
    </defs>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
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

const DatabaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.32 11.32l.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
  </svg>
);

const TerminalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const ChartPieIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
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

const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-grey-300">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const SparkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-blue-500 fill-blue-500">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

// --- Session Interface & Preset Data ---

interface AnalysisSession {
  id: string;
  title: string;
  description: string;
  queries: {
    question: string;
    answer: string;
    chartType: 'line' | 'bar' | 'donut';
  }[];
}

const recentAnalysesPreset: AnalysisSession[] = [
  {
    id: 'revenue-analysis',
    title: 'Revenue Analysis',
    description: 'Q1 sales growth, subscription metrics, and projection projections.',
    queries: [
      {
        question: 'Show monthly revenue growth for Q1 2026.',
        answer: 'Monthly Recurring Revenue (MRR) grew consistently from $120k in January to $148k in March, representing a 23.3% net growth over the quarter, primarily driven by enterprise upgrades.',
        chartType: 'line',
      },
      {
        question: 'Compare sales performance across categories.',
        answer: 'Core SaaS products accounted for $310k in total sales, custom integrations generated $64k, and professional services added $28k in revenue.',
        chartType: 'bar',
      }
    ]
  },
  {
    id: 'customer-segmentation',
    title: 'Customer Segmentation',
    description: 'Churn risk profiles, user cohort breakdown, and demographic segments.',
    queries: [
      {
        question: 'What is the breakdown of our active user base?',
        answer: 'The platform user segments are distributed as: Developer Tier (54%), Team Tier (28%), Enterprise Custom (12%), and Free Trial (6%).',
        chartType: 'donut',
      },
      {
        question: 'Show churn rate by customer tier.',
        answer: 'Free Trial segment exhibits the highest churn at 14.2%, Developer Tier sits at 4.1%, while Team and Enterprise segments have sub-1% churn rates.',
        chartType: 'bar',
      }
    ]
  },
  {
    id: 'product-performance',
    title: 'Product Performance',
    description: 'Feature usage patterns, monthly active users (MAU), and engagement.',
    queries: [
      {
        question: 'Which product features have the highest adoption rate?',
        answer: 'Natural Language Queries lead feature adoption with 92% of active teams using them weekly. Interactive Schema Explorer is second at 78%, and Custom Dashboards are used by 45%.',
        chartType: 'bar',
      },
      {
        question: 'Show monthly active user (MAU) trends.',
        answer: 'MAU grew by 18% month-over-month, reaching an all-time high of 42,600 users in March, coinciding with the launch of the v4 compiler integration.',
        chartType: 'line',
      }
    ]
  }
];

interface ChatSession {
  session_id: string;
  dataset_id: string;
  title: string;
  created_at: string;
  preview_chart?: string;
}

export default function Dashboard() {
  const router = useRouter();

  // Navigation states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const { sessions, setSessions } = useSessions();
  // Interactive overlays
  const [activeSession, setActiveSession] =
    useState<any>(null);

  const [sessionMessages, setSessionMessages] =
    useState<any[]>([]);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [userProfile, setUserProfile] = useState<{
    id?: string;
    name: string;
    email: string;
  } | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  });
  const [tempName, setTempName] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleOpenSettings = () => {
    setTempName(userProfile?.name || '');
    setTempEmail(userProfile?.email || '');
    setIsSettingsOpen(true);
  };

  const handleSaveProfile = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setIsSavingProfile(true);

      await updateProfile(
        tempName,
        tempEmail
      );

      const user =
        JSON.parse(
          localStorage.getItem("user")
          || "{}"
        );

      const updatedUser = {
        ...user,
        name: tempName,
        email: tempEmail
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUserProfile(
        updatedUser
      );

      setIsSettingsOpen(false);

    } catch (err: any) {
      console.log("ERROR:", err);
      console.log("RESPONSE:", err?.response?.data);
      console.log("STATUS:", err?.response?.status);
    } finally {

      setIsSavingProfile(false);

    }
  };
  const handleDeleteSession = async (sessionId: string) => {
    try {
      setIsDeleting(true);
      await deleteChatSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
    } catch (err) {
      console.error("Failed to delete session:", err);
    } finally {
      setIsDeleting(false);
      setActiveSession(null);
      setShowDeleteConfirm(false);
    }
  };

  const openSession =
    async (
      sessionId: string
    ) => {

      try {

        const data =
          await getChatSession(
            sessionId
          );
        console.log(
          "SESSION DATA:",
          data
        );

        console.log(
          "MESSAGES:",
          data.messages
        );
        setActiveSession(
          data.session
        );

        setSessionMessages(
          data.messages
        );

      }
      catch (err) {

        console.log(err);

      }
    }

  // Check for session query parameter to auto-open session modal




  // Search filter for history
  const [searchHistory, setSearchHistory] = useState('');

  // Custom mock query input in Hero
  const [heroQuery, setHeroQuery] = useState('');

  // Mock Upload states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle');
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const [newSessionQuery, setNewSessionQuery] = useState('');
  const [generatedResult, setGeneratedResult] = useState<{
    answer: string;
    chartType: 'line' | 'bar' | 'donut';
  } | null>(null);

  // Triggering mock analysis uploader
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFile(file);
      setUploadStatus('uploading');
      setUploadProgress(0);
      setAnalysisLogs([]);
      setGeneratedResult(null);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (uploadStatus === 'uploading') {
      interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadStatus('analyzing');
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [uploadStatus]);

  useEffect(() => {
    if (uploadStatus === 'analyzing') {
      const logs = [
        '[INFO] Parsing dataset structures...',
        '[INFO] Row check: 8,420 rows, 14 columns identified.',
        '[INFO] Type validation: date (Date), cost (Decimal), conversion_rate (Float), group (String).',
        '[INFO] Mapping correlations & indexing search schema...',
        '[SUCCESS] AI parsing complete. System ready to receive natural language questions.'
      ];

      let index = 0;
      const logInterval = setInterval(() => {
        if (index < logs.length) {
          setAnalysisLogs((prev) => [...prev, logs[index]]);
          index++;
        } else {
          clearInterval(logInterval);
          setUploadStatus('done');
        }
      }, 500);

      return () => clearInterval(logInterval);
    }
  }, [uploadStatus]);

  const handleNewAnalysisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionQuery) return;

    // Simulate AI insight generation
    setGeneratedResult({
      answer: `Analysis for "${newSessionQuery}": In the uploaded dataset, custom metrics show a steady upward trend of 14% month-over-month. Performance was concentrated in Enterprise accounts, offset by minor churn in startup tiers.`,
      chartType: 'line'
    });
  };
  const chartTypes = [
    "BarChart",
    "LineChart",
    "PieChart",
    "DonutChart",
    "ScatterChart",
    "AreaChart",
    "MultiBarChart",
    "Table"
  ];

  // Deterministic chart type selection based on session ID
  const getChartTypeForSession = (sessionId: string) => {
    let hash = 0;
    for (let i = 0; i < sessionId.length; i++) {
      const char = sessionId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return chartTypes[Math.abs(hash) % chartTypes.length];
  };

  const handleHeroQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pure frontend element - nothing happens on submit
  };

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/');
  };

  const filteredHistory = sessions.filter(session =>
    session.title.toLowerCase().includes(searchHistory.toLowerCase())
  );
  const conversations = [];

  for (let i = 0; i < sessionMessages.length; i++) {

    const msg = sessionMessages[i];

    if (msg.role === "user") {

      const assistant =
        sessionMessages[i + 1]?.role === "assistant"
          ? sessionMessages[i + 1]
          : null;

      conversations.push({
        question: msg.content,
        answer: assistant?.content || "",
        chart: assistant?.chart || null,
        chartData: assistant?.chart_data || []
      });
    }
  }

  return (
    <div className="relative min-h-screen flex text-grey-1200 bg-[#FFFFFF] font-sans antialiased overflow-hidden select-none">

      {/* --- SIDEBAR --- */}
      < Sidebar
        sessions={sessions}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        onOpenSettings={handleOpenSettings}
      />

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-grow min-h-screen flex flex-col md:pl-[260px] bg-[#FFFFFF]">

        {/* Top Header navbar */}
        <header className="sticky top-0 right-0 z-20 h-[52px] bg-white/70 backdrop-blur-md border-b border-grey-100/40 flex items-center justify-between px-6 md:px-10 transition-all duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-grey-800 hover:text-grey-1200 p-1.5 hover:bg-grey-50 rounded-lg cursor-pointer"
            >
              <HamburgerIcon />
            </button>
            <div className="flex items-center gap-1.5 text-xs text-grey-800 font-semibold select-none">
              <span className="opacity-60">Workspace</span>
              <span className="opacity-40">/</span>
              <span className="text-grey-1200">Overview</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#121317] text-white flex items-center justify-center text-xs font-bold shadow-sm select-none hover:scale-105 transition-transform cursor-pointer">
              {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'S'}
            </div>
          </div>
        </header>

        {/* Dashboard Panels Scroll */}
        <main className="flex-grow p-6 md:p-10 max-w-[1140px] mx-auto w-full flex flex-col gap-10">

          {/* Section 1: Hero Banner */}
          <section className="relative bg-gradient-to-br from-[#F8F9FC] via-[#F0F1F5] to-white border border-grey-100 rounded-[32px] p-6 sm:p-8 md:p-10 shadow-sm overflow-hidden text-left flex flex-col md:flex-row items-center justify-between gap-6 group">

            {/* Visual background rings */}
            <div className="absolute -right-24 -bottom-24 w-80 h-80 pointer-events-none opacity-20">
              <svg className="w-full h-full animate-[spin_120s_linear_infinite]" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="75" stroke="#121317" strokeWidth="0.5" strokeDasharray="3,6" fill="none" />
                <circle cx="100" cy="100" r="50" stroke="#121317" strokeWidth="0.5" strokeDasharray="2,4" fill="none" />
              </svg>
            </div>

            <div className="max-w-xl z-10">
              <h1 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tighter text-[#121317] leading-none mb-3 font-heading">
                Talk to your data.
              </h1>
              <p className="text-xs sm:text-sm text-grey-800 font-medium leading-relaxed max-w-lg mb-6">
                Upload datasets, ask questions in plain English, and get charts, insights, and answers instantly. Google Antigravity acts as your personal data analyst.
              </p>

              {/* Instant Query Input */}
              <form onSubmit={handleHeroQuerySubmit} className="relative w-full max-w-md">
                <input
                  type="text"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  placeholder="Ask a question about your database..."
                  className="w-full bg-white border border-grey-100 rounded-full pl-4 pr-24 py-2.5 text-xs text-grey-1200 placeholder-grey-300 focus:outline-none focus:border-grey-1200 shadow-sm transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#121317] hover:bg-grey-900 text-white font-semibold px-3 py-1.5 rounded-full text-[10px] cursor-pointer transition-colors flex items-center gap-1 hover:scale-[1.01]"
                >
                  <SparkIcon />
                  <span>Analyze</span>
                </button>
              </form>
            </div>
          </section>

          {/* Section 2: How It Works visual flow */}
          <section className="text-left">
            <h2 className="text-lg font-bold tracking-tighter text-[#121317] mb-4 font-heading uppercase tracking-wide opacity-80">
              How It Works
            </h2>

            <div className="relative w-full py-4 overflow-visible">
              {/* Background straight connector line with glowing particle (visible on desktop) */}
              <div className="absolute inset-x-0 top-[28px] pointer-events-none hidden lg:block z-0 px-12">
                <svg width="100%" height="10" viewBox="0 0 1000 10" fill="none" preserveAspectRatio="none">
                  {/* Base track line */}
                  <line
                    x1="60"
                    y1="5"
                    x2="940"
                    y2="5"
                    stroke="#F0F1F5"
                    strokeWidth="2.5"
                    strokeDasharray="4,4"
                    strokeLinecap="round"
                  />
                  {/* Dynamic glow highlighted segment on hover */}
                  <line
                    x1="60"
                    y1="5"
                    x2="940"
                    y2="5"
                    stroke="url(#flow-gradient)"
                    strokeWidth="3"
                    strokeDasharray="4,4"
                    strokeDashoffset={
                      hoveredStep === 1 ? "750" :
                        hoveredStep === 2 ? "500" :
                          hoveredStep === 3 ? "250" :
                            hoveredStep === 4 ? "0" : "1000"
                    }
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                  {/* Flow Gradient definition */}
                  <defs>
                    <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="33%" stopColor="#F43F5E" />
                      <stop offset="66%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Step Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">

                {/* Card 1 */}
                <div
                  onMouseEnter={() => setHoveredStep(1)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`group relative bg-white border rounded-[24px] p-5 flex flex-col items-stretch justify-between shadow-[0_4px_14px_rgba(0,0,0,0.01)] hover:shadow-lg transition-all duration-300 cursor-pointer ${hoveredStep === 1 ? 'border-blue-200 shadow-[0_10px_25px_rgba(59,130,246,0.06)] scale-[1.01]' : 'border-grey-100'
                    }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors border ${hoveredStep === 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                        01
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${hoveredStep === 1 ? 'bg-blue-100 text-blue-700' : 'bg-grey-50 text-grey-800'
                        }`}>
                        Ingestion
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-xs font-bold text-grey-1200 mb-1 flex items-center gap-1.5">
                        <DatabaseIcon />
                        <span>Ingest Datasets</span>
                      </h3>
                      <p className="text-[10px] text-grey-800 font-medium leading-relaxed">
                        Upload multi-format CSV, XLSX, or JSON datasets securely into the session sandbox.
                      </p>
                    </div>
                  </div>

                  {/* UI Ingestion Mockup */}
                  <div className="w-full mt-4 rounded-xl border border-grey-100 bg-[#F8F9FC]/70 p-3 flex flex-col gap-2 font-mono text-[9px] select-none">
                    <div className="flex items-center justify-between border-b border-grey-100 pb-1.5">
                      <span className="text-grey-1200 font-bold flex items-center gap-1.5 truncate max-w-[100px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse"></span>
                        sales_q4.csv
                      </span>
                      <span className="text-grey-400 font-semibold flex-shrink-0">12.4 MB</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-grey-800 text-[8px]">
                        <span>Parsing rows...</span>
                        <span className="font-bold text-blue-600">100%</span>
                      </div>
                      <div className="w-full h-1 bg-grey-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-blue-600 rounded-full transition-all duration-500 ${hoveredStep === 1 ? 'w-full' : 'w-[85%]'}`}></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-grey-600 text-[8px] mt-0.5">
                      <span className="border border-grey-100 px-1 py-0.5 rounded bg-white font-medium">14,240 Rows</span>
                      <span className="border border-grey-100 px-1 py-0.5 rounded bg-white font-medium">12 Cols</span>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div
                  onMouseEnter={() => setHoveredStep(2)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`group relative bg-white border rounded-[24px] p-5 flex flex-col items-stretch justify-between shadow-[0_4px_14px_rgba(0,0,0,0.01)] hover:shadow-lg transition-all duration-300 cursor-pointer ${hoveredStep === 2 ? 'border-rose-200 shadow-[0_10px_25px_rgba(244,63,94,0.06)] scale-[1.01]' : 'border-grey-100'
                    }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors border ${hoveredStep === 2 ? 'bg-rose-600 text-white border-rose-600' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                        02
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${hoveredStep === 2 ? 'bg-rose-100 text-rose-700' : 'bg-grey-50 text-grey-800'
                        }`}>
                        Indexing
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-xs font-bold text-grey-1200 mb-1 flex items-center gap-1.5">
                        <SparklesIcon />
                        <span>Schema Extraction</span>
                      </h3>
                      <p className="text-[10px] text-grey-800 font-medium leading-relaxed">
                        Extract column names, statistical metadata, constraints, and relational schema maps.
                      </p>
                    </div>
                  </div>

                  {/* UI Schema Mockup */}
                  <div className="w-full mt-4 rounded-xl border border-grey-100 bg-[#F8F9FC]/70 p-3 flex flex-col gap-1.5 font-mono text-[8.5px] text-left select-none">
                    <div className="flex items-center justify-between border-b border-grey-100 pb-1 text-grey-400 font-bold text-[8px]">
                      <span>FIELD</span>
                      <span>TYPE</span>
                      <span>KEY</span>
                    </div>
                    <div className="flex items-center justify-between text-grey-1200">
                      <span className="font-bold text-grey-900">transaction_id</span>
                      <span className="text-grey-600">INT</span>
                      <span className="text-blue-600 font-bold bg-blue-50 px-1 rounded text-[7px] border border-blue-100">PK</span>
                    </div>
                    <div className="flex items-center justify-between text-grey-1200">
                      <span className="font-bold text-grey-900">customer_tier</span>
                      <span className="text-grey-600">TEXT</span>
                      <span className="text-grey-400">-</span>
                    </div>
                    <div className="flex items-center justify-between text-grey-1200">
                      <span className="font-bold text-grey-900">sales_amount</span>
                      <span className="text-grey-600">DECIMAL</span>
                      <span className="text-grey-400">-</span>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div
                  onMouseEnter={() => setHoveredStep(3)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`group relative bg-white border rounded-[24px] p-5 flex flex-col items-stretch justify-between shadow-[0_4px_14px_rgba(0,0,0,0.01)] hover:shadow-lg transition-all duration-300 cursor-pointer ${hoveredStep === 3 ? 'border-amber-200 shadow-[0_10px_25px_rgba(245,158,11,0.06)] scale-[1.01]' : 'border-grey-100'
                    }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors border ${hoveredStep === 3 ? 'bg-amber-600 text-white border-amber-600' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                        03
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${hoveredStep === 3 ? 'bg-amber-100 text-amber-700' : 'bg-grey-50 text-grey-800'
                        }`}>
                        Compilation
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-xs font-bold text-grey-1200 mb-1 flex items-center gap-1.5">
                        <TerminalIcon />
                        <span>Formulate Queries</span>
                      </h3>
                      <p className="text-[10px] text-grey-800 font-medium leading-relaxed">
                        Ask analytical questions in plain English; our model translates queries instantly.
                      </p>
                    </div>
                  </div>

                  {/* UI Query translation Mockup */}
                  <div className="w-full mt-4 rounded-xl border border-grey-100 bg-[#F8F9FC]/70 p-2.5 flex flex-col gap-1.5 font-mono text-[8px] text-left select-none">
                    <div className="bg-white border border-grey-100 p-1.5 rounded text-grey-1200 font-semibold flex items-center gap-1 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                      <span className="text-amber-600 font-bold">NL:</span>
                      <span className="truncate max-w-[120px]">Show sales by tier...</span>
                    </div>
                    <div className="bg-[#121317] text-grey-300 p-2 rounded leading-relaxed text-[7.5px] overflow-hidden whitespace-nowrap">
                      <span className="text-blue-400">SELECT</span> customer_tier, <br />
                      &nbsp;&nbsp;<span className="text-emerald-400">SUM</span>(sales_amount) <br />
                      <span className="text-blue-400">FROM</span> transactions <br />
                      <span className="text-blue-400">GROUP BY</span> customer_tier;
                    </div>
                  </div>
                </div>

                {/* Card 4 */}
                <div
                  onMouseEnter={() => setHoveredStep(4)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`group relative bg-white border rounded-[24px] p-5 flex flex-col items-stretch justify-between shadow-[0_4px_14px_rgba(0,0,0,0.01)] hover:shadow-lg transition-all duration-300 cursor-pointer ${hoveredStep === 4 ? 'border-emerald-200 shadow-[0_10px_25px_rgba(16,185,129,0.06)] scale-[1.01]' : 'border-grey-100'
                    }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors border ${hoveredStep === 4 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                        04
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${hoveredStep === 4 ? 'bg-emerald-100 text-emerald-700' : 'bg-grey-50 text-grey-800'
                        }`}>
                        Intelligence
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-xs font-bold text-grey-1200 mb-1 flex items-center gap-1.5">
                        <ChartPieIcon />
                        <span>Interactive Insights</span>
                      </h3>
                      <p className="text-[10px] text-grey-800 font-medium leading-relaxed">
                        Render interactive charting components, data correlations, and written transcripts.
                      </p>
                    </div>
                  </div>

                  {/* UI Dashboard Preview Mockup */}
                  <div className="w-full mt-4 rounded-xl border border-grey-100 bg-[#F8F9FC]/70 p-2.5 flex flex-col gap-1.5 font-mono text-[8px] text-left select-none">
                    <div className="flex items-center justify-between text-[7.5px] font-bold">
                      <span className="text-grey-700">RETENTION RATE</span>
                      <span className="text-emerald-600 bg-emerald-50 px-1 rounded flex items-center gap-0.5">
                        ▲ 14.2%
                      </span>
                    </div>
                    {/* Clean mockup CSS bar chart */}
                    <div className="flex items-end justify-between h-[42px] pt-1.5 border-b border-grey-100 px-1">
                      <div className="w-3 bg-grey-200 rounded-t-[2px] h-[30%]"></div>
                      <div className="w-3 bg-grey-200 rounded-t-[2px] h-[55%]"></div>
                      <div className="w-3 bg-grey-200 rounded-t-[2px] h-[70%]"></div>
                      <div className="w-3 bg-emerald-500 rounded-t-[2px] h-[90%] transition-all duration-300"></div>
                    </div>
                    <div className="flex items-center justify-between text-[6.5px] text-grey-400 font-bold">
                      <span>T1</span>
                      <span>T2</span>
                      <span>T3</span>
                      <span className="text-emerald-600 font-bold">T4</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Section 3: Recent Analyses with SVGs */}
          <section className="text-left">
            <h2 className="text-lg font-bold tracking-tighter text-[#121317] mb-6 font-heading uppercase tracking-wide opacity-80">
              Recent Analyses
            </h2>

            {sessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sessions.map((session) => (
                  <div
                    key={session.session_id}
                    onClick={() => openSession(session.session_id)}
                    className="bg-white border border-grey-100 hover:border-grey-300 rounded-[24px] p-5 flex flex-col justify-between items-stretch min-h-[260px] shadow-[0_4px_14px_rgba(0,0,0,0.01)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.03)] cursor-pointer group transition-all duration-300 hover:scale-[1.01]"
                  >
                    <div className="flex flex-col gap-1.5 text-left mb-4">
                      <h3 className="text-sm font-bold text-grey-1200 flex items-center justify-between">
                        <span>{session.title}</span>
                        <ArrowRightIcon />
                      </h3>
                      <p className="text-[10px] text-grey-800 font-medium leading-normal">
                        Get A Walkthrough of your previous analysis session with charts, insights, and conversations.
                      </p>
                    </div>

                    {/* Render dynamic mini graph visualizations */}
                    <div className="flex-grow bg-[#F8F9FC] rounded-xl flex items-center justify-center border border-grey-50 p-3 select-none">
                      <MiniChart
                        type={
                          session.preview_chart ||
                          getChartTypeForSession(session.session_id)
                        }
                      />
                    </div>

                    <span className="text-[10px] font-bold text-grey-800 group-hover:text-grey-1200 transition-colors mt-3 text-left">
                      Open Analysis Session
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center border border-dashed border-grey-200 rounded-[32px] p-12 bg-[#F8F9FC]/40 min-h-[300px] animate-[fadeIn_0.3s_ease-out]">
                <svg width="220" height="220" viewBox="0 0 220 220" fill="none" className="text-grey-400 opacity-70">
                  {/* Outer card frame representing a dashboard canvas */}
                  <rect x="20" y="20" width="180" height="180" rx="32" stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="5 5" />

                  {/* Miniature empty line/area chart inside */}
                  <path d="M 45,140 L 70,120 L 105,145 L 140,100 L 175,115" stroke="#F1F3F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="45" cy="140" r="4" fill="#E5E7EB" />
                  <circle cx="70" cy="120" r="4" fill="#E5E7EB" />
                  <circle cx="105" cy="145" r="4" fill="#E5E7EB" />
                  <circle cx="140" cy="100" r="4" fill="#E5E7EB" />
                  <circle cx="175" cy="115" r="4" fill="#E5E7EB" />

                  {/* An elegant empty folder/file document index in the center */}
                  <rect x="80" y="65" width="60" height="72" rx="12" fill="white" stroke="#9CA3AF" strokeWidth="1.8" />

                  {/* Folded paper corner */}
                  <path d="M 126,65 L 140,79 H 126 V 65 Z" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.8" strokeLinejoin="round" />

                  {/* Subtle document line skeletons */}
                  <line x1="94" y1="90" x2="116" y2="90" stroke="#E5E7EB" strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="94" y1="104" x2="126" y2="104" stroke="#E5E7EB" strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="94" y1="118" x2="108" y2="118" stroke="#E5E7EB" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* --- DIALOG MODALS --- */}

      {/* 1. Analysis Session Details Modal */}
      {activeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[32px] w-full max-w-[620px] max-h-[85vh] flex flex-col justify-between border border-grey-100 overflow-hidden shadow-2xl animate-[scaleUp_0.2s_ease-out]">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-grey-100">
              <h3 className="text-base font-bold text-grey-1200 font-heading">
                {activeSession.title}
              </h3>
              <button
                onClick={() => setActiveSession(null)}
                className="text-grey-800 hover:text-grey-1200 p-1 hover:bg-grey-50 rounded-lg cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Scroll Content */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6 text-left">
              {conversations.map((q, index) => (
                <div key={index} className="flex flex-col gap-3.5 border-b border-grey-50 pb-5 last:border-b-0 last:pb-0">
                  {/* Question */}
                  <div className="flex gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#121317] text-white flex items-center justify-center text-[9px] font-bold mt-0.5">
                      Q
                    </div>
                    <span className="text-xs font-bold text-grey-1200 leading-snug">{q.question}</span>
                  </div>

                  {/* AI Response Text */}
                  <div className="flex gap-2 bg-[#F8F9FC] rounded-2xl p-4 border border-grey-50">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[9px] font-bold mt-0.5 flex-shrink-0">
                      AI
                    </div>
                    <p className="text-[11px] text-grey-800 font-medium leading-relaxed">{q.answer}</p>
                  </div>

                  {/* Render Visual Charts */}
                  <div className="bg-white border border-grey-100 rounded-2xl p-5 flex justify-center items-center min-h-[220px]">

                    {q.chart && q.chartData ? (

                      <ChartRenderer
                        chart={q.chart}
                        data={q.chartData}
                      />

                    ) : (

                      <span className="text-xs text-grey-500">
                        No visualization available
                      </span>

                    )}

                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-grey-10/50 border-t border-grey-100 flex justify-end gap-3.5">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 hover:bg-red-750 text-white font-semibold py-2 px-6 rounded-full text-xs cursor-pointer shadow-sm transition-all duration-200 hover:scale-[1.01]"
              >
                Delete Session
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 1b. Delete Confirmation Modal */}
      {showDeleteConfirm && activeSession && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-[32px] w-full max-w-[400px] border border-grey-100 p-6 flex flex-col gap-5 text-left shadow-2xl animate-[scaleUp_0.15s_ease-out]">
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-grey-1200 font-heading">
                Delete Analysis Session?
              </h3>
              <p className="text-xs text-grey-800 font-medium leading-relaxed">
                Are you sure you want to delete this analysis session? This action cannot be undone and will remove it from your history.
              </p>
            </div>

            <div className="flex justify-end gap-3.5 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="border border-grey-200 hover:bg-grey-50 text-grey-800 font-semibold py-2 px-5 rounded-full text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSession(activeSession.session_id || activeSession.id)}
                className="bg-red-600 hover:bg-red-750 text-white font-semibold py-2 px-5 rounded-full text-xs cursor-pointer shadow-sm transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-[32px] w-full max-w-[420px] border border-grey-100 overflow-hidden shadow-2xl animate-[scaleUp_0.2s_ease-out] text-left">
            <div className="flex items-center justify-between px-6 py-4 border-b border-grey-100">
              <h3 className="text-base font-bold text-grey-1200 font-heading">
                Account Settings
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-grey-800 hover:text-grey-1200 p-1 hover:bg-grey-50 rounded-lg cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-grey-800 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-[#F8F9FC] border border-grey-100 rounded-2xl px-4 py-2 text-xs focus:outline-none focus:border-grey-1200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-grey-800 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="w-full bg-[#F8F9FC] border border-grey-100 rounded-2xl px-4 py-2 text-xs focus:outline-none focus:border-grey-1200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between animate-[fadeIn_0.2s_ease-out]">
                  <label className="text-[9px] font-bold text-grey-800 uppercase tracking-wider">Password</label>
                  <span className="text-[8px] font-bold text-grey-500 bg-grey-100 rounded-md px-1 py-0.5 uppercase tracking-wide">Read-only</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value="••••••••••••"
                    readOnly
                    disabled
                    className="w-full bg-[#F8F9FC]/70 border border-grey-100 rounded-2xl px-4 py-2 text-xs text-grey-400 cursor-not-allowed select-none"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-grey-10/50 border-t border-grey-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                disabled={isSavingProfile}
                className={`border border-grey-200 hover:bg-grey-50 text-grey-800 font-semibold py-2 px-4 rounded-full text-xs cursor-pointer ${isSavingProfile ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingProfile}
                className={`bg-[#121317] hover:bg-grey-900 text-white font-semibold py-2 px-5 rounded-full text-xs cursor-pointer flex items-center justify-center gap-1.5 ${isSavingProfile ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isSavingProfile && (
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                <span>{isSavingProfile ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. New Analysis Uploader Modal */}
      {isUploaderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[32px] w-full max-w-[500px] border border-grey-100 overflow-hidden shadow-2xl animate-[scaleUp_0.2s_ease-out] text-left">
            <div className="flex items-center justify-between px-6 py-4 border-b border-grey-100">
              <h3 className="text-base font-bold text-grey-1200 font-heading">
                New Dataset Analysis
              </h3>
              <button
                onClick={() => setIsUploaderOpen(false)}
                className="text-grey-800 hover:text-grey-1200 p-1 hover:bg-grey-50 rounded-lg cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">

              {/* UPLOADER STAGE: Idle / Choosing File */}
              {uploadStatus === 'idle' && (
                <div className="relative border-2 border-dashed border-grey-200 hover:border-grey-400 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#F8F9FC] group">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls,.json"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-grey-800 mb-3 group-hover:scale-105 transition-transform">
                    <DatabaseIcon />
                  </div>
                  <span className="text-xs font-bold text-grey-1200 mb-1">
                    Drag & drop dataset file here
                  </span>
                  <span className="text-[10px] text-grey-800 font-medium">
                    Supports .csv, .xlsx, .json up to 25MB
                  </span>
                </div>
              )}

              {/* UPLOADER STAGE: Uploading Progress */}
              {uploadStatus === 'uploading' && (
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex items-center justify-between text-xs font-bold text-grey-1200">
                    <span className="truncate">Uploading {uploadFile?.name || 'dataset.csv'}...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-grey-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-grey-850 italic">
                    Transferring bytes to cloud indexing nodes...
                  </p>
                </div>
              )}

              {/* UPLOADER STAGE: AI Analyzing Terminal */}
              {uploadStatus === 'analyzing' && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold text-grey-1200">
                      Antigravity AI parsing Schema...
                    </span>
                  </div>
                  <div className="w-full bg-[#121317] rounded-2xl p-4 text-[10px] font-mono text-grey-300 h-36 overflow-y-auto flex flex-col gap-1.5 shadow-inner">
                    {analysisLogs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed animate-[fadeIn_0.15s_ease-out]">
                        {log}
                      </div>
                    ))}
                    <div className="w-1.5 h-3 bg-white animate-pulse inline-block" />
                  </div>
                </div>
              )}

              {/* UPLOADER STAGE: Schema Finished, query prompt uploader */}
              {uploadStatus === 'done' && (
                <div className="flex flex-col gap-4 animate-[fadeIn_0.3s_ease-out]">
                  <div className="bg-green-50 border border-green-200 text-green-800 text-[11px] font-medium p-3 rounded-2xl flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-200 flex items-center justify-center font-bold text-xs text-green-700">✓</div>
                    <span>Dataset <strong>{uploadFile?.name}</strong> successfully parsed and indexed!</span>
                  </div>

                  <form onSubmit={handleNewAnalysisSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[9px] font-bold text-grey-800 uppercase tracking-wider ml-1">
                        Ask the AI analyst a question
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          required
                          value={newSessionQuery}
                          onChange={(e) => setNewSessionQuery(e.target.value)}
                          placeholder="e.g., Show total transactions group by date"
                          className="w-full bg-[#F8F9FC] border border-grey-100 rounded-2xl px-4 py-2.5 text-xs text-grey-1200 placeholder-grey-300 focus:outline-none focus:border-grey-1200 focus:bg-white transition-colors"
                        />
                        <button
                          type="submit"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#121317] hover:bg-grey-900 text-white rounded-full p-1 cursor-pointer transition-colors"
                        >
                          <ArrowRightIcon />
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Render generated result */}
                  {generatedResult && (
                    <div className="flex flex-col gap-4 border-t border-grey-50 pt-4 animate-[fadeIn_0.3s_ease-out]">
                      <div className="flex gap-2.5 bg-[#F8F9FC] rounded-2xl p-4 border border-grey-50">
                        <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[9px] font-bold mt-0.5 flex-shrink-0">
                          AI
                        </div>
                        <p className="text-[11px] text-grey-800 font-medium leading-relaxed">
                          {generatedResult.answer}
                        </p>
                      </div>

                      {/* Live Generated Mock Chart SVG */}
                      <div className="bg-white border border-grey-100 rounded-2xl p-4 flex justify-center items-center h-36">
                        <svg width="240" height="100" viewBox="0 0 240 100">
                          <line x1="20" y1="80" x2="220" y2="80" stroke="#CDD4DC" strokeWidth="0.8" />
                          <path d="M20 70 L 60 50 L 100 65 L 140 40 L 180 50 L 220 20" fill="none" stroke="#34A853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="220" cy="20" r="3.5" fill="#34A853" />
                          <text x="220" y="92" fontSize="7" fill="#45474D" textAnchor="middle">Current Period</text>
                        </svg>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

            <div className="px-6 py-4 bg-grey-10/50 border-t border-grey-100 flex justify-end gap-3">
              <button
                onClick={() => setIsUploaderOpen(false)}
                className="border border-grey-200 hover:bg-grey-50 text-grey-800 font-semibold py-2 px-5 rounded-full text-xs cursor-pointer"
              >
                Close Dialog
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
