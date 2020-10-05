const mongoose = require("mongoose");

const friendrequestSchema = new mongoose.Schema({
  sender_id: { type: String, required: true },
  receiver_id: { type: String, required: true },
  state: { type: String },
});

module.exports = FriendRequest = mongoose.model(
  "friendRequest",
  friendrequestSchema
);
