const express = require('express');
const router = express.Router();
const Period = require('../../models/Period');
const Shift = require('../../models/Shift');
const moment = require('moment');
const passport = require('passport');
const auth = require('../../controllers/auth.js');
const validateDateInput = require('../../validation/dateInput');

// create a new period
router.post('/', auth.authenticate, (req, res) => {
  const { errors, isValid } = validateDateInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const newPeriod = new Period({
    user: req.user.id,
    start_date: req.body.start_date,
    end_date: req.body.end_date
  });

  newPeriod
    .save()
    .then(period => res.json(period))
    .catch(err => console.log(err));
});

//get all periods
router.get('/', auth.authenticate, (req, res) => {
  Period.find({ user: req.user.id })
    .then(periods => res.json(periods))
    .catch(err => res.status(400).json(err));
});

//get period by id
router.get('/:id', auth.authenticate, (req, res) => {
  Period.findById(req.params.id)
    .then(period => {
      if (period.user.toString() !== req.user.id) {
        return res
          .status(404)
          .json({ periodnotfound: 'Period not found with id' });
      }

      res.json(period);
    })
    .catch(() =>
      res.status(404).json({ periodnotfound: 'Period not found with id' })
    );
});

//delete period by id
router.delete('/:id', auth.authenticate, (req, res) => {
  Period.findById(req.params.id)
    .then(period => {
      if (period.user.toString() !== req.user.id) {
        return res
          .status(404)
          .json({ periodnotfound: 'Period not found with id' });
      }
      period.shifts.map(s => {
        Shift.findByIdAndDelete(s._id.toString())
          .then()
          .catch(err => console.log(err));
      });
      period.remove().then(res.json({ success: true, msg: 'Period deleted' }));
    })
    .catch(() =>
      res.status(404).json({ periodnotfound: 'Period not found by id' })
    );
});

//delete all periods
router.delete('/', auth.authenticate, (req, res) => {
  Period.remove({ user: req.user.id })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(400).json(err));
});

//edit dates
router.put('/edit/:id', auth.authenticate, (req, res) => {
  const { errors, isValid } = validateDateInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Period.findById(req.params.id)
    .then(period => {
      if (!period)
        return res
          .status(404)
          .json({ periodnotfound: 'Period not found by id' });
      period.start_date = req.body.start_date;
      period.end_date = req.body.end_date;
      period
        .save()
        .then(period => {
          return res.json(period);
        })
        .catch(err => console.log(err));
    })
    .catch(err => {
      //console.log(err);

      res.status(404).json({ periodnotfound: 'Period not found by id' });
    });
});

module.exports = router;
