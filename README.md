# AI Code Reviewer

An enterprise-grade, multi-persona AI code review platform built with Next.js, TypeScript, Tailwind CSS, and Monaco Editor. It leverages Groq's Llama 3.3 70B model to provide lightning-fast, highly accurate code analysis tailored for software architecture, cybersecurity auditing, and performance optimization.

---

## Features

- **Multi-Persona AI Review Engine**: Toggle between three specialized critique modes:
  - **Senior Architect**: Focuses on clean code, SOLID principles, modularity, and modern syntax patterns.
  - **Security Auditor**: Operates from a strict OWASP and threat-modeling perspective to identify vulnerabilities and sanitize data.
  - **Performance Optimizer**: Analyzes code through a Big-O complexity and memory-overhead lens.
- **Interactive Code Editor & Diff Viewer**: Integrated Monaco Editor with real-time syntax highlighting across multiple programming languages, accompanied by a side-by-side diff comparison tool.
- **Export & Reporting**: Generate structured markdown reports, download `.md` files directly, or export formatted documentation for team reviews.
- **Responsive UI**: Dark-themed developer interface optimized for modern desktop and tablet workflows.

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **AI Inference**: Groq API (`llama-3.3-70b-versatile`)

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun

### Installation & Setup

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/ai-code-reviewer.git](https://github.com/your-username/ai-code-reviewer.git)
   cd ai-code-reviewer


  Install dependencies:

Bash
npm install
Create a .env.local file in the root directory and add your Groq API key:

Code snippet
GROQ_API_KEY=your_groq_api_key_here
Run the development server:

Bash
npm run dev
Open http://localhost:3000 in your browser to use the application.
