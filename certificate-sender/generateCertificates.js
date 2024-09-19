const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb } = require("pdf-lib");
const fontkit = require("fontkit");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Constants
const TEMPLATE_PATH = "certificate-template.pdf";
const OUTPUT_DIR = "certificates";
const FONT_PATH = path.join(
  __dirname,
  "fonts",
  "Fontspring-DEMO-singel-regular.otf"
);

const cmToPoints = (cm) => cm * 28.3465;

// Ensure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

async function generateCertificate(participant) {
  try {
    const name = participant.Name;

    // Load the PDF template
    const templateBytes = fs.readFileSync(TEMPLATE_PATH);
    const pdfDoc = await PDFDocument.load(templateBytes);

    // Register fontkit
    pdfDoc.registerFontkit(fontkit);

    // Embed the custom font
    const fontBytes = fs.readFileSync(FONT_PATH);
    const customFont = await pdfDoc.embedFont(fontBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const fontSize = 44;
    const textWidth = customFont.widthOfTextAtSize(name, fontSize);
    const xPosition = (firstPage.getWidth() - textWidth) / 2;
    const yPosition = cmToPoints(9.4);

    firstPage.drawText(name, {
      x: xPosition,
      y: yPosition,
      size: fontSize,
      font: customFont,
      color: rgb(0.2, 0.25, 0.4),
    });

    const pdfBytes = await pdfDoc.save();
    const outputPath = path.join(
      OUTPUT_DIR,
      `${name.replace(/[/\\?%*:|"<>]/g, "-")}.pdf`
    );

    fs.writeFileSync(outputPath, pdfBytes);
    console.log(`Certificate generated for ${name}`);
    return outputPath;
  } catch (error) {
    console.error(
      `Error generating certificate for ${participant.Name}: ${error.message}`
    );
    return null;
  }
}

module.exports = generateCertificate;
