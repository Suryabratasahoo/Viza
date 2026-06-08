'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useSessions } from '@/hooks/useSessions';
import { uploadCsv } from '@/services/upload.service';
import { createSession } from '@/services/ChatSession.service';
import { updateProfile } from '@/services/auth.service';
// --- Custom SVGs for UI Icons ---

const UploadCloudIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const FileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-grey-800">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
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

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

interface UploadedFile {
  file: File;
  name: string;
  size: string;
}

type UploadedDataset = Record<string, unknown>;

export default function UploadPage() {
  const router = useRouter();

  // Sidebar navigation states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { sessions } = useSessions();
  const [dataset, setDataset] =
    useState<any>(null);

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

  // Sync temp variables when modal opens or userProfile changes
  useEffect(() => {
    if (userProfile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTempName(userProfile.name);
      setTempEmail(userProfile.email);
    }
  }, [userProfile, isSettingsOpen]);

  const handleSaveProfile = async (e: React.FormEvent) => {
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
    } finally {
      setIsSavingProfile(false);
    }
  };

  // File upload states
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [
    uploadedDatasets,
    setUploadedDatasets
  ] = useState<UploadedDataset[]>([]);
  // Scanning canvas drawer states
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'complete' | 'error'>('idle');
  const [checklist, setChecklist] = useState([
    { label: 'Upload dataset to cloud', status: 'pending' },
    { label: 'Read and parse database schema', status: 'pending' },
    { label: 'Verify relational data integrity', status: 'pending' },
    { label: 'Extract summary descriptive statistics', status: 'pending' }
  ]);
  const [activeCheckIndex, setActiveCheckIndex] = useState(0);

  // Canvas ref for scanning laser animation
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  const addFiles = (
    filesList: FileList
  ) => {

    const file =
      filesList[0];

    if (!file) return;

    const sizeKB =
      (file.size / 1024).toFixed(1);

    const sizeStr =
      parseFloat(sizeKB) > 1024
        ? `${(
          parseFloat(sizeKB) / 1024
        ).toFixed(1)} MB`
        : `${sizeKB} KB`;

    setSelectedFile({
      file,
      name: file.name,
      size: sizeStr
    });
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFile(null);
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  // Start Scanning flow
  const handleStartScan = async () => {

    try {

      setScanStatus("scanning");

      if (!selectedFile) return;

      const response =
        await uploadCsv(
          selectedFile.file
        );
      setDataset(response);


      setScanStatus("complete");

    } catch (error) {

      console.error(error);

      setScanStatus("error");
    }
  };

  // Checklist sequence effect
  useEffect(() => {
    if (scanStatus !== 'scanning') return;

    const intervalTime = 1600; // Duration per checklist item
    const timer = setTimeout(() => {
      setChecklist((prev) => {
        const next = [...prev];
        next[activeCheckIndex].status = 'success';

        const nextIndex = activeCheckIndex + 1;
        if (nextIndex < next.length) {
          next[nextIndex].status = 'loading';
          setActiveCheckIndex(nextIndex);
        } else {
          setScanStatus('complete');
        }
        return next;
      });
    }, intervalTime);

    return () => clearTimeout(timer);
  }, [scanStatus, activeCheckIndex]);

  // Canvas page and table scanning animation
  useEffect(() => {
    if (scanStatus !== 'scanning') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Document dimensions (centered page sheet representation)
    const pageW = Math.min(width * 0.8, 300);
    const pageH = Math.min(height * 0.75, 130);
    const pageX = (width - pageW) / 2;
    const pageY = (height - pageH) / 2;

    // Laser beam vertical coordinate relative to canvas
    let yLaser = pageY;
    let laserDirection = 1; // 1 = down, -1 = up

    // Mock data cell structures for the table
    const cols = 5;
    const rows = 6;
    const colW = pageW / cols;
    const rowH = pageH / rows;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      size: number;
    }

    const particles: Particle[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['rgba(66, 133, 244, ', 'rgba(234, 67, 53, ', 'rgba(251, 188, 5, ', 'rgba(52, 168, 83, '];

    const animate = () => {
      // Clear canvas with standard clean transparent background
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Page Sheet Background (represented as a card sheet)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(pageX, pageY, pageW, pageH, 8);
      } else {
        ctx.rect(pageX, pageY, pageW, pageH);
      }
      ctx.fill();

      // Page border shadow
      ctx.strokeStyle = 'rgba(18, 19, 23, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. Draw Table Rows & Columns
      for (let r = 0; r < rows; r++) {
        const curRowY = pageY + r * rowH;

        // Highlight row currently under the scan beam
        const isRowScanning = yLaser >= curRowY && yLaser <= curRowY + rowH;
        const isRowScanned = yLaser > curRowY + rowH;

        // Draw Row background
        if (isRowScanning) {
          ctx.fillStyle = 'rgba(66, 133, 244, 0.06)'; // scanning blue highlight
          ctx.fillRect(pageX + 1, curRowY + 1, pageW - 2, rowH - 2);
        } else if (isRowScanned) {
          ctx.fillStyle = 'rgba(52, 168, 83, 0.02)'; // scanned green tint
          ctx.fillRect(pageX + 1, curRowY + 1, pageW - 2, rowH - 2);
        } else {
          ctx.fillStyle = r === 0 ? '#F8F9FC' : '#FFFFFF'; // header vs body
          ctx.fillRect(pageX + 1, curRowY + 1, pageW - 2, rowH - 2);
        }

        // Draw Table Cell contents (simulated text or numbers)
        for (let c = 0; c < cols; c++) {
          const curColX = pageX + c * colW;

          if (r === 0) {
            // Header text blocks
            ctx.fillStyle = 'rgba(47, 48, 52, 0.6)';
            ctx.fillRect(curColX + 6, curRowY + 6, colW - 12, 4);
          } else {
            // Normal table cell content blocks
            const isScannedCell = yLaser > curRowY + rowH;

            if (isScannedCell) {
              // Scanned columns turn into colored data indicators
              ctx.fillStyle = colors[c % colors.length] + '0.45)';
            } else {
              // Unscanned grey text
              ctx.fillStyle = 'rgba(178, 187, 197, 0.35)';
            }

            // Draw mock text lines
            ctx.fillRect(curColX + 8, curRowY + 8, colW - 16, 3);
            if (c % 2 === 0) {
              ctx.fillRect(curColX + 8, curRowY + 14, (colW - 16) * 0.6, 2);
            }
          }
        }
      }

      // Draw Grid line borders
      ctx.strokeStyle = 'rgba(205, 212, 220, 0.4)';
      ctx.lineWidth = 0.5;

      // Draw horizontal line bounds
      for (let r = 1; r < rows; r++) {
        ctx.beginPath();
        ctx.moveTo(pageX, pageY + r * rowH);
        ctx.lineTo(pageX + pageW, pageY + r * rowH);
        ctx.stroke();
      }
      // Draw vertical column bounds
      for (let c = 1; c < cols; c++) {
        ctx.beginPath();
        ctx.moveTo(pageX + c * colW, pageY);
        ctx.lineTo(pageX + c * colW, pageY + pageH);
        ctx.stroke();
      }

      // 3. Update & Animate Laser scanner beam
      yLaser += 1.2 * laserDirection;
      if (yLaser > pageY + pageH || yLaser < pageY) {
        laserDirection = -laserDirection;
      }

      // Generate scanning sparks at the beam intersection
      if (Math.random() > 0.4) {
        particles.push({
          x: pageX + Math.random() * pageW,
          y: yLaser,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() * 0.5 + 0.2) * (laserDirection * -1), // float opposite to direction
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.8,
          size: 1.0 + Math.random() * 1.5
        });
      }

      // Render flowing scanning particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.015;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        if (p.alpha <= 0) {
          particles.splice(idx, 1);
        }
      });

      // 4. Draw Glowing scanner laser line
      const laserGradient = ctx.createLinearGradient(0, yLaser - 4, 0, yLaser + 4);
      laserGradient.addColorStop(0, 'rgba(66, 133, 244, 0)');
      laserGradient.addColorStop(0.5, 'rgba(66, 133, 244, 0.9)'); // bright blue scanner
      laserGradient.addColorStop(1, 'rgba(52, 168, 83, 0)'); // green sweep tail

      ctx.fillStyle = laserGradient;
      ctx.fillRect(pageX - 4, yLaser - 5, pageW + 8, 10);

      // Laser caps (bright green highlights at endpoints)
      ctx.fillStyle = '#34A853';
      ctx.beginPath();
      ctx.arc(pageX, yLaser, 2.5, 0, Math.PI * 2);
      ctx.arc(pageX + pageW, yLaser, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 5. Digital UI Overlay metadata
      ctx.font = '8px monospace';
      ctx.fillStyle = 'rgba(47, 48, 52, 0.6)';
      const scanPercentage = Math.round(((yLaser - pageY) / pageH) * 100);
      ctx.fillText(`TABLE SCAN: ${scanPercentage}%`, pageX, pageY - 6);
      ctx.fillText(`MAPPED COLS: ${cols}`, pageX + pageW - 75, pageY - 6);

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [scanStatus]);

  const handleViewInsights = async () => {
    // Generate a mock random session ID and navigate to insights
    const session = await createSession({ dataset_id: dataset.dataset_id });
    console.log('Created session:', session);
    router.push(
      `/upload/${session.session_id}/insights`
    );

  };

  return (
    <div className="relative min-h-screen flex text-grey-1200 bg-[#FFFFFF] font-sans antialiased overflow-hidden select-none">

      {/* Navigation Sidebar */}
      <Sidebar
        sessions={sessions}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Upload Workspace Content */}
      <div className="flex-grow min-h-screen flex flex-col md:pl-[260px] bg-[#FFFFFF]">

        {/* Workspace Top navbar */}
        <header className="sticky top-0 right-0 z-20 h-[52px] bg-white/70 backdrop-blur-md border-b border-grey-100/40 flex items-center justify-between px-6 md:px-10">
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
              <span className="text-grey-1200">New Analysis</span>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#121317] text-white flex items-center justify-center text-xs font-bold shadow-sm">
            S
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow p-6 md:p-10 max-w-[800px] mx-auto w-full flex flex-col justify-center gap-8 text-left">

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tighter text-[#121317] font-heading leading-none">
              Upload Datasets
            </h1>
            <p className="text-xs text-grey-800 font-medium leading-relaxed">
              Analyze metrics, build models, and ask questions about your spreadsheets. Select one or more datasets to compile.
            </p>
          </div>

          {/* Upload Drop Zone Box */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-[32px] p-10 md:p-14 text-center cursor-pointer transition-all duration-300 ${dragActive
              ? 'border-blue-500 bg-blue-50/10'
              : 'border-grey-200 bg-[#F8F9FC] hover:border-grey-300 hover:bg-[#F0F1F5]/40'
              }`}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
                <UploadCloudIcon />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-grey-1200">
                  Drag and drop files here, or{' '}
                  <span onClick={triggerBrowse} className="text-blue-600 hover:underline">
                    browse files
                  </span>
                </p>
                <p className="text-[10px] text-grey-800 font-medium">
                  Supports CSV, Excel (XLSX/XLS), and JSON format sheets
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Selected Files List */}
          {selectedFile && (
            <div className="flex flex-col gap-3 animate-[fadeIn_0.2s_ease-out]">
              <span className="text-[9px] font-bold text-grey-800 uppercase tracking-widest ml-1">
                Selected Dataset ({selectedFile.name})
              </span>
              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto border border-grey-100/60 rounded-2xl p-3 bg-white shadow-sm">
                <div
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">

                    <FileIcon />

                    <div>
                      <p>
                        {selectedFile?.name}
                      </p>

                      <p>
                        {selectedFile?.size}
                      </p>
                    </div>

                  </div>

                  <button
                    onClick={() =>
                      setSelectedFile(null)
                    }
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex justify-end gap-3.5 mt-3">
                <button
                  onClick={() => setSelectedFile(null)}
                  className="border border-grey-200 hover:bg-grey-50 text-grey-800 font-semibold py-2 px-6 rounded-full text-xs cursor-pointer shadow-sm"
                >
                  Clear All
                </button>
                <button
                  onClick={handleStartScan}
                  className="bg-[#121317] hover:bg-grey-900 text-white font-semibold py-2 px-8 rounded-full text-xs cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
                >
                  Scan Datasets
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* --- SLIDING SCANNING DRAWER --- */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-[480px] bg-white border-r border-grey-100 shadow-[20px_0_50px_rgba(0,0,0,0.12)] flex flex-col justify-between overflow-hidden transition-transform duration-500 ease-in-out transform ${scanStatus !== 'idle' ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-grey-100 bg-[#F8F9FC]">
          <div className="flex flex-col text-left">
            <h3 className="text-sm font-bold text-grey-1200 font-heading">
              {scanStatus === 'scanning' ? 'Scanning Datasets...' : 'Analysis Complete'}
            </h3>
            <span className="text-[10px] text-grey-800 font-semibold">
              Antigravity AI Schema Compiler
            </span>
          </div>
          {scanStatus === 'complete' && (
            <button
              onClick={() => {
                setScanStatus('idle');
                setSelectedFile(null);
              }}
              className="text-grey-800 hover:text-grey-1200 p-1.5 hover:bg-grey-50 rounded-lg cursor-pointer"
            >
              <CloseIcon />
            </button>
          )}
        </div>

        {/* Content area */}
        <div className="flex-grow flex flex-col overflow-y-auto">

          {/* 1. Animation Canvas container */}
          {scanStatus === 'scanning' && (
            <div className="w-full h-44 relative bg-white border-b border-grey-50">
              <canvas ref={canvasRef} className="w-full h-full block" />
            </div>
          )}

          {/* 2. Checklist / Status Tracker */}
          <div className="p-6 flex flex-col gap-4 text-left">
            <span className="text-[9px] font-bold text-grey-800 uppercase tracking-widest ml-1">
              Process Logs
            </span>
            <div className="flex flex-col gap-3">
              {checklist.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  {step.status === 'success' ? (
                    <div className="w-4 h-4 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
                      <CheckIcon />
                    </div>
                  ) : step.status === 'loading' ? (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-grey-50 border border-grey-100 flex-shrink-0" />
                  )}
                  <span className={`text-[11px] font-semibold transition-colors ${step.status === 'success' ? 'text-grey-1200 font-bold' :
                    step.status === 'loading' ? 'text-blue-600 font-bold' : 'text-grey-800 opacity-60'
                    }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Schema Information Metadata Panel (appears on complete) */}
          {scanStatus === 'complete' && (
            <div className="p-6 border-t border-grey-100 bg-[#F8F9FC]/30 flex flex-col gap-6 text-left animate-[fadeIn_0.5s_ease-out]">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shadow-xs mx-auto mb-2">
                <CheckIcon />
              </div>
              <div className="flex flex-col gap-2 text-center max-w-sm mx-auto">
                <h4 className="text-sm font-bold text-[#121317] font-heading">Dataset Indexing Complete!</h4>
                <p className="text-[11px] text-grey-800 leading-relaxed font-semibold">
                  Antigravity AI completed the analysis checklist and parsed **14,240 records** across all uploaded sheets.
                </p>
                <p className="text-[10px] text-grey-800/80 leading-relaxed font-medium">
                  We detected standard relational data models. Click below to view the detailed table configurations, types, and correlation statistics before chatting.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer actions */}
        <div className="p-4 bg-white border-t border-grey-100 flex justify-end">
          {scanStatus === 'complete' ? (
            <button
              onClick={handleViewInsights}
              className="btn-curvy-fill w-full border border-grey-200 font-semibold py-3 rounded-full text-xs md:text-sm cursor-pointer shadow-sm hover:scale-[1.02] flex items-center justify-center gap-1.5"
            >
              <span className="relative z-10">View Data Insights</span>
            </button>
          ) : (
            <button
              disabled
              className="bg-grey-50 border border-grey-100 text-grey-800 opacity-60 font-semibold py-3 rounded-full text-xs md:text-sm w-full cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <span>Indexing Datasets...</span>
            </button>
          )}
        </div>

      </div>

      {/* Settings Modal */}
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
    </div>
  );
}
