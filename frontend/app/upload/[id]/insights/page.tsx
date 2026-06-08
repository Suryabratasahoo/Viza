'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { api } from '@/services/api';

// --- Custom SVGs for UI Icons ---

const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const SparkIcon = ({ className = "text-blue-500 fill-blue-500 w-4 h-4" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
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

const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const DatabaseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);


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
export default function DatasetInsightsPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.id as string || 'session-default';

  // Navigation sidebar & settings states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dataset, setDataset] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  console.log("------------------------------------")
  console.log("inside the insights page")
  console.log(dataset);
  const handleChatWithData = () => {
    // Generate a matching chat session with matching session ID
    router.push(`/chat/${sessionId}`);
  };

  useEffect(() => {

    const loadDataset = async () => {

      try {

        const sessionResponse =
          await api.get(
            `/chat-sessions/${sessionId}`
          );

        const datasetId =
          sessionResponse.data
            .session
            .dataset_id;

        const datasetResponse =
          await api.get(
            `/datasets/${datasetId}`
          );

        setDataset({

          ...datasetResponse.data.dataset,

          columns:
            datasetResponse.data.schema

        });

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }
    };

    if (sessionId) {

      loadDataset();

    }

  }, [sessionId]);

  if (loading) {
  return (
    <div className="h-screen flex items-center justify-center">
      Loading dataset...
    </div>
  );
}


if (!loading && !dataset) {
  return (
    <div className="h-screen flex items-center justify-center">
      Dataset not found
    </div>
  );
}

  return (
    

    <div className="relative min-h-screen flex text-grey-1200 bg-[#FFFFFF] font-sans antialiased overflow-hidden select-none">

      {/* Navigation Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Insights Content Workspace */}
      <div className="flex-grow min-h-screen flex flex-col md:pl-[260px] bg-[#FFFFFF] h-screen overflow-y-auto z-10 relative">

        {/* Top Navbar */}
        <header className="sticky top-0 right-0 z-20 h-[52px] bg-white/70 backdrop-blur-md border-b border-grey-100/40 flex items-center justify-between px-6 md:px-10 flex-shrink-0">
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
              <span className="opacity-60">Insights</span>
              <span className="opacity-40">/</span>
              <span className="text-grey-1200 truncate max-w-[120px] sm:max-w-none">{dataset?.filename}</span>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#121317] text-white flex items-center justify-center text-xs font-bold shadow-sm">
            S
          </div>
        </header>

        {/* Content Panel Area */}
        <main className="flex-grow p-6 md:p-10 max-w-[1000px] mx-auto w-full flex flex-col gap-8 text-left">

          {/* Heading */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <SparkIcon className="text-blue-500 fill-blue-500 w-3.5 h-3.5" />
              <span>Google Antigravity Indexer</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-[#121317] font-heading leading-tight">
              Dataset Specifications
            </h1>
            <p className="text-xs text-grey-800 font-medium leading-relaxed max-w-2xl">
              Analysis compiled successfully. Here is the metadata, columns structure table, and observed correlations for <code>{sessionId}</code>.
            </p>
          </div>

          {/* 1. Top specifications row cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-grey-100 rounded-[24px] p-5 shadow-2xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <DatabaseIcon />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-grey-800 uppercase tracking-widest leading-none">Total Rows</span>
                <span className="text-xl font-bold text-grey-1200 mt-1">{dataset?.rows ?? 0}</span>
                <span className="text-[9px] text-grey-800 font-medium">Records loaded</span>
              </div>
            </div>

            <div className="bg-white border border-grey-100 rounded-[24px] p-5 shadow-2xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <GridIcon />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-grey-800 uppercase tracking-widest leading-none">Total Columns</span>
                <span className="text-xl font-bold text-grey-1200 mt-1">{dataset?.columns?.length ?? 0} Fields</span>
                <span className="text-[9px] text-grey-800 font-medium">Schema columns</span>
              </div>
            </div>

            <div className="bg-white border border-grey-100 rounded-[24px] p-5 shadow-2xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                <SparkIcon className="text-yellow-600 fill-yellow-600 w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-grey-800 uppercase tracking-widest leading-none">File Grid Size</span>
                <span className="text-xl font-bold text-grey-1200 mt-1">{dataset?.columns?.length && dataset?.rows
                  ? dataset.columns.length * dataset.rows
                  : 0} cells</span>
                <span className="text-[9px] text-grey-800 font-medium">Indexed dimensions</span>
              </div>
            </div>
          </div>

          {/* 2. Split view layout: Left Table Structure vs Right AI Analytics Correlation Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

            {/* Table structure table card (3/5 width) */}
            <div className="bg-white border border-grey-100 rounded-[32px] p-5 shadow-xs lg:col-span-3 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-grey-50 pb-3">
                <div className="flex flex-col">
                  <h3 className="text-xs font-bold text-[#121317] uppercase tracking-wider font-sans">
                    Table Schema structure
                  </h3>
                  <span className="text-[9px] text-grey-800 font-medium">Detected dataset headers and data types</span>
                </div>
                <span className="bg-green-50 text-green-600 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-green-150">
                  100% complete
                </span>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-grey-100 text-grey-850 font-bold bg-[#F8F9FC]/60">
                      <th className="py-2.5 px-3 text-left font-mono">
                        Column Name
                      </th>

                      <th className="py-2.5 px-3 text-left">
                        Data Type
                      </th>

                      <th className="py-2.5 px-3 text-left">
                        Semantic Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-grey-50">
                    {dataset?.columns?.map((column) => (
                      <tr
                        key={column.name}
                        className="hover:bg-grey-50/50 transition-colors"
                      >
                        <td className="py-3 px-3 font-mono font-bold text-[#121317]">
                          {column.name}
                        </td>

                        <td className="py-3 px-3 text-grey-1000 font-semibold">
                          {column.dtype}
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-1 rounded-md text-[10px] font-semibold uppercase
          ${column.role === "measure"
                                ? "bg-green-100 text-green-700"
                                : column.role === "dimension"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                          >
                            {column.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Insights analytics column (2/5 width) */}
            <div className="lg:col-span-2 flex flex-col gap-4">

              

              {/* Quick Start suggestions cards */}
              <div className="bg-gradient-to-br from-[#121317] to-grey-900 text-white rounded-[32px] p-5 shadow-sm text-left flex flex-col gap-3">
                <span className="text-[8px] font-bold text-[#EA4335] uppercase tracking-widest">Natural Language compiles</span>
                <h4 className="font-heading text-sm font-bold leading-tight">Ready to chat with your data?</h4>
                <p className="text-[10px] text-grey-300 leading-relaxed font-medium">
                  Proceed to the workspace console to ask questions, run SQL codes, and draw graphs dynamically based on this schema.
                </p>
              </div>

            </div>

          </div>

          {/* 3. Action bar actions footer */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-3.5 border-t border-grey-100 pt-6 mt-4">
            <button
              onClick={() => router.push('/upload')}
              className="border border-grey-200 hover:bg-grey-50 text-grey-800 font-bold py-2.5 px-6 rounded-full text-xs cursor-pointer shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeftIcon />
              <span>Upload Another Dataset</span>
            </button>
            <button
              onClick={handleChatWithData}
              className="bg-[#121317] hover:bg-grey-900 text-white font-bold py-2.5 px-8 rounded-full text-xs cursor-pointer shadow-sm hover:scale-[1.02] transition-transform flex items-center gap-1.5"
            >
              <span>Chat with Data</span>
              <ChevronRightIcon />
            </button>
          </div>

        </main>
      </div>

      {/* Settings Modal (Workspace Settings) */}
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
