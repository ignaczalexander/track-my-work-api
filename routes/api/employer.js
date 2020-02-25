const express = require('express');
const router = express.Router();
const Period = require('../../models/Period');
const Shift = require('../../models/Shift');
const moment = require('moment');
const User = require('../../models/User');
const auth = require('../../controllers/auth');
const validateEmail = require('../../validation/email');

//add a user for this employer
router.post('/add-employee', auth.authenticate, (req, res) => {
  const { errors, isValid } = validateEmail(req.body);
  if (!isValid) return res.status(400).json(errors);

  if (req.user.roles.indexOf('employer') == -1) {
    return res.status(403).json({ unauthorized: 'You are not an employer' });
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user)
        return res
          .status(404)
          .json({ usernotfound: 'User not found with this email' });

      if (
        req.user.employees.some(employee => {
          return employee._id.toString() === user._id.toString();
        })
      )
        return res.status(400).json({ msg: 'User already added' });

      if (user._id.toString() === req.user._id.toString())
        return res.status(400).json({ msg: "You can't add yourself" });

      req.user.employees.push(user);
      req.user.save().then(() => res.json({ scs: 'True' }));
    })
    .catch(err => console.log(err));
});

//get periods from employer users
router.get('/employees', auth.authenticate, (req, res) => {
  if (req.user.roles.indexOf('employer') == -1) {
    return res.status(403).json({ unauthorized: 'You are not an employer' });
  }

  User.findById(req.user._id)
    .then(user => {
      if (!user)
        return res
          .status(404)
          .json({ usernotfound: 'User not found with this id' });
      return res.json(user.employees);
    })

    .catch(err => console.log(err));
});
module.exports = router;
