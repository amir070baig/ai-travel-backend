import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  await prisma.tour.deleteMany();

  await prisma.tour.createMany({
    data: [

      {
        title: "Taj Mahal Sunrise Tour",

        description:
          "Experience the beauty of the Taj Mahal at sunrise with skip-the-line access and expert local guidance.",

        price: 2999,

        imageUrl:
          "https://images.unsplash.com/photo-1564507592333-c60657eea523",

        gallery: [
          "https://images.unsplash.com/photo-1564507592333-c60657eea523",
          "https://images.unsplash.com/photo-1548013146-72479768bada",
          "https://images.unsplash.com/photo-1587474260584-136574528ed5"
        ],

        highlights: [
          "Sunrise Taj Mahal visit",
          "Private AC vehicle",
          "Professional guide",
          "Express entry"
        ],

        inclusions: [
          "Hotel pickup",
          "Private transport",
          "Tour guide",
          "Water bottle"
        ],

        exclusions: [
          "Personal expenses",
          "Lunch",
          "Tips"
        ],

        duration: "5 Hours",

        pickupPoint: "Agra Hotel / Railway Station"
      },

      {
        title: "Agra Full Day Heritage Tour",
        description:
          "Explore Agra’s most iconic attractions including Taj Mahal, Agra Fort, Mehtab Bagh, and Baby Taj in a comfortable private air-conditioned car with professional guide.",
        price: 4999,
        imageUrl:
          "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1400&auto=format&fit=crop",
      },

      {
        title: "Luxury Taj Mahal Experience",
        description:
          "Enjoy a premium luxury experience with VIP assistance, private chauffeur, 5-star breakfast, express entry tickets, and a personalized guided tour of Agra’s royal landmarks.",
        price: 9999,
        imageUrl:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1400&auto=format&fit=crop",
      },

      {
        title: "Agra Food & Culture Walk",
        description:
          "Discover authentic Mughlai cuisine, hidden street food gems, local markets, and cultural stories during this immersive Agra food and heritage experience.",
        price: 1999,
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400&auto=format&fit=crop",
      },

      {
        title: "Taj Mahal Photography Tour",
        description:
          "Capture unforgettable memories with a photography-focused Taj Mahal experience designed for couples, creators, and travelers seeking the best photo spots in Agra.",
        price: 3499,
        imageUrl:
          "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1400&auto=format&fit=crop",
      },

      {
        title: "Fatehpur Sikri & Agra Combo Tour",
        description:
          "Visit the magnificent Fatehpur Sikri along with Taj Mahal and Agra Fort in a full-day private sightseeing experience with guided historical insights.",
        price: 5999,
        imageUrl:
          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1400&auto=format&fit=crop",
      },

    ],
  });

  console.log("Tours added successfully ✅");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });