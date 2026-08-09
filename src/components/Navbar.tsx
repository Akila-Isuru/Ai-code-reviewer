import React from "react";
import { Code2, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-gray-800 bg-gray-950 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-500">
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">AI Code Reviewer</h1>
            <p className="text-xs text-gray-400">Powered by Llama-3.3-70B</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 rounded-full border border-gray-800 bg-gray-900 px-3 py-1 text-xs text-gray-300">
          <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
        </div>
      </div>
    </header>
  );
}
