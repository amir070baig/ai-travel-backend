import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // ✅ CHANGE
  baseURL: "https://openrouter.ai/api/v1", // ✅ REQUIRED
});

// export const generateItinerary = async (data: {
//   days: number;
//   budget: string;
//   groupSize: number;
// }) => {
//   const prompt = `
// Create a ${data.days}-day travel itinerary for Agra, India.

// Budget: ${data.budget}
// Group size: ${data.groupSize}

// Give a day-wise plan.
// Keep it practical and tourist-friendly.
// `;

//   const response = await client.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       { role: "system", content: "You are a travel planner." },
//       { role: "user", content: prompt },
//     ],
//   });

//   return response.choices[0].message.content || "";
// };

export const generateItinerary = async (data: {
  days: number;
  budget: string;
  groupSize: number;
}) => {
  const prompt = `
Create a ${data.days}-day travel itinerary for Agra, India.

Budget: ${data.budget}
Group size: ${data.groupSize}

Return ONLY this format:

Day 1:
- ...

Day 2:
- ...

Keep it practical and tourist-friendly.
No extra explanation.
`;

  const response = await client.chat.completions.create({
    model: "openrouter/auto", // ✅ FREE + SMART ROUTING
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