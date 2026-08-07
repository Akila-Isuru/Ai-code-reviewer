import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is missing in Vercel Environment Variables!" },
        { status: 500 },
      );
    }

    const body = await req.json();
    const { code, language, mode = "general" } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Code is required for review" },
        { status: 400 },
      );
    }

    let systemRole = "";
    let promptInstructions = "";

    // 1. Security Persona
    if (mode === "security") {
      systemRole =
        "You are a ruthless Chief Information Security Officer (CISO) and OWASP Cyber Security Auditor.";
      promptInstructions = `
Analyze the code STRICTLY from a CYBER SECURITY & THREAT MODELING perspective. Ignore general code style unless it impacts security.

You MUST follow these strict guidelines for your JSON fields:
- summary: Focus exclusively on security posture, attack surfaces, OWASP Top 10 risks, and data sanitization. Mention specific vulnerability names (e.g., SQL Injection, XSS, RCE, IDOR).
- securityIssues: List detailed security vulnerabilities, potential exploits, and threat risks.
- performanceIssues: ["N/A - Security Audit Mode active. Focused purely on threat prevention and security hardening."].
- refactoredCode: Refactor the code solely to prioritize security hardening, parameterized queries, input sanitization, and defensive programming.
`;
    }
    // 2. Performance Persona
    else if (mode === "performance") {
      systemRole =
        "You are a Principal Performance Engineer specializing in High-Frequency Trading systems, Big-O Complexity, and Memory Optimization.";
      promptInstructions = `
Analyze the code STRICTLY from an ALGORITHMIC PERFORMANCE & BIG-O COMPLEXITY perspective. Ignore security unless it impacts CPU execution speed.

You MUST follow these strict guidelines for your JSON fields:
- summary: Must explicitly state the current Big-O Time Complexity (e.g., O(N^2)) and Space Complexity, explaining CPU cycles and memory overhead bottlenecks.
- securityIssues: ["N/A - Performance & Big-O Mode active. Focused purely on execution speed and memory footprint."].
- performanceIssues: List specific loop inefficiencies, cache misses, array lookup overheads, and memory leaks (e.g., replacing Array.indexOf with Set/Map).
- refactoredCode: Refactor the code solely to achieve optimal Big-O execution speed (e.g., converting O(N^2) to O(N)) and minimal memory footprint.
`;
    }
    // 3. Senior Architect Persona (Default)
    else {
      systemRole =
        "You are a Principal Software Architect focused on Clean Code, SOLID principles, and System Design.";
      promptInstructions = `
Provide a balanced, high-level software engineering critique focusing on Code Architecture, Maintainability, Readable Syntax, and Best Practices.
- summary: Evaluate overall code quality, modularity, readability, and modern language paradigms (e.g., async/await, ES6+ features).
- securityIssues: Highlight critical security risks if present.
- performanceIssues: Highlight obvious performance bottlenecks if present.
- refactoredCode: Rewrite for clean code architecture, elegant error handling, and maximum developer readability.
`;
    }

    const prompt = `${promptInstructions}

You MUST respond ONLY with a valid raw JSON object matching this exact schema (no markdown formatting, just pure JSON):
{
  "score": 85,
  "summary": "Detailed summary tailored STRICTLY to your assigned persona perspective",
  "securityIssues": ["Specific security issue items"],
  "performanceIssues": ["Specific performance issue items"],
  "refactoredCode": "Refactored code built strictly according to your assigned persona focus"
}

CRITICAL FORMATTING RULES FOR "refactoredCode":
1. NEVER output minified or single-line code.
2. MUST maintain clean, human-readable, multi-line code formatting with proper line breaks (\\n) and standard indentation.
3. Keep the same structure and spacing as professionally formatted source code.

Code to analyze (${language || "javascript"}):
${code}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemRole,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error?.message || "Failed to query Groq AI API");
    }

    const data = await res.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from Groq AI");
    }

    const jsonResponse = JSON.parse(content);
    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error("Groq Review Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate code review." },
      { status: 500 },
    );
  }
}
