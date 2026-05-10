import OpenAI from "openai";
console.log("OPENROUTER KEY:", process.env.OPENROUTER_API_KEY);

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://ai-travel-frontend-kappa.vercel.app/", // or your Vercel URL
    "X-Title": "AI Travel App",
  },
});

export const generateItinerary = async (data: {
  days: number;
  budget: string;
  groupSize: number;
}) => {
  const prompt = `
  Create a premium Agra travel itinerary.

  Trip Details:
  - Days: ${data.days}
  - Budget: ₹${data.budget}
  - Travelers: ${data.groupSize}

  IMPORTANT FORMAT RULES:

  1. Use clear headings.
  2. Separate each day properly.
  3. Keep lines short and readable.
  4. Mention estimated costs.
  5. Include food suggestions.
  6. Include transport suggestions.
  7. Include travel tips.
  8. Mention that prices may vary.

  FORMAT:

  Trip Overview

  Day 1:
  Morning:
  Afternoon:
  Evening:

  Day 2:
  Morning:
  Afternoon:
  Evening:

  Hotel Suggestions

  Estimated Budget Breakdown

  Travel Tips

  IMPORTANT:
  Do NOT use markdown symbols like ** or ##.
  Keep output clean and readable.
  `;

  try {
    console.log("API KEY:", process.env.OPENROUTER_API_KEY);

    const response = await client.chat.completions.create({
      model: "openrouter/auto",
      messages: [
        {
          role: "system",
          content: "You are a professional travel planner.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.choices[0].message.content || "";
  } catch (err) {
    console.error("AI ERROR:", err);
    throw err;
  }
};

import { prisma } from "../../shared/prisma/client";

export const saveItinerary = async (data: any, content: string, userId: string) => {
  return prisma.itinerary.create({
    data: {
      sourceType: "AI",
      city: "Agra",
      days: data.days,
      budget: data.budget,
      groupSize: data.groupSize,
      contentJson: content,
      userId: userId,
    },
  });
};