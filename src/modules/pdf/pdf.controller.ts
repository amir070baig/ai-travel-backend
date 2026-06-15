import { Request, Response } from "express";
import PDFDocument from "pdfkit";

export const generatePDF = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      content,
      days,
      budget,
      groupSize,
    } = req.body;

    const doc = new PDFDocument({
      margin: 50,
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=itinerary.pdf"
    );

    doc.pipe(res);

    // TITLE
    doc
      .fontSize(24)
      .fillColor("#2563eb")
      .text("TourGen", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(16)
      .fillColor("black")
      .text("Premium Agra Travel Itinerary", {
        align: "center",
      });

    doc.moveDown(2);

    // SUMMARY
    doc
      .fontSize(14)
      .text(`Trip Duration: ${days} Days`);

    doc.text(`Budget: ₹${budget}`);

    doc.text(`Travelers: ${groupSize}`);

    doc.moveDown();

    // ITINERARY TITLE
    doc
      .fontSize(18)
      .fillColor("#2563eb")
      .text("Trip Plan");

    doc.moveDown();

    // ITINERARY CONTENT
    const lines = content
      .replace(/\\*/g, "")
      .split("\\n");

    lines.forEach((line: string) => {

      if (!line.trim()) return;

      const isHeading =
        line.includes("Day") ||
        line.includes("Overview") ||
        line.includes("Budget") ||
        line.includes("Tips") ||
        line.includes("Hotel");

      doc
        .fontSize(isHeading ? 16 : 12)
        .fillColor(
          isHeading ? "#2563eb" : "black"
        )
        .text(line, {
          lineGap: 6,
        });

      doc.moveDown(0.5);
    });

    // FOOTER
    doc.moveDown(2);

    doc
      .fontSize(12)
      .fillColor("gray")
      .text(
        "Need help booking your trip? Contact us on WhatsApp: +91-7599921173",
        {
          align: "center",
        }
      );

    doc.end();

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "PDF generation failed",
    });
  }
};