const router = require("express").Router();
const FriendRequest = require("../models/friendrequestModel");
const User = require("../models/userModel");

router.post("/sendrequest", async (req, res) => {
  try {
    console.log(req.body);
    let { sender_id, receiver_id, senderName, senderAvatar } = req.body;
    const state = "Pending";
    const newFriendRequest = new FriendRequest({
      sender_id,
      receiver_id,
      senderName,
      senderAvatar,
      state,
    });

    const savedFeed = await newFriendRequest.save();
    res.json(savedFeed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/acceptRequest", async (req, res) => {
  try {
    console.log(req.body);

    FriendRequest.findByIdAndUpdate(
      { _id: FriendRequest_id },
      { state: "Confirmed" },

      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/addFriend/:user_1/:user_2", async (req, res) => {
  try {
    return User.findByIdAndUpdate(
      req.params.user_1,
      { $push: { users: req.params.user_2 } },
      { new: true, useFindAndModify: false }
    );
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

router.get(`/sync/:user/:state`, async (req, res) => {
  try {
    const fr = await FriendRequest.find({
      receiver_id: { $regex: req.params.user, $options: "i" },
      state: { $regex: req.params.state, $options: "i" },
    });

    if (!fr) {
      return res.status(400).json({ msg: "No user found." });
    } else {
      res.status(200).send(fr);
    }
  } catch {
    return res
      .status(400)
      .json({ msg: "No user found.", name: req.params.name });
  }
});

router.get(`/sync/:user1/:user2`, async (req, res) => {
  try {
    const frsender = await FriendRequest.find({
      sender_id: { $regex: req.params.user1, $options: "i" },
      receiver_id: { $regex: req.params.user2, $options: "i" },
      state: { $regex: "Pending", $options: "i" },
    });
    const frreceiver = await FriendRequest.find({
      sender_id: { $regex: req.params.user2, $options: "i" },
      receiver_id: { $regex: req.params.user1, $options: "i" },
      state: { $regex: "Pending", $options: "i" },
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
