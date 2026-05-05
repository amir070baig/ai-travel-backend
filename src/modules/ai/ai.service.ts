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
Create a ${data.days}-day travel itinerary for Agra.

Budget: ₹${data.budget}
Group size: ${data.groupSize}

IMPORTANT:
- Start with a unique and premium itinerary title
- Include hotel options with price per night
- Include transport cost
- Include daily cost breakdown
- Include TOTAL estimated cost
- Add this disclaimer at the end:

"Note: Prices are AI-generated estimates and may vary."

Make it realistic and structured day-wise.

Return ONLY this format:

Day 1:
- ...

Day 2:
- ...

Keep it practical and tourist-friendly.
No extra explanation.
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

export const saveItinerary = async (data: any, content: string) => {
  return prisma.itinerary.create({
    data: {
      sourceType: "AI",
      city: "Agra",
      days: data.days,
      budget: data.budget,
      groupSize: data.groupSize,
      contentJson: content,
    },
  });
};