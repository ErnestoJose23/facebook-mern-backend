const router = require("express").Router();
const Comment = require("../models/commentModel");
const Feed = require("../models/feedModel");

router.post("/uploadComment", async (req, res) => {
  try {
    console.log(req.body);
    let { user_id, displayName, post_id, comment } = req.body;

    const newCommentM = new Comment({
      user_id,
      displayName,
      comment,
    });
    console.log(newCommentM);
    const savedComment = await newCommentM.save().then((docComment) => {
      console.log("\n>> Created Comment:\n", docComment);

      return Feed.findByIdAndUpdate(
        post_id,
        { $push: { comments: docComment._id } },
        { new: true, useFindAndModify: false }
      );
    });

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

router.get(`/getComments/:post_id`, async (req, res) => {
  try {
    const comments = await Comment.find({ feed_id: req.params.post_id });
    if (!comments) {
      return res.status(400).json({ msg: "No comments." });
    } else {
      res.status(200).send(comments);
    }
  } catch {
    return res.status(400).json({ msg: "No comments found." });
  }
});

module.exports = router;
