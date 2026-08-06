import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
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
  "score": (number from 0 to 100 representing code quality and clean code standards),
  "summary": (concise 2-3 sentence summary of the code quality),
  "securityIssues": [(array of strings describing security vulnerabilities, empty array if none)],
  "performanceIssues": [(array of strings describing performance bottlenecks, empty array if none)],
  "refactoredCode": (string containing clean, optimized, and refactored code)
}

Code to analyze:
${code}`;

   
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
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
      {
        error:
          "Failed to generate code review. Please check your API key or limit.",
      },
      { status: 500 },
    );
  }
}
