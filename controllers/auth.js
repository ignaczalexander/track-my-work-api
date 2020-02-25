const User = require('../models/User');
const keys = require('../config/keys');
const request = require('request');
const jwt = require('jsonwebtoken');

const createToken = function(user) {
  console.log('create token', user);
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
    console.log('decoded in authcheck', decoded);
    User.findById(decoded.id).then(user => {
      console.log('id', decoded.id);
      if (user) {
        req.user = decoded;
        next();
      } else {
        return res.status(401).json({ msg: 'User not found' });
      }
    });
  });
};
exports.inspectToken = (req, res, next) => {
  //inspect access token from query

  // if valid, check if already in db
  console.log('reqqq', req.query.accessToken);
  const url = `https://graph.facebook.com/debug_token?input_token=${req.query.accessToken}&access_token=763335677424281|efd05beebac92d2759514448160c8713`;
  request(url, function(error, response, body) {
    console.error('error:', error); // Print the error if one occurred

    const responseObj = JSON.parse(body);
    const { is_valid, user_id } = responseObj.data;
    console.log('userid', user_id);
    console.log('isvalid', is_valid);
    if (responseObj.data.is_valid) {
      next();
    } else {
      return res.status(401).json({ msg: 'Token invalid' });
    }
  });
};

exports.getUserData = (req, res, next) => {
  const url = `https://graph.facebook.com/v4.0/me?access_token=${req.query.accessToken}&fields=email,name`;
  request(url, function(error, response, body) {
    const userData = JSON.parse(body);
    console.log('userdata', userData);
    User.findOne({
      $or: [{ facebookId: userData.id }, { email: userData.email }]
    }).then(user => {
      console.log('userfff', user);
      if (!user) {
        console.log('in if');
        const newUser = new User({
          name: userData.name,
          email: userData.email,
          facebookId: userData.id
        });
        newUser
          .save()
          .then(savedUser => {
            console.log('savedUser', savedUser);
            // set req.user
            req.user = {
              id: savedUser.id,
              email: savedUser.email,
              name: savedUser.name
            };
            next();
          })
          .catch(err => console.log('err', err));
      }
      console.log('gottenuser', user);
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name
      };
      next();
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
