const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Variable to track if the print button is clicked
let buttonIsClicked = false;

// Route to set the print button click status
router.post("/setPrintButtonClick", (req, res) => {
  try {
    // Set the buttonIsClicked variable to true
    buttonIsClicked = true;
    // Send a response indicating successful recording of button click
    res.status(200).send("Button click recorded");
  } catch (error) {
    console.error("Error recording button click:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to set the trigger print button clicked status
router.post("/setTriggerPrintButtonClicked", (req, res) => {
  // Variable to store the print toggle status
  let printToggle;

  // Check if the print button is clicked
  if (buttonIsClicked) {
    // If clicked, set print toggle to true
    printToggle = true;
    try {
      // Send a response indicating successful recording of button click
      res.status(200).send(printToggle);
    } catch (error) {
      console.error("Error saving image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // If not clicked, set print toggle to false
    printToggle = false;
    res.status(200).send(printToggle);
  }
});

// Route to save the image received from the client
router.post("/saveImage", (req, res) => {
  try {
    // Check if imageData is undefined, if yes, provide a default value
    let imageData = req.body.imageData;

    // For CPEE demo case when req.body is null
    if (imageData === undefined) {
      imageData =
        "iVBORw0KGgoAAAANSUhEUgAAAhMAAABFCAYAAADw62TnAAAAAXNSR0IArs4c6QAAAy5JREFUeF7t1rENACAMBDGy/9BBYgSudfo01hc3u7vHESBAgAABAgQ+BUZMfMp5I0CAAAECBJ6AmDAEAgQIECBAIAmIicTnmQABAgQIEBATNkCAAAECBAgkATGR+DwTIECAAAECYsIGCBAgQIAAgSQgJhKfZwIECBAgQEBM2AABAgQIECCQBMRE4vNMgAABAgQIiAkbIECAAAECBJKAmEh8ngkQIECAAAExYQMECBAgQIBAEhATic8zAQIECBAgICZsgAABAgQIEEgCYiLxeSZAgAABAgTEhA0QIECAAAECSUBMJD7PBAgQIECAgJiwAQIECBAgQCAJiInE55kAAQIECBAQEzZAgAABAgQIJAExkfg8EyBAgAABAmLCBggQIECAAIEkICYSn2cCBAgQIEBATNgAAQIECBAgkATEROLzTIAAAQIECIgJGyBAgAABAgSSgJhIfJ4JECBAgAABMWEDBAgQIECAQBIQE4nPMwECBAgQICAmbIAAAQIECBBIAmIi8XkmQIAAAQIExIQNECBAgAABAklATCQ+zwQIECBAgICYsAECBAgQIEAgCYiJxOeZAAECBAgQEBM2QIAAAQIECCQBMZH4PBMgQIAAAQJiwgYIECBAgACBJCAmEp9nAgQIECBAQEzYAAECBAgQIJAExETi80yAAAECBAiICRsgQIAAAQIEkoCYSHyeCRAgQIAAATFhAwQIECBAgEASEBOJzzMBAgQIECAgJmyAAAECBAgQSAJiIvF5JkCAAAECBMSEDRAgQIAAAQJJQEwkPs8ECBAgQICAmLABAgQIECBAIAmIicTnmQABAgQIEBATNkCAAAECBAgkATGR+DwTIECAAAECYsIGCBAgQIAAgSQgJhKfZwIECBAgQEBM2AABAgQIECCQBMRE4vNMgAABAgQIiAkbIECAAAECBJKAmEh8ngkQIECAAAExYQMECBAgQIBAEhATic8zAQIECBAgICZsgAABAgQIEEgCYiLxeSZAgAABAgTEhA0QIECAAAECSUBMJD7PBAgQIECAgJiwAQIECBAgQCAJiInE55kAAQIECBAQEzZAgAABAgQIJIELe+oTQd2ywj4AAAAASUVORK5CYII=";
    }

    // Define filename for saving the image
    const fileName = "DYMOPNP_label.png";
    //    const imagePath = "/Users/niclasgrunau/Downloads/a.png";

    // Define the file path where the image will be saved
    const filePath = path.join(__dirname, "..", "downloads", fileName);

    // Convert base64 image data to buffer
    const imageBuffer = Buffer.from(imageData, "base64");

    // Write image data to file
    fs.writeFileSync(filePath, imageBuffer);

    // Send a response indicating successful image saving
    let isSaved = true;
    res.status(200).send(isSaved);
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to resize the image to a specific dimension
router.post("/resize", (req, res) => {
  // Send a response indicating successful image resizing
  let isResized = true;
  res.status(200).send(isResized);
});

// Route to print the resized image
router.post("/download-command", (req, res) => {
  // Send a response indicating successful image printing
  let isPrint = true;
  res.status(200).send(isPrint);
});

const PDFDocument = require("pdfkit");
const qrcode = require("qrcode");
const axios = require("axios");
const apiKey = "dklXZ5YlmsgocRzvqUJDewFiniUeV68sfCohvJkQKTzrqQUrwByzXJVzJYxC";

router.post("/createPDFWithQRCode/:text", async (req, res) => {
  const text = req.params.text;

  try {
    // Shorten the URL using the TinyURL API
    const tinyUrlResponse = await axios.post(
      "https://api.tinyurl.com/create",
      {
        url: text,
        domain: "tinyurl.com",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    // Get the shortened URL from the response
    const shortenedUrl = tinyUrlResponse.data.data.tiny_url;

    // Generate QR code image data URL
    const qrImageDataUrl = await qrcode.toDataURL(shortenedUrl, {
      width: 30, // Set width and height of QR code to match label size
    });

    // Create a new PDF document
    const doc = new PDFDocument({ size: [24, 24] });

    // Pipe the PDF document to a writable stream
    const fileName = "PDFQRCode.pdf";
    const filePath = path.join(__dirname, "..", "downloads", fileName);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Calculate the position to center the QR code horizontally and vertically
    const qrX = (doc.page.width - 30) / 2;
    const qrY = (doc.page.height - 30) / 2;

    // Add the QR code image to the PDF document
    doc.image(qrImageDataUrl, qrX, qrY, { width: 30, height: 30 });

    // Finalize the PDF document
    doc.end();

    console.log("PDF generated successfully:", filePath);

    // Respond to the client with a success message
    // Construct the CUPS command line for printing
    const cupsCommandLine = `curl -s "https://lehre.bpm.in.tum.de/~ge83neb/dymo-pnp/backend/downloads/${fileName}" | lp -d DYMO_LabelManager_PnP -o landscape -o PageSize=Custom.24x24 -o fit-to-page`;

    // Create a JSON object with the CUPS command line
    const responseJson = { "CUPS command line for printing": cupsCommandLine };

    // Manually stringify the JSON object without backslashes
    const jsonString = `{ "CUPS command line for printing": "${cupsCommandLine}" }`;
    res.status(200).send(jsonString);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const {
  degrees,
  PDFDocument: PDFLibDocument,
  rgb,
  StandardFonts,
} = require("pdf-lib");

router.post("/createPDFWithText/:text", async (req, res) => {
  const inputText = req.params.text;

  try {
    // Create a new PDF document
    const pdfDoc = await PDFLibDocument.create();

    // Get the standard font Helvetica
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Calculate the width of the input text in points
    const textWidth = helveticaFont.widthOfTextAtSize(inputText, 65);

    // Create a new page with corrected dimensions
    const page = pdfDoc.addPage([textWidth, 69]);

    // Add the text to the page
    page.drawText(inputText, {
      x: 0,
      y: 15,
      size: 65,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    // Save the PDF document to a file
    const fileName = "PDFText.pdf";
    const filePath = path.join(__dirname, "..", "downloads", fileName);
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfBytes);

    console.log("PDF generated successfully:", filePath);

    // Respond to the client with a success message
    const printingWidth = (textWidth * 24) / 69;

    const roundedPrintingWidth = Math.round(printingWidth);

    // Construct the CUPS command line for printing
    const cupsCommandLine = `curl -s "https://lehre.bpm.in.tum.de/~ge83neb/dymo-pnp/backend/downloads/${fileName}" | lp -d DYMO_LabelManager_PnP -o landscape -o PageSize=Custom.24x${roundedPrintingWidth} -o fit-to-page`;

    // Create a JSON object with the CUPS command line
    const responseJson = { "CUPS command line for printing": cupsCommandLine };

    // Manually stringify the JSON object without backslashes
    const jsonString = `{ "CUPS command line for printing": "${cupsCommandLine}" }`;

    // Respond to the client with the CUPS command line
    res.status(200).send(jsonString);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/createPDFWithTextAndQRCode-query", async (req, res) => {
  const { text, url } = req.query;

  try {
    // Shorten the URL using the TinyURL API
    const tinyUrlResponse = await axios.post(
      "https://api.tinyurl.com/create",
      {
        url: url,
        domain: "tinyurl.com",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    // Get the shortened URL from the response
    const shortenedUrl = tinyUrlResponse.data.data.tiny_url;

    // Create a new PDF document
    const pdfDoc = await PDFLibDocument.create();

    // Get the standard font Helvetica
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Calculate the width of the input text in points
    const textWidth = helveticaFont.widthOfTextAtSize(text, 65);

    // Calculate the width of the letter "E" in the chosen font size
    const letterEWidth = helveticaFont.widthOfTextAtSize("E", 55);

    // Generate QR code image data URL
    const qrImageDataUrl = await qrcode.toDataURL(shortenedUrl, {
      width: 86, // Set width and height of QR code
    });

    // Create a new page with corrected dimensions
    const page = pdfDoc.addPage([textWidth + 86 + letterEWidth, 69]); // Width = textWidth + QR code width + letterEWidth

    // Add the text to the page
    page.drawText(text, {
      x: 0,
      y: 15,
      size: 65,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    // Calculate the position to add the QR code
    const qrX = textWidth + letterEWidth; // Place QR code after the text and letter "E"
    const qrY = (69 - 86) / 2; // Center vertically

    // Add the QR code image to the PDF document
    const qrImageBytes = Buffer.from(qrImageDataUrl.split(",")[1], "base64");
    const qrImage = await pdfDoc.embedPng(qrImageBytes);
    page.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: 86,
      height: 86,
    });

    // Save the PDF document to a file
    const fileName = "PDFTextAndQRCode.pdf";
    const filePath = path.join(__dirname, "..", "downloads", fileName);
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfBytes);

    console.log("PDF generated successfully:", filePath);

    // Respond to the client with a success message
    const printingWidth = ((textWidth + 86 + letterEWidth) * 24) / 69;

    const roundedPrintingWidth = Math.round(printingWidth);

    // Construct the CUPS command line for printing
    const cupsCommandLine = `curl -s "https://lehre.bpm.in.tum.de/~ge83neb/dymo-pnp/backend/downloads/PDFTextAndQRCode.pdf" | lp -d DYMO_LabelManager_PnP -o landscape -o PageSize=Custom.24x${roundedPrintingWidth} -o fit-to-page`;

    // Create a JSON object with the CUPS command line
    const responseJson = { "CUPS command line for printing": cupsCommandLine };

    // Manually stringify the JSON object without backslashes
    const jsonString = `{ "CUPS command line for printing": "${cupsCommandLine}" }`;

    // Respond to the client with the CUPS command line
    res.status(200).send(jsonString);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
