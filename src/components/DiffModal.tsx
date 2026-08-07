"use client";

import React from "react";
import { DiffEditor } from "@monaco-editor/react";
import { X, Check } from "lucide-react";

interface DiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalCode: string;
  refactoredCode: string;
  language: string;
  onApply: () => void;
}

export default function DiffModal({
  isOpen,
  onClose,
  originalCode,
  refactoredCode,
  language,
  onApply,
}: DiffModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="flex h-[85vh] w-full max-w-6xl flex-col rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              Code Diff Comparison
            </h2>
            <p className="text-xs text-gray-400">
              Left: Original Code &bull; Right: AI Refactored Code
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onApply();
                onClose();
              }}
              className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-500"
            >
              <Check className="h-4 w-4" /> Apply Refactored Code
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Diff Editor Container */}
        <div className="flex-1 overflow-hidden p-4">
          <DiffEditor
            height="100%"
            language={language}
            original={originalCode}
            modified={refactoredCode}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 13,
              scrollBeyondLastLine: false,
              renderSideBySide: true,
              wordWrap: "on",
              wrappingStrategy: "advanced",
            }}
          />
        </div>
      </div>
    </div>
  );
}
