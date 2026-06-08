'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { askQuestion } from '@/services/chat.service';
import ChartRenderer from '@/components/charts/ChartRenderer';
import axios from 'axios';
import { api } from '@/services/api';
// --- Custom SVGs for UI Icons ---

const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const SparkIcon = ({ className = "text-blue-500 fill-blue-500 w-4.5 h-4.5" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
  </svg>
);

const PaperclipIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const MicrophoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>
);

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const FloatingCanvasIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-grey-800 hover:text-grey-1200 cursor-pointer transition-colors">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TickIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 hover:text-green-800 cursor-pointer transition-colors">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CrossIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 hover:text-red-700 cursor-pointer transition-colors">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TypewriterText = ({
  text,
  speed = 12,
  onType,
  onComplete
}: {
  text: string;
  speed?: number;
  onType?: () => void;
  onComplete?: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const onTypeRef = useRef(onType);
  const onCompleteRef = useRef(onComplete);

  // Keep refs updated
  useEffect(() => {
    onTypeRef.current = onType;
    onCompleteRef.current = onComplete;
  }, [onType, onComplete]);

  useEffect(() => {
    let currentIndex = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayedText("");

    const interval = setInterval(() => {
      currentIndex++;
      setDisplayedText(text.slice(0, currentIndex));
      onTypeRef.current?.();

      if (currentIndex >= text.length) {
        clearInterval(interval);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <p>{displayedText}</p>;
};
// --- Typings & Preset Structures ---

interface QueryPreset {
  question: string;
  answer: string;
  chartType: 'line' | 'bar' | 'donut';
  sql: string;
}

interface Dataset {
  filename: string;
  table_name: string;
  rows: number;
  columns: {
    name: string;
    dtype: string;
    role: string;
  }[];
}

const queryPresets: QueryPreset[] = [
  {
    question: 'Show monthly revenue growth for Q1 2026',
    answer: 'Here is the SaaS monthly revenue breakdown for Q1 2026. Monthly Recurring Revenue (MRR) grew consistently from $120k in January to $148k in March, representing a 23.3% net growth over the quarter, primarily driven by enterprise upgrades.',
    chartType: 'line',
    sql: `SELECT \n  TO_CHAR(transaction_date, 'YYYY-Mon') AS month,\n  SUM(sales_cost) AS monthly_revenue\nFROM dataset\nWHERE transaction_date BETWEEN '2026-01-01' AND '2026-03-31'\nGROUP BY 1\nORDER BY MIN(transaction_date);`
  },
  {
    question: 'Analyze customer segments by customer_tier',
    answer: 'Based on the uploaded cohort details, the user base is segmented into: Developer Tier (54%), Team Tier (28%), Enterprise Custom (12%), and Free Trial (6%). The Enterprise and Team cohorts account for 78% of the total revenue value.',
    chartType: 'donut',
    sql: `SELECT \n  customer_tier,\n  COUNT(DISTINCT customer_id) AS total_users,\n  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS percentage\nFROM dataset\nGROUP BY customer_tier\nORDER BY total_users DESC;`
  },
  {
    question: 'Compare sales_cost against conversion_rate correlation',
    answer: 'I ran a clustering analysis comparing sales costs against conversion rates. There is a strong positive correlation (r = 0.86) showing that higher sales cost allocations correlate with higher conversion brackets, peaking at an average of $118k sales cost for conversion rates above 30%.',
    chartType: 'bar',
    sql: `SELECT \n  CASE \n    WHEN conversion_rate < 0.15 THEN 'Low Conversion (<15%)'\n    WHEN conversion_rate BETWEEN 0.15 AND 0.30 THEN 'Medium Conversion (15-30%)'\n    ELSE 'High Conversion (>30%)'\n  END AS conversion_cluster,\n  ROUND(AVG(sales_cost), 2) AS average_sales_cost,\n  COUNT(*) AS transaction_count\nFROM dataset\nGROUP BY 1\nORDER BY average_sales_cost ASC;`
  }
];

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  chartType?: 'line' | 'bar' | 'donut';
  chart?: any;
  chartData?: any[];
  sql?: string;
  isTyped?: boolean;
}


export default function ChatSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.id as string;

  // Navigation & View Drawer States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCanvasDrawerOpen, setIsCanvasDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'viz' | 'sql'>('viz');

  // Input states
  const [inputText, setInputText] = useState('');
  const [deepResearchEnabled, setDeepResearchEnabled] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Chat message logs
  const [messages, setMessages] =
    useState<ChatMessage[]>([]);
  const [sessionTitle, setSessionTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [activeChartType, setActiveChartType] = useState<'line' | 'bar' | 'donut' | 'none'>('none');
  const [activeSql, setActiveSql] = useState<string>('');
  const [dataset] = useState<Dataset | null>(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("analysis_data")
        : null;

    return stored
      ? JSON.parse(stored)
      : null;
  });
  // Tooltip hover states for SVGs
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Scroll refs
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const desktopCanvasScrollRef = useRef<HTMLDivElement>(null);
  const mobileCanvasScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat logs to bottom
  const handleScrollToBottom = () => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
    }
  };

  // Auto-scroll canvas tabs to bottom
  const handleCanvasScrollToBottom = () => {
    setTimeout(() => {
      if (desktopCanvasScrollRef.current) {
        desktopCanvasScrollRef.current.scrollTo({
          top: desktopCanvasScrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
      if (mobileCanvasScrollRef.current) {
        mobileCanvasScrollRef.current.scrollTo({
          top: mobileCanvasScrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };


  const updateSessionTitle = async (
    sessionId: string,
    title: string
  ) => {

    const response =
      await api.patch(
        `/chat-sessions/${sessionId}`,
        {
          title
        }
      );

    return response.data;
  };

  const handleSaveTitle = async () => {
    const trimmed = tempTitle.trim();
    if (!trimmed || trimmed === sessionTitle) {
      setIsEditingTitle(false);
      return;
    }

    // Immediately update state for instant UI reflection
    setSessionTitle(trimmed);
    setIsEditingTitle(false);

    // Call update API
    try {
      await updateSessionTitle(sessionId, trimmed);
    } catch (err) {
      console.error("Failed to update session title in backend:", err);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
  };

  useEffect(() => {
    handleScrollToBottom();
    handleCanvasScrollToBottom();
  }, [messages, isTyping]);

  // useEffect(() => {

  //   localStorage.setItem(
  //     `chat-${sessionId}`,
  //     JSON.stringify(messages)
  //   );

  // }, [messages, sessionId]);


  const getChatSession = async (
    sessionId: string
  ) => {

    const token =
      localStorage.getItem("token");

    const response =
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/chat-sessions/${sessionId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );
    const data = response.data;

    setSessionTitle(
      data.session.title
    );

    return data;
  };
  useEffect(() => {

    const loadChat =
      async () => {

        try {

          const data =
            await getChatSession(
              sessionId
            );
          setSessionTitle(
            data.session.title
          );
          setMessages(
            data.messages.map((msg: any) => ({
              role: msg.role,
              content: msg.content,
              sql: msg.sql,
              chart: msg.chart,
              chartData: msg.chart_data,
              isTyped: true
            }))
          );

        } catch (err) {

          console.log(err);

        }
      };

    loadChat();

  }, [sessionId]);
  // SQL Copy click
  const handleCopyQuery = (sql: string, index: number) => {
    navigator.clipboard.writeText(sql);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Run a query (either clicked preset or typed text)
  const executeQuery = async (
    questionText: string
  ) => {

    if (!questionText.trim()) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: questionText
    };

    setMessages(prev => [
      ...prev,
      userMsg
    ]);




    setInputText("");
    setIsTyping(true);

    try {

      const response =
        await askQuestion(
          {
            session_id: sessionId,
            question: questionText,
          }
        );
      console.log(response);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: response.explanation,
        sql: response.sql,
        chartType: response.chart?.type as any,
        chart: response.chart,
        chartData: response.result?.rows
      };

      setMessages(prev => [
        ...prev,
        assistantMsg
      ]);

      setActiveSql(
        response.sql
      );

      setActiveChartType(
        response.chart?.type as any || 'none'
      );


    } catch (error) {

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I could not process that query."
        }
      ]);

    } finally {

      setIsTyping(false);

    }
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeQuery(inputText);
    }
  };

  // SQL Highlighting Parser
  const highlightSql = (sql: string) => {
    if (!sql) return <span className="text-slate-400/80 italic">-- No SQL generated yet. Ask a question to run schema compiles.</span>;

    const keywords = /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|AND|AS|DESC|BETWEEN|ON|JOIN|LEFT|INNER|USING|LIMIT)\b/g;
    const functions = /\b(SUM|COUNT|AVG|MIN|MAX|ROUND|TO_CHAR|CASE|WHEN|THEN|ELSE|END|DATE_TRUNC|DISTINCT|OVER)\b/g;
    const strings = /('[^']*')/g;
    const numbers = /\b(\d+)\b/g;

    let highlighted = sql
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    highlighted = highlighted.replace(keywords, '<span class="sql-keyword">$1</span>');
    highlighted = highlighted.replace(functions, '<span class="sql-function">$1</span>');
    highlighted = highlighted.replace(strings, '<span class="sql-string">$1</span>');
    highlighted = highlighted.replace(numbers, '<span class="sql-number">$1</span>');

    return <code dangerouslySetInnerHTML={{ __html: highlighted }} className="block whitespace-pre font-mono text-[13.5px] leading-relaxed text-slate-100" />;
  };


  // --- Structuring loaders & Animated Vector Drafting grids ---

  const GraphStructureLoader = () => {
    return (
      <div className="flex flex-col gap-3 p-5 bg-[#F8F9FC] border border-blue-100/50 rounded-2xl animate-pulse relative overflow-hidden text-left">
        {/* Light glow sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

        <div className="flex items-center justify-between border-b border-grey-100 pb-2 mb-2 flex-shrink-0">
          <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            Structuring visualization vectors...
          </span>
        </div>

        <div className="relative w-full h-[160px] bg-white border border-grey-100 rounded-xl p-3 flex items-center justify-center overflow-hidden">
          {/* Animated Blueprint Grid */}
          <div className="absolute inset-0 opacity-15" style={{
            backgroundImage: 'linear-gradient(to right, #4285F4 1px, transparent 1px), linear-gradient(to bottom, #4285F4 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />

          <svg className="w-[85%] h-[85%] relative z-10" viewBox="0 0 200 100">
            {/* Animated Axes */}
            <line x1="20" y1="80" x2="180" y2="80" stroke="#CDD4DC" strokeWidth="1.5" strokeDasharray="160" strokeDashoffset="160" className="animate-[draw-stroke_1.2s_ease-out_forwards]" />
            <line x1="20" y1="20" x2="20" y2="80" stroke="#CDD4DC" strokeWidth="1.5" strokeDasharray="60" strokeDashoffset="60" className="animate-[draw-stroke_1.2s_ease-out_forwards]" />

            {/* Animated Tracing Graph Line */}
            <path
              d="M 20 70 Q 50 40 80 60 T 140 30 T 180 40"
              fill="none"
              stroke="#4285F4"
              strokeWidth="2"
              strokeDasharray="200"
              strokeDashoffset="200"
              className="animate-[draw-stroke_2s_ease-in-out_infinite_alternate]"
            />

            {/* Pulsing Graph Nodes */}
            <circle cx="20" cy="70" r="3" fill="#4285F4" className="animate-[pulse-scale_1s_infinite_alternate_0ms]" />
            <circle cx="65" cy="50" r="3" fill="#EA4335" className="animate-[pulse-scale_1s_infinite_alternate_300ms]" />
            <circle cx="110" cy="45" r="3" fill="#FBBC05" className="animate-[pulse-scale_1s_infinite_alternate_600ms]" />
            <circle cx="150" cy="32" r="3" fill="#34A853" className="animate-[pulse-scale_1s_infinite_alternate_900ms]" />

            {/* Drafting measurement lines */}
            <line x1="65" y1="50" x2="65" y2="80" stroke="#EA4335" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
            <line x1="110" y1="45" x2="110" y2="80" stroke="#FBBC05" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
            <line x1="150" y1="32" x2="150" y2="80" stroke="#34A853" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          </svg>

          {/* Blueprint Compass/Drafting Tool overlay */}
          <div className="absolute top-4 left-4 w-6 h-6 border border-dashed border-blue-300 rounded-full animate-[spin_6s_linear_infinite] opacity-40" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border border-dashed border-grey-300 rounded-full animate-[spin_10s_linear_infinite_reverse] opacity-40" />
        </div>

        <div className="flex flex-col gap-1 text-[10px] text-grey-800">
          <div className="flex items-center justify-between">
            <span>Mapping layout vectors...</span>
            <span className="font-mono text-blue-600">84%</span>
          </div>
          <div className="w-full h-1 bg-grey-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-[progress-pulse_1.5s_infinite]" />
          </div>
        </div>
      </div>
    );
  };

  const SqlCompilationLoader = () => {
    return (
      <div className="flex flex-col gap-3 p-5 bg-[#121317] border border-grey-900 rounded-2xl animate-pulse relative overflow-hidden text-left">
        <div className="flex items-center justify-between border-b border-grey-800 pb-2 mb-2 flex-shrink-0">
          <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
            Compiling relational SQL query...
          </span>
        </div>

        <div className="relative bg-[#090A0C] border border-grey-950 rounded-xl p-4 font-mono text-xs text-grey-300 leading-relaxed overflow-hidden">
          {/* Flashing cursor and drafting indicators */}
          <div className="flex flex-col gap-1.5 font-mono select-none">
            <div className="flex items-center gap-1 opacity-70">
              <span className="text-purple-400">SELECT</span>
              <span className="w-16 h-3.5 bg-grey-800 rounded animate-[pulse_1s_infinite]" />
            </div>
            <div className="flex items-center gap-1 opacity-55">
              <span className="text-blue-400">FROM</span>
              <span className="text-grey-400">dataset</span>
            </div>
            <div className="flex items-center gap-1 opacity-40">
              <span className="text-purple-400">WHERE</span>
              <span className="w-24 h-3.5 bg-grey-800 rounded animate-[pulse_1s_infinite]" style={{ animationDelay: '200ms' }} />
            </div>
            <div className="flex items-center gap-1 opacity-25">
              <span className="text-purple-400">GROUP BY</span>
              <span className="text-amber-400">1</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVisualizationLogs = () => {
    const vizMessages = messages.filter((msg) => msg.role === 'assistant' && msg.chart && msg.chartData);

    return (
      <div className="flex flex-col gap-5 text-left h-full pb-6 select-none">
        <div className="flex items-center justify-between flex-shrink-0">
          <span className="text-[9px] font-bold text-grey-800 uppercase tracking-widest">Visualizations Log ({vizMessages.length})</span>
        </div>

        {vizMessages.length === 0 && !isTyping ? (
          // Welcome preview (Default Schema Overview Card)
          <div className="flex flex-col gap-4 text-left animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white border border-grey-100 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50/50 flex items-center justify-center border border-blue-100/50">
                  <SparkIcon className="text-blue-500 fill-blue-500 w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-xs font-bold text-[#121317] font-sans leading-none">{dataset?.table_name || 'session-dataset'}</h4>
                  <span className="text-[9px] text-green-600 font-bold flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping inline-block" />
                    Schema compiled & indexed
                  </span>
                </div>
              </div>

              {/* Data specifications list */}
              <div className="grid grid-cols-2 gap-2 border-t border-grey-50 pt-3 text-[10px]">
                <div className="flex flex-col">
                  <span className="text-grey-800 font-semibold uppercase tracking-wider text-[8px]">Dimensions</span>
                  <span className="text-xs font-bold text-grey-1200">
                    {(dataset?.rows ?? 0).toLocaleString()} × {dataset?.columns?.length ?? 0} fields
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-grey-800 font-semibold uppercase tracking-wider text-[8px]">Index Type</span>
                  <span className="text-xs font-bold text-grey-1200">Relational SQL Table</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 border-t border-grey-50 pt-3">
                <span className="text-grey-800 font-semibold uppercase tracking-wider text-[8px]">Primary Metrics Detected</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {dataset?.columns?.map(col => (
                    <span
                      key={col.name}
                      className="bg-blue-50 text-blue-600 font-mono text-[9px] px-2 py-0.5 rounded-full border border-blue-100/40"
                    >
                      {col.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#121317] to-grey-900 text-white rounded-2xl p-5 shadow-md text-left flex flex-col gap-3">
              <span className="text-[8px] font-bold text-[#EA4335] uppercase tracking-widest">Prompt compiler</span>
              <h5 className="font-heading text-sm font-bold leading-tight">Ready for analytical questions</h5>
              <p className="text-[10px] text-grey-300 leading-relaxed font-medium">
                Try clicking one of the recommendation suggestion cards below to run compiler queries and instantly render visual charts.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {vizMessages.map((msg, idx) => {
              const originalIndex = messages.indexOf(msg);
              const questionText = originalIndex > 0 ? messages[originalIndex - 1]?.content : 'Custom Query';

              return (
                <div key={idx} className="flex flex-col gap-3 animate-[fadeIn_0.2s_ease-out]">
                  {/* Question header */}
                  <div className="flex items-start gap-1.5 text-xs text-grey-800 font-semibold px-1 select-text">
                    <span className="text-blue-600 font-bold">Q:</span>
                    <span className="italic text-grey-1200">&quot;{questionText}&quot;</span>
                  </div>

                  {/* Chart Rendering Container Box */}
                  <div className="bg-white border border-grey-100 rounded-2xl p-4 shadow-2xs">
                    <ChartRenderer
                      chart={msg.chart}
                      data={msg.chartData}
                    />
                  </div>

                  {/* Dashed Border Divider */}
                  {idx < vizMessages.length - 1 && (
                    <div className="border-t border-dashed border-grey-300 my-4" />
                  )}
                </div>
              );
            })}

            {isTyping && (
              <>
                {vizMessages.length > 0 && <div className="border-t border-dashed border-grey-300 my-4" />}
                <GraphStructureLoader />
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSqlLogs = () => {
    const sqlMessages = messages.filter((msg) => msg.role === 'assistant' && msg.sql);

    return (
      <div className="flex flex-col gap-5 text-left h-full pb-6 select-none">
        <div className="flex items-center justify-between flex-shrink-0">
          <span className="text-[9px] font-bold text-grey-800 uppercase tracking-widest">Compiler Query Log ({sqlMessages.length})</span>
        </div>

        {sqlMessages.length === 0 && !isTyping ? (
          <div className="bg-[#121317] border border-grey-900 rounded-2xl p-5 shadow-sm text-center">
            <span className="text-slate-400/80 italic text-xs">-- No SQL queries generated yet. Ask a question to run schema compiles.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {sqlMessages.map((msg, idx) => {
              const originalIndex = messages.indexOf(msg);
              const questionText = originalIndex > 0 ? messages[originalIndex - 1]?.content : 'Custom Query';

              return (
                <div key={idx} className="flex flex-col gap-2 animate-[fadeIn_0.2s_ease-out]">
                  {/* Question header */}
                  <div className="flex items-start gap-1.5 text-xs text-grey-800 font-semibold px-1 select-text">
                    <span className="text-blue-600 font-bold">Q:</span>
                    <span className="italic text-grey-1200">&quot;{questionText}&quot;</span>
                  </div>

                  {/* SQL Code Box */}
                  <div className="relative bg-[#121317] border border-grey-900 rounded-2xl p-4 shadow-sm flex flex-col justify-between overflow-hidden">
                    <div className="overflow-x-auto select-text mb-3">
                      {highlightSql(msg.sql || '')}
                    </div>

                    {/* Copy button */}
                    <div className="flex justify-end pt-2.5 border-t border-grey-800/40">
                      <button
                        onClick={() => handleCopyQuery(msg.sql || '', idx)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/15 text-white rounded-full text-[9px] font-bold cursor-pointer transition-colors shadow-xs"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <CheckIcon />
                            <span className="text-green-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <CopyIcon />
                            <span>Copy SQL</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Dashed Border Divider */}
                  {idx < sqlMessages.length - 1 && (
                    <div className="border-t border-dashed border-grey-300 my-4" />
                  )}
                </div>
              );
            })}

            {isTyping && (
              <>
                {sqlMessages.length > 0 && <div className="border-t border-dashed border-grey-300 my-4" />}
                <SqlCompilationLoader />
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex text-grey-1200 bg-[#FFFFFF] font-sans antialiased overflow-hidden select-none">

      {/* 1. Global swirly meshes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[320px] h-[320px] rounded-full bg-gradient-to-tr from-blue-200/25 to-purple-200/25 blur-3xl animate-pulse-glow" style={{ animationDelay: '0ms' }} />
        <div className="absolute bottom-[15%] right-[25%] w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-pink-200/20 to-teal-200/20 blur-3xl animate-pulse-glow" style={{ animationDelay: '2000ms' }} />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes swirl {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.08); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes swirl-reverse {
          0% { transform: rotate(360deg) scale(1.08); }
          50% { transform: rotate(180deg) scale(0.92); }
          100% { transform: rotate(0deg) scale(1.08); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.45; filter: blur(24px); }
          50% { opacity: 0.7; filter: blur(36px); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes draw-stroke {
          to { stroke-dashoffset: 0; }
        }
        @keyframes pulse-scale {
          0% { transform: scale(0.9); opacity: 0.5; }
          100% { transform: scale(1.3); opacity: 1; }
        }
        @keyframes progress-pulse {
          0% { width: 10%; }
          50% { width: 75%; }
          100% { width: 100%; }
        }
        circle {
          transform-box: fill-box;
          transform-origin: center;
        }
        .animate-swirl {
          animation: swirl 15s linear infinite;
        }
        .animate-swirl-reverse {
          animation: swirl-reverse 11s linear infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 5s ease-in-out infinite;
        }
        .sql-keyword { color: #c084fc; font-weight: 700; }
        .sql-function { color: #60a5fa; font-weight: 700; }
        .sql-string { color: #34d399; font-weight: 500; }
        .sql-number { color: #fbbf24; font-weight: 600; }
      ` }} />

      {/* 3. Main Workspace Container */}
      <div className="flex-grow min-h-screen flex flex-col bg-[#FFFFFF] h-screen overflow-hidden z-10 relative animate-[fadeIn_0.2s_ease-out]">

        {/* Workspace Top navbar */}
        <header className="h-[52px] bg-white/70 backdrop-blur-md border-b border-grey-100/40 flex items-center justify-between px-6 md:px-10 flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F9FC] border border-grey-100 hover:bg-[#F0F1F5] hover:border-grey-300 rounded-full text-[10px] font-bold text-grey-1200 cursor-pointer shadow-2xs transition-all duration-150"
            >
              <ArrowLeftIcon />
              <span>Go to Dashboard</span>
            </button>
            <div className="w-[1px] h-3.5 bg-grey-200" />
            <div className="flex items-center gap-1.5 text-xs text-grey-800 font-semibold select-none">
              <span className="opacity-60">Workspace</span>
              <span className="opacity-40">/</span>
              <span className="opacity-60">Chat</span>
              <span className="opacity-40">/</span>
              {isEditingTitle ? (
                <div className="flex items-center gap-1.5 select-text">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    className="bg-transparent border-b border-grey-300 text-grey-1200 outline-none px-1 py-0.5 max-w-[150px] font-sans font-bold text-xs"
                    autoFocus
                  />
                  <button onClick={handleSaveTitle} className="p-1 hover:bg-grey-100 rounded cursor-pointer flex items-center justify-center">
                    <TickIcon />
                  </button>
                  <button onClick={handleCancelEdit} className="p-1 hover:bg-grey-100 rounded cursor-pointer flex items-center justify-center">
                    <CrossIcon />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 group select-text">
                  <span className="text-grey-1200 truncate max-w-[120px] sm:max-w-none">{sessionTitle}</span>
                  <button
                    onClick={() => {
                      setTempTitle(sessionTitle);
                      setIsEditingTitle(true);
                    }}
                    className="p-1 hover:bg-grey-100 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                    title="Edit Title"
                  >
                    <EditIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCanvasDrawerOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F9FC] border border-grey-100 hover:bg-[#F0F1F5] rounded-full text-[10px] font-bold text-[#121317] cursor-pointer shadow-xs transition-colors"
            >
              <FloatingCanvasIcon />
              <span>Canvas</span>
            </button>
            <div className="w-7 h-7 rounded-full bg-[#121317] text-white flex items-center justify-center text-xs font-bold shadow-sm cursor-pointer">
              S
            </div>
          </div>
        </header>

        {/* Workspace Split Body */}
        <div className="flex-grow flex overflow-hidden p-4 md:p-6 lg:p-7 gap-6 h-[calc(100vh-52px)]">

          {/* A. Center Chat Console Box */}
          <div className="flex-grow flex flex-col justify-between overflow-hidden bg-white border border-grey-100 rounded-[32px] shadow-xs relative">

            {/* Active Database Tables Badge Bar */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-[#F8F9FC]/70 border-b border-grey-100/60 select-none">
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-widest text-[8px] text-grey-800">Active Schema:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="bg-white border border-grey-100 px-2.5 py-0.5 rounded-md font-mono text-[9px] text-grey-1200 flex items-center gap-1 shadow-3xs animate-[fadeIn_0.3s_ease-out]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    {dataset?.table_name}
                  </span>
                </div>
              </div>
              <div className="text-[9px] font-bold text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Connected
              </div>
            </div>

            {/* Inner Content Area */}
            <div className="flex-grow flex flex-col justify-between overflow-hidden p-5">

              {/* Messages Scroll Area */}
              <div
                ref={chatScrollContainerRef}
                className="flex-grow overflow-y-auto mb-4 pr-1 flex flex-col gap-5 text-left"
              >
                {messages.length === 0 ? (
                  // Welcome View
                  <div className="flex-grow flex flex-col items-center justify-center gap-8 py-8">
                    {/* Swirling glowing Orb */}
                    <div className="relative w-36 h-36 flex items-center justify-center animate-[bounce-dots_6s_ease-in-out_infinite]">
                      {/* Glowing Blur Layer 1 */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 animate-swirl" />
                      {/* Glowing Blur Layer 2 */}
                      <div className="absolute inset-2 bg-gradient-to-bl from-green-400 via-teal-500 to-indigo-600 rounded-full blur-xl opacity-40 animate-swirl-reverse" />
                      {/* Glass Core Container */}
                      <div className="absolute inset-5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-[inset_0_4px_12px_rgba(255,255,255,0.4)] flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 animate-pulse shadow-[0_0_15px_rgba(66,133,244,0.5)] flex items-center justify-center text-white">
                          <SparkIcon className="text-white fill-white w-4.5 h-4.5" />
                        </div>
                      </div>
                    </div>

                    {/* Greetings Header */}
                    <div className="flex flex-col gap-2 text-center max-w-sm">
                      <h2 className="text-2xl font-bold tracking-tighter text-[#121317] font-heading leading-tight">
                        Talk to your data.
                      </h2>
                      <p className="text-xs text-grey-800 font-medium leading-relaxed">
                        Ask questions in plain English, translate them to SQL commands, and construct interactive visualizations instantly.
                      </p>
                    </div>

                    {/* Suggestion Cards */}
                    <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-2">
                      {queryPresets.map((card, idx) => (
                        <button
                          key={idx}
                          onClick={() => executeQuery(card.question)}
                          className="bg-[#F8F9FC] border border-grey-100 hover:border-grey-300 hover:bg-[#F0F1F5]/40 rounded-2xl p-4 shadow-2xs hover:scale-[1.02] cursor-pointer text-left flex flex-col justify-between gap-4 transition-all duration-200"
                        >
                          <span className="text-[10px] font-bold text-grey-1200 leading-normal font-sans">
                            &quot;{card.question}&quot;
                          </span>
                          <div className="flex items-center gap-1 text-[9px] font-bold text-blue-600">
                            <span>Run query</span>
                            <ChevronRightIcon />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Messages list
                  <div className="flex flex-col gap-5 pr-1">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 justify-start ${msg.role === 'user' ? 'flex-row-reverse text-right' : ''
                          } animate-[fadeIn_0.25s_ease-out]`}
                      >
                        {/* Avatar */}
                        {msg.role === 'user' ? (
                          <div className="w-7 h-7 rounded-full bg-[#121317] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                            S
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
                            <SparkIcon className="text-blue-500 fill-blue-500 w-3.5 h-3.5" />
                          </div>
                        )}

                        {/* Bubble */}
                        <div className={`border rounded-2xl max-w-[85%] px-4 py-3 shadow-2xs text-xs font-semibold leading-relaxed ${msg.role === 'user'
                          ? 'bg-blue-600 text-white border-blue-700 rounded-tr-xs text-left'
                          : 'bg-[#F8F9FC] text-grey-1200 border-grey-100/50 rounded-tl-xs'
                          }`}>
                          {msg.role === 'assistant' && index === messages.length - 1 && !msg.isTyped ? (
                            <TypewriterText
                              text={msg.content}
                              onType={handleScrollToBottom}
                              onComplete={() => {
                                setMessages(prev => {
                                  const updated = [...prev];
                                  if (updated[index]) {
                                    updated[index] = { ...updated[index], isTyped: true };
                                  }
                                  return updated;
                                });
                              }}
                            />
                          ) : (
                            <p>{msg.content}</p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex items-start gap-3 justify-start animate-[fadeIn_0.2s_ease-out]">
                        <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
                          <SparkIcon className="text-blue-500 fill-blue-500 w-3.5 h-3.5" />
                        </div>
                        <div className="bg-[#F8F9FC] border border-grey-100/50 rounded-2xl rounded-tl-xs px-4 py-3 shadow-2xs max-w-[85%] flex items-center gap-1.5 h-9">
                          <div className="w-1.5 h-1.5 rounded-full bg-grey-800/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-grey-800/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-grey-800/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Input Console Bar */}
              <div className="flex-shrink-0">
                <div className="relative w-full border border-grey-200 bg-white rounded-2xl shadow-sm focus-within:border-grey-1200 transition-colors px-4 py-3 flex items-center justify-between min-h-[74px] gap-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask a question about your datasets..."
                    className="flex-grow bg-transparent outline-none border-none text-xs font-semibold text-grey-1200 placeholder-grey-300 py-1.5 px-2 select-text"
                  />
                  <button
                    onClick={() => executeQuery(inputText)}
                    className="bg-[#121317] hover:bg-grey-900 text-white p-2.5 rounded-xl cursor-pointer hover:scale-102 transition-transform flex-shrink-0 flex items-center justify-center"
                  >
                    <SendIcon />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* B. Right Visual Canvas Panel (Desktop) */}
          <div className="hidden lg:flex flex-col w-[380px] xl:w-[420px] bg-[#F8F9FC]/95 border border-grey-100 rounded-[32px] overflow-hidden flex-shrink-0 p-5 shadow-sm relative">

            {/* Header Tabs Toggle */}
            <div className="flex items-center bg-[#F0F1F5] p-1 rounded-full w-full mb-5 flex-shrink-0 border border-grey-200/40">
              <button
                onClick={() => setActiveTab('viz')}
                className={`flex-grow py-2.5 rounded-full text-[10px] font-bold tracking-tight transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'viz' ? 'bg-white text-[#121317] shadow-xs' : 'text-grey-800 hover:text-[#121317]'
                  }`}
              >
                <FloatingCanvasIcon />
                <span>Visualizations</span>
              </button>
              <button
                onClick={() => setActiveTab('sql')}
                className={`flex-grow py-2.5 rounded-full text-[10px] font-bold tracking-tight transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'sql' ? 'bg-white text-[#121317] shadow-xs' : 'text-grey-800 hover:text-[#121317]'
                  }`}
              >
                <span>Generated SQL</span>
              </button>
            </div>

            {/* Tab Body Contents */}
            <div ref={desktopCanvasScrollRef} className="flex-grow overflow-y-auto pr-1">
              {activeTab === 'viz' ? (
                renderVisualizationLogs()
              ) : (
                renderSqlLogs()
              )}
            </div>

          </div>

        </div>

      </div>

      {/* 4. Mobile Drawer Canvas Overlay (Slides open when Canvas button is clicked) */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-[420px] bg-[#F8F9FC] border-l border-grey-100 shadow-[20px_0_50px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden transition-transform duration-500 ease-in-out transform ${isCanvasDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:hidden`}>
        {/* Drawer Mobile Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-grey-100 bg-white flex-shrink-0">
          <div className="flex flex-col text-left">
            <h3 className="text-sm font-bold text-grey-1200 font-heading">Session Canvas</h3>
            <span className="text-[10px] text-grey-800 font-semibold">{sessionId}</span>
          </div>
          <button
            onClick={() => setIsCanvasDrawerOpen(false)}
            className="text-grey-800 hover:text-grey-1200 p-1.5 hover:bg-grey-50 rounded-lg cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Drawer Tabs Select */}
        <div className="px-5 py-3 border-b border-grey-100 bg-white flex-shrink-0">
          <div className="flex items-center bg-[#F0F1F5] p-1 rounded-full w-full">
            <button
              onClick={() => setActiveTab('viz')}
              className={`flex-grow py-2.5 rounded-full text-[10px] font-bold tracking-tight transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'viz' ? 'bg-white text-[#121317] shadow-xs' : 'text-grey-800 hover:text-[#121317]'
                }`}
            >
              <FloatingCanvasIcon />
              <span>Visualizations</span>
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`flex-grow py-2.5 rounded-full text-[10px] font-bold tracking-tight transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'sql' ? 'bg-white text-[#121317] shadow-xs' : 'text-grey-800 hover:text-[#121317]'
                }`}
            >
              <span>Generated SQL</span>
            </button>
          </div>
        </div>

        {/* Drawer Body Scroll */}
        <div ref={mobileCanvasScrollRef} className="flex-grow overflow-y-auto p-5">
          {activeTab === 'viz' ? (
            renderVisualizationLogs()
          ) : (
            renderSqlLogs()
          )}
        </div>
      </div>

      {/* 5. Settings Modal (Shared Dialog Trigger) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
          <div className="bg-white border border-grey-100 w-full max-w-sm rounded-[32px] p-6 shadow-xl animate-[fadeIn_0.2s_ease-out] text-left mx-4">
            <div className="flex justify-between items-center border-b border-grey-50 pb-3 mb-4">
              <h3 className="font-heading text-sm font-bold text-grey-1200">Workspace Settings</h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-grey-800 hover:text-grey-1200 p-1 hover:bg-grey-50 rounded-lg cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs font-semibold">
              <div className="flex flex-col gap-1.5">
                <span className="text-grey-800">Antigravity AI Model Selection</span>
                <select className="w-full bg-[#F8F9FC] border border-grey-100 rounded-xl px-3 py-2 text-grey-1200 outline-none font-medium">
                  <option>Gemini 1.5 Pro (Analytical Optimization)</option>
                  <option>Gemini 1.5 Flash (Latency Mode)</option>
                  <option>Antigravity Experimental CodeGen-v2</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-grey-800">SQL Dialect Compiler</span>
                <select className="w-full bg-[#F8F9FC] border border-grey-100 rounded-xl px-3 py-2 text-grey-1200 outline-none font-medium">
                  <option>PostgreSQL (Standard)</option>
                  <option>Google BigQuery SQL</option>
                  <option>Snowflake SQL</option>
                  <option>MySQL / SQLite</option>
                </select>
              </div>

              <div className="flex items-center justify-between border-t border-grey-50 pt-4 mt-2">
                <span className="text-grey-800 text-[10px] font-medium font-mono">v1.0.4-antigravity</span>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="bg-[#121317] hover:bg-grey-900 text-white px-5 py-2 rounded-full font-bold cursor-pointer transition-colors text-[11px]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
