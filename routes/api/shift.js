const express = require('express');
const router = express.Router();
const Shift = require('../../models/Shift');
const Period = require('../../models/Period');
const moment = require('moment');
const auth = require('../../controllers/auth');

const validateDateInput = require('../../validation/dateInput');

// post a shift
router.post('/:period_id', auth.authenticate, (req, res) => {
  const { errors, isValid } = validateDateInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // calculate difference between start and end date time
  let hours = moment(req.body.end_date).diff(
    moment(req.body.start_date),
    'hours',
    true
  );
  Period.findById(req.params.period_id)
    .then(period => {
      if (period.user.toString() !== req.user.id)
        return res
          .status(404)
          .json({ periodnotfound: 'Period not found by id' });

      const newShift = new Shift({
        user: req.user.id,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        hours
      });
      newShift
        .save()
        .then(shift => {
          //add shift to period
          period.shifts.push(shift);
          period.save().then(period => res.json(period));
        })
        .catch(err => console.log(err));
    })
    .catch(err =>
      res.status(404).json({ periodnotfound: 'Period not found by id' })
    );
});

// get all shifts
router.get('/', auth.authenticate, (req, res) => {
  Shift.find({ user: req.user.id })
    .then(shifts => res.json(shifts))
    .catch(err => res.status(400).json(err));
});

//get shift by id
router.get('/:id', auth.authenticate, (req, res) => {
  Shift.findById(req.params.id)
    .then(shift => {
      if (shift.user.toString() !== req.user.id)
        return res.status(404).json({ notFound: 'Shift not found by id' });
      res.json(shift);
    })
    .catch(err => res.status(404).json({ notFound: 'Shift not found by id' }));
});

// delete shift by id
router.delete('/:period_id/:shift_id', auth.authenticate, (req, res) => {
  Period.findById(req.params.period_id).then(period => {
    if (!period)
      return res.status(404).json({ periodnotfound: 'Period not found by id' });

    Shift.findById(req.params.shift_id.toString())
      .then(shift => {
        if (!shift)
          return res
            .status(404)
            .json({ notFound: 'Shift not found by id null' });

        if (shift.user.toString() !== req.user.id)
          return res
            .status(404)
            .json({ notFound: 'Shift not found by id - unau' });

        period.shifts = period.shifts.filter(s => {
          return s._id != shift._id.toString();
        });
        period
          .save()
          .then(() => shift.remove().then(() => res.json({ success: true })));
      })
      .catch(err => {
        console.log(err);

        res.status(404).json({ notFound: 'Shift not found by id' });
      });
  });
});

module.exports = router;
