const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { CalendarEvent, User, Contract } = require('../models');
const { Op } = require('sequelize');

// @route   GET api/calendar
// @desc    Get all calendar events
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { start, end } = req.query;
    const where = {};
    
    if (start && end) {
      where.startDate = {
        [Op.between]: [new Date(start), new Date(end)]
      };
    }

    const events = await CalendarEvent.findAll({
      where,
      include: [
        { model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName'] },
        { model: Contract, attributes: ['id', 'contractNumber', 'title'] },
        { model: User, as: 'attendees', attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['startDate', 'ASC']]
    });

    res.json(events);
  } catch (err) {
    console.error('Calendar events fetch error:', err);
    res.status(500).json({ message: err.message });
  }
});

// @route   POST api/calendar
// @desc    Create a calendar event
// @access  Private
router.post('/', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('startDate', 'Start date is required').isDate(),
    check('endDate', 'End date is required').isDate(),
    check('eventType', 'Event type is required').isIn([
      'contract_deadline',
      'meeting',
      'inspection',
      'payment_due',
      'other'
    ])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      title,
      description,
      startDate,
      endDate,
      eventType,
      priority,
      location,
      attendees,
      reminder,
      reminderTime,
      contractId
    } = req.body;

    const event = await CalendarEvent.create({
      title,
      description,
      startDate,
      endDate,
      eventType,
      priority,
      location,
      attendees,
      reminder,
      reminderTime,
      contractId,
      createdById: req.user.id
    });

    // Add attendees if provided
    if (attendees && attendees.length > 0) {
      await event.setAttendees(attendees);
    }

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/calendar/:id
// @desc    Update a calendar event
// @access  Private
router.put('/:id', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('startDate', 'Start date is required').isDate(),
    check('endDate', 'End date is required').isDate(),
    check('eventType', 'Event type is required').isIn([
      'contract_deadline',
      'meeting',
      'inspection',
      'payment_due',
      'other'
    ])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const event = await CalendarEvent.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      eventType,
      priority,
      location,
      attendees,
      reminder,
      reminderTime,
      status
    } = req.body;

    const updatedEvent = await event.update({
      title,
      description,
      startDate,
      endDate,
      eventType,
      priority,
      location,
      attendees,
      reminder,
      reminderTime,
      status
    });

    // Update attendees if provided
    if (attendees && attendees.length > 0) {
      await event.setAttendees(attendees);
    }

    res.json(updatedEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/calendar/:id
// @desc    Delete a calendar event
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await CalendarEvent.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    await event.destroy();
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/calendar/upcoming
// @desc    Get upcoming events
// @access  Private
router.get('/upcoming', auth, async (req, res) => {
  try {
    const today = new Date();
    const events = await CalendarEvent.findAll({
      where: {
        startDate: {
          [Op.gte]: today
        },
        status: 'pending'
      },
      include: [
        { model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName'] },
        { model: Contract, attributes: ['id', 'contractNumber', 'projectTitle'] },
        { model: User, as: 'attendees', attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['startDate', 'ASC']],
      limit: 10
    });

    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 