const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

// @route   GET api/projects
// @desc    Get all projects
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // TODO: Implement project listing
    res.json({ message: 'Projects endpoint - to be implemented' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/projects
// @desc    Create a project
// @access  Private (Admin and Manager only)
router.post('/', [auth, checkRole('admin', 'manager')], async (req, res) => {
  try {
    // TODO: Implement project creation
    res.json({ message: 'Project creation - to be implemented' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 