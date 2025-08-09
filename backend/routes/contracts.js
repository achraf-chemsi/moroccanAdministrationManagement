const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const { Contract, ContractHistory, User, ContractAttachment, ContractComment } = require('../models');

// @route   GET api/contracts
// @desc    Get all contracts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      include: [
        { model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'updatedBy', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });
    res.json(contracts);
  } catch (error) {
    console.error('Contracts fetch error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET api/contracts/:id
// @desc    Get contract by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id, {
      include: [
        { model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'updatedBy', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: ContractAttachment },
        { model: ContractComment, include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }] },
        { model: ContractHistory, include: [{ model: User, as: 'changedBy', attributes: ['id', 'firstName', 'lastName', 'email'] }] }
      ]
    });
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.json(contract);
  } catch (error) {
    console.error('Contract fetch error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST api/contracts
// @desc    Create a contract
// @access  Private (Admin and Super User)
router.post('/', [
  auth,
  checkRole('super_user', 'administrator'),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('type', 'Type is required').not().isEmpty(),
    check('startDate', 'Start date is required').isDate(),
    check('endDate', 'End date is required').isDate()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const contract = await Contract.create({
      ...req.body,
      createdById: req.user.id,
      updatedById: req.user.id
    });
    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT api/contracts/:id
// @desc    Update a contract
// @access  Private (Admin and Super User)
router.put('/:id', [
  auth,
  checkRole('super_user', 'administrator'),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('type', 'Type is required').not().isEmpty(),
    check('startDate', 'Start date is required').isDate(),
    check('endDate', 'End date is required').isDate()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    await contract.update({
      ...req.body,
      updatedById: req.user.id
    });
    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE api/contracts/:id
// @desc    Delete a contract
// @access  Private (Super User only)
router.delete('/:id', [auth, checkRole('super_user')], async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    await contract.destroy();
    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET api/contracts/:id/history
// @desc    Get contract history
// @access  Private
router.get('/:id/history', auth, async (req, res) => {
  try {
    const history = await ContractHistory.findAll({
      where: { contractId: req.params.id },
      include: [{ model: User, as: 'changedBy', attributes: ['id', 'firstName', 'lastName', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Contract attachments routes
router.post('/:id/attachments', auth, async (req, res) => {
  try {
    const attachment = await ContractAttachment.create({
      ...req.body,
      contractId: req.params.id,
      uploadedById: req.user.id
    });
    res.status(201).json(attachment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Contract comments routes
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const comment = await ContractComment.create({
      ...req.body,
      contractId: req.params.id,
      userId: req.user.id
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 