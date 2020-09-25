const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  displayName: { type: String },
  title: { type: String },
  file: { type: String },
});

module.exports = Feed = mongoose.model("feed", feedSchema);
