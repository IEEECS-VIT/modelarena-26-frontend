"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/Toast";
import { RiGithubFill, RiFileTextLine, RiLoader4Line } from "react-icons/ri";

interface Submission {
  id: number;
  teamName: string;
  csv: string;
  githubLink: string;
  calculatedScore: number;
  createdAt: string;
}

export default function SubmitPage() {
  const { session, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [githubLink, setGithubLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Fetch submissions
  const fetchSubmissions = useCallback(async () => {
    if (!session?.access_token) return;

    try {
      const res = await fetch(`${API_URL}/submission`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoadingSubmissions(false);
    }
  }, [session, API_URL]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated, fetchSubmissions]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".csv")) {
      setFile(droppedFile);
    } else {
      toast.error("Only .csv files are accepted");
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const submitFile = async () => {
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }

    if (!githubLink.trim()) {
      toast.error("Please provide a GitHub repository link");
      return;
    }

    if (!session?.access_token) {
      toast.error("Authentication required");
      return;
    }

    const formData = new FormData();
    formData.append("githubLink", githubLink);
    formData.append("csv", file);

    try {
      setIsSubmitting(true);

      const res = await fetch(`${API_URL}/submission`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Submission failed");
      }

      toast.success(`Submission successful! Score: ${data.score}`);
      setFile(null);
      setGithubLink("");
      fetchSubmissions(); // Refresh list
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(err.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full bg-black pt-24 px-6 md:px-12 font-mono pb-20">
        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-widest mb-12 text-center">
            <span className="text-[#CCFF00]">&gt;SUBMISSION_CONSOLE</span>
            <span className="text-white/50">//</span>
            <span className="text-white">INJECT_CSV</span>
          </h1>

          <div className="grid gap-8 mb-16">
            {/* GITHUB LINK INPUT */}
            <div className="bg-neutral-900/50 border border-[#CCFF00]/30 rounded-lg p-6">
              <label className="block text-white/70 text-sm tracking-widest mb-4">
                &gt; SOURCE_CODE_REPOSITORY (GITHUB)
              </label>
              <div className="flex items-center bg-black border border-neutral-700 rounded px-4 py-3 focus-within:border-[#CCFF00] transition-colors">
                <RiGithubFill className="text-white/50 w-6 h-6 mr-3" />
                <input
                  type="url"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="bg-transparent border-none text-white w-full focus:outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            {/* FILE UPLOAD AREA */}
            <div className="relative">
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#CCFF00] rounded-t-lg"></div>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  bg-neutral-900 border-2 rounded-lg pt-8 pb-12 px-8 cursor-pointer
                  transition-all duration-200 min-h-[250px] flex flex-col justify-center
                  ${isDragging
                    ? "border-[#CCFF00] shadow-[0_0_30px_rgba(204,255,0,0.3)]"
                    : "border-[#CCFF00]/30 hover:border-[#CCFF00]"
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="text-left flex flex-col items-center justify-center h-full">
                  <RiFileTextLine className={`w-12 h-12 mb-4 ${file ? 'text-[#CCFF00]' : 'text-white/30'}`} />

                  <div className="text-center">
                    <span className="text-white/70 text-sm tracking-widest block mb-2">&gt;_TARGET_SOURCE</span>
                    {file ? (
                      <span className="text-[#CCFF00] text-lg font-bold bg-[#CCFF00]/10 px-4 py-2 rounded border border-[#CCFF00]/30 block">
                        {file.name}
                      </span>
                    ) : (
                      <span className="text-white/40 text-sm">
                        [CLICK_TO_BROWSE_OR_DRAG_FILE...]
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* REQUIREMENTS */}
          <div className="flex flex-col md:flex-row justify-between text-xs text-white/40 mb-8 tracking-wider gap-2">
            <span>//REQ: format=.csv, columns=[video_label, label/probability]</span>
            <span>//MAX_SIZE: 10MB</span>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-center mb-16">
            <button
              onClick={submitFile}
              disabled={isSubmitting || !file || !githubLink.trim()}
              className="bg-[#CCFF00] text-black px-12 py-4 rounded font-bold tracking-widest hover:bg-[#b8e600] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {isSubmitting && <RiLoader4Line className="animate-spin w-5 h-5" />}
              {isSubmitting ? "[TRANSMITTING...]" : "[EXECUTE_UPLOAD]"}
            </button>
          </div>

          {/* RECENT TRANSMISSIONS LOG */}
          <div className="bg-neutral-900/50 border border-[#9333EA]/50 rounded-lg p-6 shadow-[0_0_20px_rgba(147,51,234,0.1)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white/70 text-sm tracking-widest">RECENT_TRANSMISSIONS_LOG</h2>
              {loadingSubmissions && <RiLoader4Line className="text-[#9333EA] animate-spin" />}
            </div>

            <div className="space-y-3">
              {!loadingSubmissions && submissions.length > 0 ? (
                submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="grid grid-cols-1 md:grid-cols-4 items-center p-4 rounded border-l-4 bg-neutral-800/50 border border-[#9333EA]/30 border-l-[#9333EA] gap-2"
                  >
                    <div className="flex flex-col">
                      <span className="text-[#9333EA] text-xs tracking-widest mb-1">ID</span>
                      <span className="text-white font-mono">#{sub.id.toString().padStart(4, '0')}</span>
                    </div>

                    <div className="flex flex-col md:col-span-2">
                      <span className="text-white/40 text-xs tracking-widest mb-1">TIMESTAMP</span>
                      <span className="text-white/70 text-sm">{formatDate(sub.createdAt)}</span>

                      {sub.githubLink && (
                        <a href={sub.githubLink} target="_blank" rel="noopener noreferrer" className="text-[#CCFF00] text-xs mt-1 hover:underline truncate">
                          {sub.githubLink}
                        </a>
                      )}
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-white/40 text-xs tracking-widest mb-1">SCORE</span>
                      <span className="text-[#CCFF00] text-xl font-bold">
                        {sub.calculatedScore.toFixed(4)}
                      </span>
                    </div>
                  </div>
                ))
              ) : !loadingSubmissions ? (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-lg">
                  <p className="text-white/30 mb-2">NO_TRANSMISSIONS_FOUND</p>
                  <p className="text-white/20 text-xs">Execute upload to initialize log</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
