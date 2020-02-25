const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Token = require('../../models/Token');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const crypto = require('crypto');

const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY } = require('../../config/keys');
const authController = require('../../controllers/auth');

const host = process.env.HOST;

//load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const { validateEditName } = require('../../validation/editProfile');
const { validateNewPassword } = require('../../validation/editProfile');

router.post('/register', (req, res) => {
  const { errors, isValid, role } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        roles: role
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              const token = new Token({
                _userId: user._id,
                token: crypto.randomBytes(16).toString('hex')
              });
              token
                .save()
                .then(token => {
                  sgMail.setApiKey(SENDGRID_API_KEY);
                  const msg = {
                    to: user.email,
                    from: 'info@trackmywork.com',
                    subject: 'Verify your account',
                    text: req.body.text,
                    html: `<h1>Welcome, name</h1>
                      <p>To confirm your TrackMyWork registration, please click on the button below</p>
    <a style="background-color: #19c8a4;
    color: white;
    border-radius: 14px;
    padding: 0.25rem 1rem;
    border: none;text-decoration: none;cursor: pointer;font-size:1rem;" href='http://${req.headers.host}/confirm/${token.token}'>Confirm</a>
`
                  };
                  sgMail
                    .send(msg)
                    .then(() => {
                      return res.status(200).send({
                        message: 'A verification mail has been sent.'
                      });
                    })
                    .catch(err => {
                      return res.status(500).send({
                        message: `Impossible to send email to ${user.email}`
                      });
                    });
                })
                .catch();
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.put('/password', authController.authenticate, (req, res) => {
  const { errors, isValid } = validateNewPassword(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const password = req.body.password;
  const newPassword = req.body.newPassword;
  User.findById(req.user.id).then(user => {
    if (!user) return res.status(404).json({ usernotfound: 'User not found' });

    //check current password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newPassword, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user.save().then(user => {
            //create jwt payload
            const payload = {
              id: user._id,
              name: user.name
            };
            //sign token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({ success: true, token: 'Bearer ' + token });
              }
            );
          });
        });
      });
    });
  });
});
router.post(
  '/facebook',
  authController.inspectToken,
  authController.getUserData,
  authController.generateToken,
  authController.sendToken
);
// @route GET api/users/login
// @desc Login user / Returning JWT Token
// @access Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User matched
        // Make sure the user has been verified
        if (!user.isVerified)
          return res.status(401).send({
            notverified: 'Your account has not been verified.'
          });

        //create jwt payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email
        };
        //sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: '30d' },
          (err, token) => {
            res.json({ success: true, token });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

router.get('/confirm/:token', (req, res) => {
  Token.findOne({ token: req.params.token })
    .then(token => {
      if (!token) {
        return res.status(400).json({
          message:
            'We were unable to find a valid token. Your token my have expired.'
        });
      }

      User.findById(token._userId)
        .then(user => {
          if (!user) {
            return res.status(400).json({
              message: `We were unable to find a user for this token.`
            });
          }
          if (user.isVerified) {
            return res
              .status(400)
              .json({ message: 'This user has already been verified.' });
          }

          // Verify and save the user
          user.isVerified = true;
          user.expires = null;
          user
            .save()
            .then(user => {
              return res.status(200).json({
                message: 'The account has been verified. Please log in.'
              });
            })
            .catch(err => {
              return res.status(500).json({ message: err.message });
            });
        })
        .catch(err => {
          return res.status(500).json({ message: err.message });
        });
    })
    .catch(err => {
      return res.status(500).json({ message: err.message });
    });
});

router.put('/name', authController.authenticate, (req, res) => {
  const { errors, isValid } = validateEditName(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findById(req.user.id).then(user => {
    if (!user) return res.status(404).json({ usernotfound: 'User not found' });

    const newName = req.body.name;
    user.name = newName;
    user.save().then(user => {
      //create jwt payload
      const payload = {
        id: user._id,
        name: user.name
      };
      //sign token
      jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
        res.json({ success: true, token: 'Bearer ' + token });
      });
    });
  });
});
module.exports = router;
