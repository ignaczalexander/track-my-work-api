const User = require('../models/User');
const keys = require('../config/keys');
const request = require('request');
const jwt = require('jsonwebtoken');

const createToken = function(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name
    },
    keys.secretOrKey,
    {
      expiresIn: 60 * 120 * 100
    }
  );
};
exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    res.status(401).json({ msg: 'Not authenticated!' });
    return;
  }

  jwt.verify(token, keys.secretOrKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ token: 'Token is invalid' });
    }
    //token valid, has an id, have to check if user is in db
    User.findById(decoded.id).then(user => {
      if (user) {
        req.user = decoded;
        next();
      } else {
        return res.status(401).json({ msg: 'User not found' });
      }
    });
  });
};

exports.generateToken = (req, res, next) => {
  req.token = createToken(req.user);
  next();
};

exports.sendToken = (req, res) => {
  res.status(200).json({ success: true, token: req.token });
};
