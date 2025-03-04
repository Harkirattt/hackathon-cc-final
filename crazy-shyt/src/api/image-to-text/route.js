import formidable from "formidable";
import fs from "fs";
import Tesseract from "tesseract.js";

export const config = {
  api: {
    bodyParser: false, // Disable default bodyParser for file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = "./public/uploads";
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "File parsing error" });
    }

    const imagePath = files.image.filepath; // Get the uploaded image path

    try {
      // Run OCR on the image using Tesseract.js
      const { data } = await Tesseract.recognize(imagePath, "eng", {
        logger: (m) => console.log(m),
      });

      fs.unlinkSync(imagePath); // Delete the uploaded file after processing

      res.status(200).json({ text: data.text });
    } catch (error) {
      res.status(500).json({ error: "Error processing image" });
    }
  });
}
