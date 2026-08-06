"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import CodeEditor from "../components/CodeEditor";
import { Play, ShieldAlert, Zap, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [code, setCode] = useState<string>(
    `// Paste your code here to review\nfunction calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}`,
  );
  const [language, setLanguage] = useState<string>("javascript");
  const [loading, setLoading] = useState<boolean>(false);

  const handleReview = async () => {
    if (!code.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("To be implement!");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6 lg:flex-row">
        {/* Left Column: Editor */}
        <div className="flex h-[600px] flex-col gap-4 lg:w-1/2">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
          />
          <button
            onClick={handleReview}
            disabled={loading}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>{loading ? "Analyzing Code..." : "Review Code"}</span>
          </button>
        </div>

        <div className="flex h-[600px] flex-col rounded-xl border border-gray-800 bg-gray-900 p-6 lg:w-1/2">
          <h2 className="text-lg font-semibold text-gray-200">
            AI Review Results
          </h2>
          <div className="flex flex-1 items-center justify-center text-center text-gray-500">
            <p>
              Click &quot;Review Code&quot; to generate AI feedback and
              refactoring suggestions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
