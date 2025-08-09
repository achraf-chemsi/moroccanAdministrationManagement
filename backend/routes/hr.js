const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const User = require('../models/User');

// @route   GET api/hr/employees
// @desc    Get all employees
// @access  Private (HR and Admin only)
router.get('/employees', [auth, checkRole('admin', 'hr')], async (req, res) => {
  try {
    const employees = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/hr/employees/:id
// @desc    Get employee by ID
// @access  Private (HR and Admin only)
router.get('/employees/:id', [auth, checkRole('admin', 'hr')], async (req, res) => {
  try {
    const employee = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/hr/employees/:id
// @desc    Update employee
// @access  Private (HR and Admin only)
router.put('/employees/:id', [
  auth,
  checkRole('admin', 'hr'),
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('department', 'Department is required').not().isEmpty(),
    check('position', 'Position is required').not().isEmpty(),
    check('phoneNumber', 'Phone number is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    firstName,
    lastName,
    email,
    department,
    position,
    phoneNumber,
    role,
    isActive
  } = req.body;

  try {
    let employee = await User.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    await employee.update({
      firstName,
      lastName,
      email,
      department,
      position,
      phoneNumber,
      role,
      isActive
    });

    const updatedEmployee = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    res.json(updatedEmployee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/hr/employees/:id
// @desc    Delete employee
// @access  Private (Admin only)
router.delete('/employees/:id', [auth, checkRole('admin')], async (req, res) => {
  try {
    const employee = await User.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    await employee.destroy();
    res.json({ msg: 'Employee removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 