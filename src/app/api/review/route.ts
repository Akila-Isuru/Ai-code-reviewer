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
    const { code, language } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Code is required for review" },
        { status: 400 },
      );
    }

    const prompt = `You are an expert Senior Software Engineer and Technical Interviewer.
Review the following ${language || "javascript"} code and provide professional feedback.

You MUST respond ONLY with a valid raw JSON object matching this exact schema (do not include markdown code blocks like \`\`\`json, just return the raw JSON):
{
  "score": 85,
  "summary": "Concise code review summary",
  "securityIssues": ["Security issue description or 'No security issues detected'"],
  "performanceIssues": ["Performance tip description or 'No performance bottlenecks found'"],
  "refactoredCode": "Clean refactored version of the code"
}

Code to analyze:
${code}`;

    // Call Groq API (OpenAI Compatible Endpoint)
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
            content:
              "You are a helpful code review assistant that always responds strictly in raw valid JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
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
