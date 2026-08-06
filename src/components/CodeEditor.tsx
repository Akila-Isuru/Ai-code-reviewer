'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  setCode: (value: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export default function CodeEditor({
  code,
  setCode,
  language,
  setLanguage,
}: CodeEditorProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-950 px-4 py-2.5">
        <span className="text-sm font-medium text-gray-300">Input Code</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}