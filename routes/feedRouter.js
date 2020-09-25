const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const auth = require("../middleware/auth");
const Feed = require("../models/feedModel");
const File = require("../models/fileModel");

const storage = multer.diskStorage({
  destination: "./public/",
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("file");

router.post("/upload", async (req, res) => {
  try {
    let { user_id, file, title, displayName } = req.body;
    if (file != undefined) {
      upload((req, res) => {
        const fileSaved = new File();
        fileSaved.meta_data = req.file;
        fileSaved.save().then(() => {
          res.send({ message: "uploaded successfully" });
        });
        file = fileSaved;
        console.log(fileSaved);
      });
    }

    console.log(user_id);
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
