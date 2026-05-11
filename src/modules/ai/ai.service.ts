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
  Create a highly detailed and realistic premium travel itinerary for Agra, India.

  Trip Details:
  - Number of Days: ${data.days}
  - Budget: ₹${data.budget}
  - Travelers: ${data.groupSize}

  IMPORTANT REQUIREMENTS:

  1. Make the itinerary realistic and useful.
  2. Mention REAL hotel suggestions with estimated prices.
  3. Mention ticket prices wherever relevant.
  4. Mention separate pricing for Indian and foreign tourists if applicable.
  5. Include famous restaurants and food recommendations.
  6. Include transport suggestions between locations.
  7. Mention best timings for sightseeing.
  8. Include practical travel advice and local tips.
  9. Mention estimated total daily spending.
  10. Mention places suitable for photography.

  FORMAT STYLE:

  Trip Overview

  Day 1
  Morning:
  Afternoon:
  Evening:

  Day 2
  Morning:
  Afternoon:
  Evening:

  Hotel Suggestions

  Budget Breakdown

  Travel Tips

  IMPORTANT:
  - Keep formatting clean.
  - Do NOT use markdown symbols like ** or ##.
  - Keep sections readable.
  - Avoid giant paragraphs.
  - Make recommendations feel premium and personalized.
  - Mention that prices may vary depending on season.
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