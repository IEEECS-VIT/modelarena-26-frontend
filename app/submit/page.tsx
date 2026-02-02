"use client";

import { useState, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";

interface Submission {
  version: string;
  filename: string;
  status: "ACTIVE" | "STALE";
}

export default function SubmitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock previous submissions
  const [submissions] = useState<Submission[]>([
    { version: "v2.0", filename: "final.csv", status: "ACTIVE" },
    { version: "v1.0", filename: "test.csv", status: "STALE" },
  ]);

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
      setMessage("");
    } else {
      setMessage("ERROR: Only .csv files accepted");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage("");
    }
  };

  const submitFile = async () => {
    if (!file) {
      setMessage("ERROR: No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("TRANSMITTING...");

      const res = await fetch("https://api.modelarena.com/submit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      setMessage("TRANSMISSION_COMPLETE ✓");
      setFile(null);
    } catch (err) {
      setMessage("TRANSMISSION_FAILED ✗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar isLoggedIn={true} />
      <main className="min-h-screen w-full bg-black pt-24 px-6 md:px-12 font-mono">
        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-widest mb-12 text-center">
            <span className="text-[#CCFF00]">&gt;SUBMISSION_CONSOLE</span>
            <span className="text-white/50">//</span>
            <span className="text-white">INJECT_CSV</span>
          </h1>

          {/* FILE UPLOAD AREA */}
          <div className="relative mb-4">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#CCFF00] rounded-t-lg"></div>

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
                  : "border-[#CCFF00]/50 hover:border-[#CCFF00]"
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

              <div className="text-left">
                <span className="text-white/70">&gt;_TARGET_SOURCE: </span>
                {file ? (
                  <span className="text-[#CCFF00]">{file.name}</span>
                ) : (
                  <span className="text-[#CCFF00]">[CLICK_TO_BROWSE_OR_DRAG_FILE...]</span>
                )}
              </div>

              <div className="mt-4 text-[#CCFF00] animate-pulse text-xl">|</div>

              {message && (
                <div className={`mt-6 tracking-widest ${message.includes("ERROR") || message.includes("FAILED")
                  ? "text-red-500"
                  : message.includes("COMPLETE")
                    ? "text-[#CCFF00]"
                    : "text-white/70"
                  }`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* REQUIREMENTS */}
          <div className="flex justify-between text-xs text-white/50 mb-8 tracking-wider">
            <span>//REQ: format=.csv, columns=[id, prediction]</span>
            <span>//MAX_SIZE: 10MB</span>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-center mb-16">
            <button
              onClick={submitFile}
              disabled={loading || !file}
              className="bg-[#CCFF00] text-black px-10 py-4 rounded font-bold tracking-widest hover:bg-[#b8e600] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "[TRANSMITTING...]" : "[EXECUTE_UPLOAD]"}
            </button>
          </div>

          {/* RECENT TRANSMISSIONS LOG */}
          <div className="bg-neutral-900/50 border border-[#9333EA]/50 rounded-lg p-6 shadow-[0_0_20px_rgba(147,51,234,0.1)]">
            <h2 className="text-white/70 text-sm mb-6 tracking-widest">RECENT_TRANSMISSIONS_LOG</h2>

            <div className="space-y-3">
              {submissions.map((sub, index) => (
                <div
                  key={index}
                  className={`
                    grid grid-cols-3 items-center p-4 rounded border-l-4
                    ${sub.status === "ACTIVE"
                      ? "bg-[#CCFF00]/10 border border-[#CCFF00]/30 border-l-[#CCFF00]"
                      : "bg-neutral-800/50 border border-[#9333EA]/30 border-l-[#9333EA]"
                    }
                  `}
                >
                  <span className={`tracking-widest ${sub.status === "ACTIVE" ? "text-[#CCFF00]" : "text-[#9333EA]"}`}>
                    &gt; {sub.version}
                  </span>
                  <span className="text-white/70 text-center">{sub.filename}</span>
                  <span className={`text-right tracking-widest ${sub.status === "ACTIVE" ? "text-[#CCFF00]" : "text-white/40"
                    }`}>
                    [{sub.status}]
                  </span>
                </div>
              ))}

              {submissions.length === 0 && (
                <p className="text-white/30 text-center py-8">NO_TRANSMISSIONS_FOUND</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
