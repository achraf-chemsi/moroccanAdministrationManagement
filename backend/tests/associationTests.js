const { Contract, User, CalendarEvent } = require('../models');
const sequelize = require('../config/database');

async function testAssociations() {
  try {
    // Test Contract associations
    console.log('Testing Contract associations...');
    const contract = await Contract.findOne({
      include: [
        { model: User, as: 'contractCreator' },
        { model: User, as: 'updatedBy' }
      ]
    });

    if (contract) {
      console.log('Contract found with associations:');
      console.log('Contract Creator:', contract.contractCreator ? `${contract.contractCreator.firstName} ${contract.contractCreator.lastName}` : 'N/A');
      console.log('Updated By:', contract.updatedBy ? `${contract.updatedBy.firstName} ${contract.updatedBy.lastName}` : 'N/A');
    } else {
      console.log('No contracts found');
    }

    // Test CalendarEvent associations
    console.log('\nTesting CalendarEvent associations...');
    const event = await CalendarEvent.findOne({
      include: [
        { model: User, as: 'createdBy' },
        { model: User, as: 'eventAttendees' },
        { model: Contract }
      ]
    });

    if (event) {
      console.log('Calendar Event found with associations:');
      console.log('Created By:', event.createdBy ? `${event.createdBy.firstName} ${event.createdBy.lastName}` : 'N/A');
      console.log('Attendees:', event.eventAttendees ? event.eventAttendees.map(a => `${a.firstName} ${a.lastName}`).join(', ') : 'No attendees');
      console.log('Associated Contract:', event.Contract ? event.Contract.contractNumber : 'N/A');
    } else {
      console.log('No calendar events found');
    }

  } catch (error) {
    console.error('Error testing associations:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the tests
testAssociations(); 