"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function suggestKeywords({ jobDescription }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true
    }
  });
  if (!user) throw new Error("User not found");

  try {
    // Call your ML model API endpoint
    const response = await fetch('https://mlmkey-ehnc.onrender.com/extract-keywords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        job_description: jobDescription,
        num_keywords: 15 // Adjust as needed
      })
    });

    if (!response.ok) {
      throw new Error(`Model API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Combine ML model keywords with industry-specific terms
    const industryKeywords = getIndustryTerms(user.industry);
    const combinedKeywords = [...new Set([...data.keywords, ...industryKeywords])];
    
    return combinedKeywords.join(', ');

  } catch (error) {
    console.error('Keyword extraction error:', error);
    throw new Error('Failed to generate keywords');
  }
}

// Helper function to add industry-specific terms
function getIndustryTerms(industry) {
  const industryMap = {
    'WEB_DEV': ['REST API', 'React', 'Node.js', 'TypeScript'],
    'EMBEDDED': ['IoT', 'Microcontrollers', 'RTOS', 'ARM Cortex'],
    'DATA_SCIENCE': ['Machine Learning', 'Python', 'Pandas', 'TensorFlow'],
    default: []
  };
  return industryMap[industry] || industryMap.default;
}