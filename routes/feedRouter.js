const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const auth = require("../middleware/auth");
const path = require("path");
const Feed = require("../models/feedModel");
const File = require("../models/fileModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, req.headers.path + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
});

router.post("/uploadImg", upload.single("file"), async (req, res) => {
  console.log(req.body);
});

router.post("/upload", async (req, res) => {
  try {
    console.log(req.body);
    let { user_id, title, displayName, imagename, timestamp } = req.body;
    const newFeed = new Feed({
      user_id,
      displayName,
      imagename,
      title,
      timestamp,
    });

    const savedFeed = await newFeed.save();
    res.json(savedFeed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/sync", (req, res) => {
  const sort = { _id: -1 };
  Feed.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  }).sort(sort);
});

module.exports = router;
