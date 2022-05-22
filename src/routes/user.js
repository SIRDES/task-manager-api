const express = require("express");
const User = require("../modal/user");
const auth = require("../middleware/auth");
const multer = require("../utils/multer");

const router = new express.Router();
// Request for creating a new user
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send("Email already exist!");
    }

    res.status(400).send(error);
  }
  // user
  //   .save()
  //   .then((user) => {
  //     res.status(201).send(user);
  //   })
  //   .catch((error) => {
  //     res.status(400).send(error);
  //   });
});

// reading a user profile
router.get("/users/me", auth, async (req, res) => {
  const user = req.user;
  res.send(user);
});

// Reading all users
// router.get("/users",auth, async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (error) {
//     res.status(500).send(error);
//   }
//   // User.find({})
//   //   .then((users) => {
//   //     res.send(users);
//   //   })
//   //   .catch((error) => {
//   //     res.status(500).send();
//   //   });
// });

// Read a user
router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
  // User.findById(_id)
  //   .then((user) => {
  //     if (!user) {
  //       return res.status(404).send();
  //     }
  //     res.send(user);
  //   })
  //   .catch((error) => {
  //     res.status(500).send();
  //   });
});

// Login a user
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(500).send("login error");
  }
});

// upload profile image
router.post(
  "/users/me/avatar",auth,multer.single("avatar"),
  async (req, res) => {
    try {
      req.user.avatar = req.file.buffer;
      await req.user.save();
      res.send("done");
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);
// Get profile image
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if(!user || !user.avatar){
      return res.status(404).send({status: "error", error: "No profile image found"})
    }
    res.set("Content-Type", "image/jpeg");
    res.send(user.avatar);
  } catch (error) {
    res.status(500).send({status: "error", error: error.message || "some error occurred"})
  }
})
//delete profile image
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send("Profile image deleted");
  } catch (error) {
    res.status(500).send({error: error.message})
  }
})
//logout a user from a device/session
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send({ message: "Logout successfully!" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//logout from all devices/sessions
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send({ message: "Logged out from all devices/sessions" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// user updating his/her profile
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates" });
  }
  try {
    // const user = await User.findById(req.params.id);

    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Updatitng a user by admin
// router.patch("/users/:id", async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["name", "email", "password", "age"];
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update)
//   );
//   if (!isValidOperation) {
//     return res.status(400).send({ error: "invalid updates" });
//   }
//   try {
//     const user = await User.findById(req.params.id);

//     updates.forEach((update) => {
//       user[update] = req.body[update];
//     });
//     await user.save();
//     // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     //   new: true,
//     //   runValidators: true,
//     // });

//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// a user delete his/her account
router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) {
    //   return res.status(404).send({ error: "user not found" });
    // }
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

// // Deleting a user by id as admin
// router.delete("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).send({ error: "user not found" });
//     }
//     res.send(user);
//   } catch (error) {
//     res.status(500).send();
//   }
// });

module.exports = router;
