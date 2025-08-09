const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const departmentController = require('../controllers/departmentController');

// @route   GET api/departments
// @desc    Get all departments
// @access  Private
router.get('/', auth, departmentController.getAllDepartments);

// @route   GET api/departments/:id
// @desc    Get department by ID
// @access  Private
router.get('/:id', auth, departmentController.getDepartmentById);

// @route   POST api/departments
// @desc    Create new department
// @access  Private (Admin only)
router.post('/', [auth, roleCheck('admin', 'super_user')], departmentController.createDepartment);

// @route   PUT api/departments/:id
// @desc    Update department
// @access  Private (Admin only)
router.put('/:id', [auth, roleCheck('admin', 'super_user')], departmentController.updateDepartment);

// @route   DELETE api/departments/:id
// @desc    Delete department
// @access  Private (Admin only)
router.delete('/:id', [auth, roleCheck('admin', 'super_user')], departmentController.deleteDepartment);

// @route   GET api/departments/:id/history
// @desc    Get department history
// @access  Private
router.get('/:id/history', auth, departmentController.getDepartmentHistory);

module.exports = router; 