const express = require("express");
const shortid = require("shortid");

const Url = require("../models/Url");

const router = express.Router();

router.post("/api/shorten", async (req, res) => {
  const { originalUrl } = req.body;
  const shortUrl = shortid.generate();
  try {
    const newUrl = new Url({ originalUrl, shortUrl });
    await newUrl.save();
    res.json({ originalUrl, shortUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

router.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  try {
    const url = await Url.findOneAndUpdate(
      { shortUrl },
      { $inc: { clicks: 1 } }, // Increment clicks by 1
      { new: true }
    );
    if (url) {
      res.redirect(url.originalUrl);
    } else {
      res.status(404).json("URL not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

router.get("/api/shorten/analytics/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  try {
    const url = await Url.findOne({ shortUrl });
    if (url) {
      res.json({
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        clicks: url.clicks,
        creationDate: url.creationDate,
      });
    } else {
      res.status(404).json("URL not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

router.get("/api/shorten/analytics", async (req, res) => {
  try {
    const urls = await Url.find({});
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

module.exports = router;
