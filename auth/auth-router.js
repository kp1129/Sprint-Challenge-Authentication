const router = require("express").Router();
const bcrypt = require("bcryptjs");
const secrets = require('./secrets');
const jwt = require('jsonwebtoken');
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
  let { username, password } = req.body;

  // first, find them by username
  Users.findBy({ username })
  .then(([user]) => {
    // check that the passwords match
    if( user && bcrypt.compareSync(password, user.password)){
      // log them in
      // produce a token
      const token = generateToken(user);
      // send token to the client
      res.status(200).json({ message: "You are logged in!", token })
    } else {
      res.status(401).json({ message: "Check your username and/or password" })
    }
  })
  .catch(error => res.status(500).json({ message: "Login failed" }))
});

function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username
  };

  const secret = secrets.jwtSecret;

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
