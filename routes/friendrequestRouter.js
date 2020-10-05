const router = require("express").Router();
const FriendRequest = require("../models/friendrequestModel");

router.post("/sendrequest", async (req, res) => {
  try {
    console.log(req.body);
    let { sender_id, receiver_id } = req.body;
    const state = "Pending";
    const newFriendRequest = new FriendRequest({
      sender_id,
      receiver_id,
      state,
    });

    const savedFeed = await newFriendRequest.save();
    res.json(savedFeed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get(`/sync`, (req, res) => {
  FriendRequest.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

router.get(`/sync/:user1/:user2`, async (req, res) => {
  try {
    const frsender = await FriendRequest.find({
      sender_id: { $regex: req.params.user1, $options: "i" },
      receiver_id: { $regex: req.params.user2, $options: "i" },
    });
    const frreceiver = await FriendRequest.find({
      sender_id: { $regex: req.params.user2, $options: "i" },
      receiver_id: { $regex: req.params.user1, $options: "i" },
    });

    if (!frsender) {
      return res.status(400).json({ msg: "No user found." });
    } else {
      res.status(200).send(frsender);
    }
    if (!frreceiver) {
      return res.status(400).json({ msg: "No user found." });
    } else {
      res.status(200).send(frreceiver);
    }
  } catch {
    return res
      .status(400)
      .json({ msg: "No user found.", name: req.params.name });
  }
});

module.exports = router;
