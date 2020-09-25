const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const auth = require("../middleware/auth");
const User = require("../models/feedModel");

const storage = multer.diskStorage({
  destination: "./public/",
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("myfile");

router.post("/upload", async (req, res) => {
  try {
    let { user_id, file, title, displayName } = req.body;

    if (req.file != undefined) {
      const file = new File();
      file.meta_data = req.file;
      file.save().then(() => {
        res.send({ message: "uploaded successfully" });
      });
    }
    const newFeed = new Feed({
      user_id,
      displayName,
      file,
      title,
    });
    const savedFeed = await newFeed.save();
    res.json(savedFeed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

  /*Now do where ever you want to do*/
});

module.exports = router;
