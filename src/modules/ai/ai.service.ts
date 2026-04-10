import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
  return `
Day 1:
- Visit Taj Mahal
- Explore Agra Fort
- Evening at Mehtab Bagh

Day 2:
- Fatehpur Sikri trip
- Local market shopping

Day 3:
- Itmad-ud-Daulah
- Relax and departure
`;
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