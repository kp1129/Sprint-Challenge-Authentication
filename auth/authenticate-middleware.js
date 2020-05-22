const jwt = require('jsonwebtoken');
const secrets = require('./secrets');

module.exports = (req, res, next) => {
  const secret = secrets.jwtSecret;
  const token = req.headers.authorization;

  if(token){
    // is it valid?
    jwt.verify(token, secret, (error, decodedToken) => {
      if(error) {
        res.status(401).json({ you: 'shall not pass!' });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    })
  } else {
    res.status(400).json({ message: "Please provide credentials" })
  }   
};
