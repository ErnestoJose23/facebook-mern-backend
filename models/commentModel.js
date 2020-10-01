const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  displayName: { type: String },
  comment: { type: String },
});

module.exports = Comment = mongoose.model("comment", commentSchema);
