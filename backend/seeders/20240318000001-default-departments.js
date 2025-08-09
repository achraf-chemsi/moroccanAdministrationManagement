'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, get the admin user ID
    const adminUser = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE email = 'admin@example.com' LIMIT 1;`
    );

    const adminId = adminUser[0][0].id;

    await queryInterface.bulkInsert('Departments', [
      {
        name: 'IT',
        description: 'Information Technology Department',
        managerId: adminId,
        isActive: true,
        createdById: adminId,
        updatedById: adminId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'HR',
        description: 'Human Resources Department',
        managerId: adminId,
        isActive: true,
        createdById: adminId,
        updatedById: adminId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Finance',
        description: 'Finance and Accounting Department',
        managerId: adminId,
        isActive: true,
        createdById: adminId,
        updatedById: adminId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Marketing',
        description: 'Marketing and Communications Department',
        managerId: adminId,
        isActive: true,
        createdById: adminId,
        updatedById: adminId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Operations',
        description: 'Operations and Logistics Department',
        managerId: adminId,
        isActive: true,
        createdById: adminId,
        updatedById: adminId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Departments', null, {});
  }
}; 