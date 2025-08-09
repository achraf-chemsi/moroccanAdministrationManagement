const getEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findByPk(req.params.id, {
      include: [
        { model: User, as: 'eventCreator' },
        { model: User, as: 'eventAttendees' },
        { model: Contract }
      ]
    });
    // ... rest of the code ...
  } catch (error) {
    // ... error handling ...
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.findAll({
      include: [
        { model: User, as: 'eventCreator' },
        { model: User, as: 'eventAttendees' },
        { model: Contract }
      ]
    });
    // ... rest of the code ...
  } catch (error) {
    // ... error handling ...
  }
}; 