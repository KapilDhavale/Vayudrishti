const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET /api/news
router.get("/news", async (req, res) => {
  try {
    // Call NewsAPI from the server side
    const response = await axios.get(
      "https://newsapi.org/v2/everything", {
        params: {
          q: "pollution delhi",
          language: "en"
        },
        headers: {
          "X-Api-Key": "06ae1785f49a4d91a41654742df40235"
        }
      }
    );

    // Forward the JSON payload back to your React app
    res.json(response.data);
  } catch (err) {
    console.error("NewsAPI proxy error:", err.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

module.exports = router;
