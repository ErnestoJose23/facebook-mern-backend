const router = require("express").Router();
const Comment = require("../models/commentModel");

router.post("/uploadComment", async (req, res) => {
  try {
    console.log(req.body);
    let { user_id_comment, post_id, displayName, comment } = req.body;
    const user_id = user_id_comment;
    const feed_id = post_id;
    const newComment = new Comment({
      user_id,
      feed_id,
      displayName,
      comment,
    });
    console.log(newComment);
    const savedComment = await newComment.save();
    res.json(savedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/sync", (req, res) => {
  const sort = { _id: -1 };
  Comment.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  }).sort(sort);
});

module.exports = router;
