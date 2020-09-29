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
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
});

router.post("/uploadImg", async (req, res) => {
  const imagen = req.body.imagename;
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, imagen + path.extname(file.originalname));
    },
  });
  console.log(req.body);
});

router.post("/upload", async (req, res) => {
  try {
    let { user_id, title, displayName, imagename } = req.body;
    const newFeed = new Feed({
      user_id,
      displayName,
      imagename,
      title,
    });
    console.log(newFeed);
    //const savedFeed = await newFeed.save();
    //res.json(savedFeed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/sync", (req, res) => {
  Feed.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

module.exports = router;
