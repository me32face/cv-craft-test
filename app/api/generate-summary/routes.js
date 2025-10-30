import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, role, skills, experience } = body;

    const prompt = `
    Write a professional summary for a resume.
    Name: ${name}
    Role: ${role}
    Skills: ${skills}
    Experience: ${experience}
    Make it concise, ATS-friendly, and professional.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      top_p: 0.9,
    });

    const summary = completion.choices[0]?.message?.content || "No summary generated.";
    return NextResponse.json({ summary });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
