const Department = require('../models/Department');
const User = require('../models/User');
const DepartmentHistory = require('../models/DepartmentHistory');

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['name', 'ASC']]
    });
    res.json(departments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: User,
          as: 'updatedBy',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'position']
        }
      ]
    });

    if (!department) {
      return res.status(404).json({ msg: 'Department not found' });
    }

    res.json(department);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create new department
exports.createDepartment = async (req, res) => {
  try {
    const { name, description, managerId } = req.body;

    // Check if department name already exists
    const existingDepartment = await Department.findOne({ where: { name } });
    if (existingDepartment) {
      return res.status(400).json({ msg: 'Department name already exists' });
    }

    const department = await Department.create({
      name,
      description,
      managerId,
      createdById: req.user.id,
      updatedById: req.user.id
    });

    const newDepartment = await Department.findByPk(department.id, {
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.status(201).json(newDepartment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const { name, description, managerId, isActive } = req.body;

    const department = await Department.findByPk(req.params.id);

    if (!department) {
      return res.status(404).json({ msg: 'Department not found' });
    }

    // Check if new name already exists (if name is being changed)
    if (name && name !== department.name) {
      const existingDepartment = await Department.findOne({ where: { name } });
      if (existingDepartment) {
        return res.status(400).json({ msg: 'Department name already exists' });
      }
    }

    await department.update({
      name,
      description,
      managerId,
      isActive,
      updatedById: req.user.id
    });

    const updatedDepartment = await Department.findByPk(department.id, {
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.json(updatedDepartment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);

    if (!department) {
      return res.status(404).json({ msg: 'Department not found' });
    }

    // Check if department has any users
    const userCount = await User.count({ where: { departmentId: department.id } });
    if (userCount > 0) {
      return res.status(400).json({ 
        msg: 'Cannot delete department with active users. Please reassign users first.' 
      });
    }

    await department.destroy();
    res.json({ msg: 'Department deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get department history
exports.getDepartmentHistory = async (req, res) => {
  try {
    const history = await DepartmentHistory.findAll({
      where: { departmentId: req.params.id },
      include: [
        {
          model: User,
          as: 'changedBy',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 