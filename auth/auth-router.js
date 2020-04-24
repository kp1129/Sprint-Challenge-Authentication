const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("./authModel");

router.post("/register", (req, res) => {
  let user = req.body;
  // both username and password are required
  if (!user.username || !user.password) {
    res
      .status(400)
      .json({ message: "Please provide both username and password" });
  } else {
    // hash the password
    const rounds = process.env.HASH_ROUNDS || 14;
    const hash = bcrypt.hashSync(user.password, rounds);
    // store the hashed password
    user.password = hash;
    // save new user in the db
    Users.add(user)
      .then((response) => res.status(201).json(response))
      .catch((error) =>
        res.status(500).json({ message: "Could not add new user at this time" })
      );
  }
});

router.post("/login", (req, res) => {
  // implement login
});

module.exports = router;
