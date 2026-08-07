"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import CodeEditor from "../components/CodeEditor";
import FeedbackCard from "../components/FeedbackCard";
import DiffModal from "../components/DiffModal";
import { ReviewResult } from "../types";
import { Play, Loader2, Sparkles, Cpu } from "lucide-react";

export default function Home() {
  const [code, setCode] = useState<string>(
    `// Paste your code here to review\nfunction calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}`,
  );
  const [language, setLanguage] = useState<string>("javascript");
  const [mode, setMode] = useState<string>("general");
  const [loading, setLoading] = useState<boolean>(false);
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDiffOpen, setIsDiffOpen] = useState<boolean>(false);

  const handleReview = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, mode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to review code");
      }

      setReview(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6 lg:flex-row">
        {/* Left Column: Editor & Controls */}
        <div className="flex h-[620px] flex-col gap-4 lg:w-1/2">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
          />

          {/* Review Mode Persona Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-gray-800 bg-gray-900/80 p-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-medium text-gray-300">
                AI Review Persona:
              </span>
            </div>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-xs font-medium text-gray-200 outline-none transition focus:border-blue-500"
            >
              <option value="general">
                👔 Senior Architect (Comprehensive)
              </option>
              <option value="security">
                🛡️ Security Auditor (OWASP Strict)
              </option>
              <option value="performance">
                ⚡ Performance & Big-O Optimizer
              </option>
            </select>
          </div>

          <button
            onClick={handleReview}
            disabled={loading}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 shadow-lg shadow-blue-600/20"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>AI is Analyzing Code...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Review Code</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Feedback Area */}
        <div className="flex h-[620px] flex-col lg:w-1/2">
          {error && (
            <div className="mb-4 rounded-xl border border-red-800/50 bg-red-950/30 p-4 text-xs text-red-300">
              {error}
            </div>
          )}

          {review ? (
            <FeedbackCard
              review={review}
              onApplyRefactor={(newCode) => setCode(newCode)}
              onOpenDiff={() => setIsDiffOpen(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-gray-800 bg-gray-900 p-6 text-center text-gray-500">
              <Sparkles className="mb-3 h-10 w-10 text-gray-700 animate-pulse" />
              <p className="text-sm font-medium text-gray-400">
                Ready for AI Review
              </p>
              <p className="mt-1 max-w-xs text-xs text-gray-600">
                Choose an AI Persona, paste your code on the left, and click
                &quot;Review Code&quot; to get tailored feedback.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Side-by-Side Diff Modal */}
      {review && (
        <DiffModal
          isOpen={isDiffOpen}
          onClose={() => setIsDiffOpen(false)}
          originalCode={code}
          refactoredCode={review.refactoredCode}
          language={language}
          onApply={() => setCode(review.refactoredCode)}
        />
      )}
    </div>
  );
}
