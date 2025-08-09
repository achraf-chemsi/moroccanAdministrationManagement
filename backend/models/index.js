const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');
const Equipment = require('./Equipment');
const Contract = require('./Contract');
const ContractHistory = require('./ContractHistory');
const CalendarEvent = require('./CalendarEvent');
const ContractAttachment = require('./ContractAttachment');
const ContractComment = require('./ContractComment');
const Department = require('./Department');
const DepartmentHistory = require('./DepartmentHistory');

// Define associations
User.hasMany(Project, { as: 'managedProjects', foreignKey: 'managerId' });
User.belongsToMany(Project, { through: 'ProjectMembers', as: 'projects' });

Project.hasMany(Task);
Task.belongsTo(Project);

// Contract associations
User.hasMany(Contract, { as: 'createdContracts', foreignKey: 'createdById' });
User.hasMany(Contract, { as: 'updatedContracts', foreignKey: 'updatedById' });
Contract.belongsTo(User, { as: 'createdBy', foreignKey: 'createdById' });
Contract.belongsTo(User, { as: 'updatedBy', foreignKey: 'updatedById' });

// Contract History associations
User.hasMany(ContractHistory, { as: 'contractChanges', foreignKey: 'changedById' });
Contract.hasMany(ContractHistory);
ContractHistory.belongsTo(User, { as: 'changedBy', foreignKey: 'changedById' });
ContractHistory.belongsTo(Contract);

// Department associations
User.hasMany(Department, { as: 'managedDepartments', foreignKey: 'managerId' });
User.hasMany(Department, { as: 'createdDepartments', foreignKey: 'createdById' });
User.hasMany(Department, { as: 'updatedDepartments', foreignKey: 'updatedById' });

Department.belongsTo(User, { as: 'manager', foreignKey: 'managerId' });
Department.belongsTo(User, { as: 'createdBy', foreignKey: 'createdById' });
Department.belongsTo(User, { as: 'updatedBy', foreignKey: 'updatedById' });

// Department History associations
User.hasMany(DepartmentHistory, { as: 'departmentChanges', foreignKey: 'changedById' });
Department.hasMany(DepartmentHistory);
DepartmentHistory.belongsTo(User, { as: 'changedBy', foreignKey: 'changedById' });
DepartmentHistory.belongsTo(Department);

// Calendar Event associations
User.hasMany(CalendarEvent, { as: 'createdEvents', foreignKey: 'createdById' });
CalendarEvent.belongsTo(User, { as: 'createdBy', foreignKey: 'createdById' });
CalendarEvent.belongsTo(Contract);
CalendarEvent.belongsToMany(User, { through: 'EventAttendees', as: 'attendees' });

// Contract Attachment associations
Contract.hasMany(ContractAttachment, {
  foreignKey: 'contractId'
});

ContractAttachment.belongsTo(Contract, {
  foreignKey: 'contractId'
});

ContractAttachment.belongsTo(User, {
  as: 'uploadedBy',
  foreignKey: 'uploadedById'
});

// Contract Comment associations
Contract.hasMany(ContractComment, {
  foreignKey: 'contractId'
});

ContractComment.belongsTo(Contract, {
  foreignKey: 'contractId'
});

ContractComment.belongsTo(User, {
  foreignKey: 'userId'
});

ContractComment.belongsTo(ContractComment, {
  as: 'parentComment',
  foreignKey: 'parentCommentId'
});

// Add hooks to Contract model
Contract.addHook('afterCreate', async (contract, options) => {
  await ContractHistory.create({
    contractId: contract.id,
    fieldName: 'all',
    changeType: 'create',
    changedById: contract.createdById
  });
});

Contract.addHook('afterUpdate', async (contract, options) => {
  const changes = contract.changed();
  for (const field of changes) {
    if (field !== 'updatedById' && field !== 'updatedAt') {
      await ContractHistory.create({
        contractId: contract.id,
        fieldName: field,
        oldValue: contract.previous(field),
        newValue: contract[field],
        changeType: 'update',
        changedById: contract.updatedById
      });
    }
  }
});

Contract.addHook('afterDestroy', async (contract, options) => {
  await ContractHistory.create({
    contractId: contract.id,
    fieldName: 'all',
    changeType: 'delete',
    changedById: contract.updatedById
  });
});

// Add hooks to Department model
Department.addHook('afterCreate', async (department, options) => {
  await DepartmentHistory.create({
    departmentId: department.id,
    fieldName: 'all',
    changeType: 'create',
    changedById: department.createdById
  });
});

Department.addHook('afterUpdate', async (department, options) => {
  const changes = department.changed();
  for (const field of changes) {
    if (field !== 'updatedById' && field !== 'updatedAt') {
      await DepartmentHistory.create({
        departmentId: department.id,
        fieldName: field,
        oldValue: department.previous(field),
        newValue: department[field],
        changeType: 'update',
        changedById: department.updatedById
      });
    }
  }
});

Department.addHook('afterDestroy', async (department, options) => {
  await DepartmentHistory.create({
    departmentId: department.id,
    fieldName: 'all',
    changeType: 'delete',
    changedById: department.updatedById
  });
});

// Export models
module.exports = {
  User,
  Project,
  Task,
  Equipment,
  Contract,
  ContractHistory,
  CalendarEvent,
  ContractAttachment,
  ContractComment,
  Department,
  DepartmentHistory
}; 