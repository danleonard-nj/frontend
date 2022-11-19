import React from 'react';
import { ReminderCronFrequencyFormSection } from './ReminderCronFrequencyFormSection';
import { ReminderSingleFrequencyFormSection } from './ReminderSingleFrequencyFormSection';

export const ReminderFrequencyFormSection = ({
  reminder,
  handleFormChange,
}) => {
  if (reminder.frequency_type == 'ONCE') {
    return <ReminderSingleFrequencyFormSection />;
  } else {
    return (
      <ReminderCronFrequencyFormSection
        reminder={reminder}
        handleFormChange={handleFormChange}
      />
    );
  }
};
