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
  travelStyle: string;
  tripType: string;
  interests: string;
}) => {
  const { days, budget, groupSize, travelStyle, tripType, interests } = data;

  const prompt = `
  Create a highly personalized premium travel itinerary for Agra, India.

  Traveler Details:
  - Days: ${days}
  - Budget: ₹${budget}
  - Travelers: ${groupSize}
  - Travel Style: ${travelStyle}
  - Trip Type: ${tripType}
  - Interests: ${interests}

  IMPORTANT REQUIREMENTS:

  1. Make itinerary realistic, premium and budget friendly.
  2. Include actual hotel suggestions.
  3. Include local restaurant suggestions.
  4. Include realistic transport planning.
  5. Optimize timings intelligently.
  6. Suggest less crowded timings.
  7. Include photography opportunities if relevant.
  8. Include local insider recommendations.
  9. Avoid generic recommendations.
  10. Mention estimated costs.
  11. Mention practical travel tips.
  12. Include hidden gems when appropriate.
  13. Tailor recommendations to travel style.

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

  Hotel Recommendations

  Food Recommendations

  Estimated Budget Breakdown

  Travel Tips

  IMPORTANT:
  - Keep formatting clean
  - No markdown symbols
  - Use short readable paragraphs
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
      travelStyle: data.travelStyle,
      tripType: data.tripType,
      interests: data.interests,
      contentJson: content,
      userId: userId,
    },
  });
};