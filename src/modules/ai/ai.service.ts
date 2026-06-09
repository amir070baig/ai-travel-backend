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
  Create a highly personalized travel itinerary for Agra, India that aligns naturally with the traveler’s selected budget, travel style, interests, and trip preferences.

  Traveler Details:
  - Days: ${days}
  - Budget: ₹${budget}
  - Travelers: ${groupSize}
  - Travel Style: ${travelStyle}
  - Trip Type: ${tripType}
  - Interests: ${interests || "General sightseeing"}

  IMPORTANT REQUIREMENTS:

  BUSINESS RULES:

  - Do not suggest unsupported DIY logistics, risky negotiations, or unverified local arrangements.
  - Avoid presenting recommendations as confirmed reservations, guaranteed availability, or fixed operational commitments.
  - Recommendations should feel suitable for a modern premium travel company serving domestic and international travelers.
  - Avoid telling users to negotiate with drivers, guides, or vendors.
  - Avoid generic backpacker-style recommendations.
  - Use premium concierge-style language.
  - Present recommendations as curated travel experiences instead of guaranteed bookings.
  - Suggest transportation assistance and guided experiences professionally.
  - Do not invent unrealistic hotel availability or fake operational guarantees.
  - Recommendations should feel premium, personalized, and operationally realistic.
  - Encourage continued coordination with the travel concierge team for final arrangements.
  - When appropriate, suggest optional concierge assistance, guided experiences, premium transport support, or curated upgrades naturally within the itinerary.
  - Avoid repetitive wording and excessive use of promotional adjectives.
  - Ensure recommendations remain realistic and appropriate for the selected budget range.

  1. Make the itinerary personalized, practical, well-structured, and aligned with the selected travel style and budget expectations.
  2. Suggest curated accommodation recommendations based on travel style and budget.
  3. Suggest curated dining experiences, local culinary highlights, and traveler-friendly food recommendations.
  4. Suggest comfortable transportation assistance and travel coordination options.
  5. Optimize timings intelligently.
  6. Suggest less crowded timings.
  7. Include photography opportunities if relevant.
  8. Include curated local experiences and premium cultural recommendations.
  9. Avoid generic internet-travel-blog style suggestions.
  10. Provide realistic approximate budget guidance without guaranteeing exact pricing.
  11. Provide concierge-style travel guidance instead of DIY negotiation advice.
  12. Include hidden gems when appropriate.
  13. Tailor recommendations to travel style.
  14. The itinerary should feel like a premium travel concierge experience rather than a generic AI travel guide.

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

  Optional Experiences & Concierge Enhancements

  Approximate Budget Guidance

  Travel Tips

  IMPORTANT:
  - Keep formatting clean
  - No markdown symbols
  - Use short readable paragraphs

  The writing style should feel polished, welcoming, premium, and easy to read.
  Keep each section concise, readable, and professionally formatted for travelers.
  `;

  try {
    console.log("API KEY:", process.env.OPENROUTER_API_KEY);

    const response = await client.chat.completions.create({
      model: "openrouter/auto",
      messages: [
        {
          role: "system",
          content:
            "You are a luxury travel concierge assistant helping create premium personalized travel experiences for a professional travel company.",
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