'use client';

import React from 'react';
import { ReviewResult } from '../types';
import { ShieldAlert, Zap, CheckCircle2, ArrowRightLeft } from 'lucide-react';

interface FeedbackCardProps {
  review: ReviewResult;
  onApplyRefactor: (newCode: string) => void;
}

export default function FeedbackCard({ review, onApplyRefactor }: FeedbackCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 border-green-500/30 bg-green-500/10';
    if (score >= 50) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto space-y-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
      {/* Score Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Code Analysis Result</h2>
          <p className="text-xs text-gray-400">AI Senior Engineer Review</p>
        </div>
        <div className={`flex flex-col items-center justify-center rounded-xl border px-4 py-2 ${getScoreColor(review.score)}`}>
          <span className="text-2xl font-extrabold">{review.score}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider">Score</span>
        </div>
      </div>

      {/* Summary */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <CheckCircle2 className="h-4 w-4 text-blue-400" /> Summary
        </h3>
        <p className="mt-1 rounded-lg border border-gray-800/50 bg-gray-950/50 p-3 text-sm text-gray-400 leading-relaxed">
          {review.summary}
        </p>
      </div>

      {/* Security Issues */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <ShieldAlert className="h-4 w-4 text-red-400" /> Security Vulnerabilities
        </h3>
        {review.securityIssues && review.securityIssues.length > 0 ? (
          <ul className="mt-2 space-y-1.5 pl-2">
            {review.securityIssues.map((issue, idx) => (
              <li key={idx} className="flex items-start gap-2 rounded border border-red-900/30 bg-red-950/20 p-2 text-xs text-red-300">
                <span>•</span> {issue}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 rounded border border-green-900/30 bg-green-950/20 p-2 text-xs text-green-400">
            No security issues detected.
          </p>
        )}
      </div>

      {/* Performance Bottlenecks */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <Zap className="h-4 w-4 text-yellow-400" /> Performance & Best Practices
        </h3>
        {review.performanceIssues && review.performanceIssues.length > 0 ? (
          <ul className="mt-2 space-y-1.5 pl-2">
            {review.performanceIssues.map((issue, idx) => (
              <li key={idx} className="flex items-start gap-2 rounded border border-yellow-900/30 bg-yellow-950/20 p-2 text-xs text-yellow-300">
                <span>•</span> {issue}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 rounded border border-green-900/30 bg-green-950/20 p-2 text-xs text-green-400">
            No performance bottlenecks found.
          </p>
        )}
      </div>

      {/* Refactored Code */}
      {review.refactoredCode && (
        <div className="flex min-h-[180px] flex-1 flex-col">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-300">Refactored Code</h3>
            <button
              onClick={() => onApplyRefactor(review.refactoredCode)}
              className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-600/20 px-3 py-1 text-xs font-medium text-blue-400 transition hover:bg-blue-600/30"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" /> Apply to Editor
            </button>
          </div>
          <pre className="flex-1 overflow-x-auto rounded-lg border border-gray-800 bg-gray-950 p-3 font-mono text-xs text-emerald-400 leading-relaxed">
            <code>{review.refactoredCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
}