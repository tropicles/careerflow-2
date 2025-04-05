"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function calculateATSScore({ content, jobDescription }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  // Basic ATS checks
  let score = 100;
  let feedback = [];

  // Check for non-ATS-friendly elements
  if (
    content.includes("📧") ||
    content.includes("📱") ||
    content.includes("💼") ||
    content.includes("🐦")
  ) {
    score -= 20;
    feedback.push(
      "Remove icons (e.g., 📧, 📱) as they may not be parsed by ATS systems."
    );
  }

 

  // Check for standard section headings
  const requiredHeadings = [
    "Professional Summary",
    "Skills & Abilities",
    "Experience",
    "Education",
  ];
  for (const heading of requiredHeadings) {
    if (!content.includes(`${heading}`)) {
      score -= 10;
      feedback.push(
        `Include a "${heading}" section to help ATS systems identify key information.`
      );
    }
  }

  // Use AI to analyze keyword matching
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
    Analyze the following resume content and job description to calculate an ATS compatibility score (0-100) based on keyword matching.
    Return the result as a JSON object with "keywordScore" (number) and "keywordFeedback" (string).

    Resume Content: ${content}
    Job Description: ${jobDescription}
  `;
  const result = await model.generateContent(prompt);
  // Clean the result: remove markdown code fences if present
  let resultText = result.response.text().trim();
  resultText = resultText.replace(/^```(?:json)?/, "").replace(/```$/, "").trim();

  const { keywordScore, keywordFeedback } = JSON.parse(resultText);

  // Combine scores and feedback
  const finalScore = Math.round((score + keywordScore) / 2);
  const finalFeedback = [...feedback, keywordFeedback].join(" ");

  // Update the resume with the ATS score and feedback
  await db.resume.update({
    where: { userId: user.id },
    data: {
      atsScore: finalScore,
      feedback: finalFeedback,
    },
  });

  return { score: finalScore, feedback: finalFeedback };
}
