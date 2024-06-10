const express = require("express");
const axios = require("axios");
const sharp = require("sharp");
const potrace = require("potrace");

const app = express();
const port = 3000;

app.use(express.json());

app.post("/convert-to-svg", async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  try {
    // Fetch the image
    const response = await axios({
      url: imageUrl,
      responseType: "arraybuffer",
    });

    // Convert image to PNG buffer
    const buffer = await sharp(response.data).png().toBuffer();

    // Convert buffer to SVG using Potrace
    potrace.trace(buffer, (err, svg) => {
      if (err) {
        console.error("Error processing image:", err);
        return res.status(500).json({ error: "Failed to process image" });
      }
      res.setHeader("Content-Type", "image/svg+xml");
      res.send(svg);
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
