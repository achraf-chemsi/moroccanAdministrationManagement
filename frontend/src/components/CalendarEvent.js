import React from 'react';
import { Typography } from '@material-ui/core';

const CalendarEvent = ({ event }) => {
  return (
    <div>
      <Typography variant="subtitle2" color="textSecondary">
        Attendees
      </Typography>
      <Typography variant="body1">
        {event.eventAttendees ? event.eventAttendees.map(attendee => 
          `${attendee.firstName} ${attendee.lastName}`
        ).join(', ') : 'No attendees'}
      </Typography>
    </div>
  );
};

export default CalendarEvent; 