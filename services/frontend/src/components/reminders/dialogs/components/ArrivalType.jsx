import { TextField } from '@mui/material';
import React from 'react';

const arrivalType = {
  early: 'Early',
  late: 'Late',
};

export const ArrivalType = ({ destinationReminder }) => {
  return (
    <>
      {destinationReminder?.arrival?.arrivalType == arrivalType.early && (
        <TextField
          fullWidth
          id='reminder-destination-transit-early-by-textbox'
          label='Early By'
          name='earlyByTimespan'
          value={destinationReminder?.arrival?.earlyByTimeSpan ?? ''}
          InputProps={{
            readOnly: true,
          }}
        />
      )}
      {destinationReminder?.arrival?.arrivalType == arrivalType.late && (
        <TextField
          fullWidth
          id='reminder-destination-transit-early-by-textbox'
          label='Late By'
          name='lateByTimespan'
          value={destinationReminder?.arrival?.lateByTimeSpan ?? ''}
          InputProps={{
            readOnly: true,
          }}
        />
      )}
    </>
  );
};
