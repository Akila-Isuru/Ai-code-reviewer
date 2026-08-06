import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing in Environment Variables!" },
        { status: 500 },
      );
    }

    const ai = new GoogleGenAI({ apiKey });
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

You MUST respond ONLY with a valid JSON object matching this exact schema (do not include markdown code blocks like \`\`\`json, just return the raw JSON):
{
  "score": 85,
  "summary": "Concise code review summary",
  "securityIssues": ["Issue description if any"],
  "performanceIssues": ["Issue description if any"],
  "refactoredCode": "Clean refactored code here"
}

Code to analyze:
${code}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API");
    }

    const jsonResponse = JSON.parse(resultText);
    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error("Gemini Review Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate code review." },
      { status: 500 },
    );
  }
}
