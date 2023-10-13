import { Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { toDateString } from '../../api/helpers/dateTimeUtils';
import { setEntryDateRangeParams } from '../../store/journal/journalSlice';
import { DateRangeSelector } from '../DateRangeSelector';

const StyledPaper = ({ el, children }) => {
  return (
    <Paper
      elevation={el}
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      {children}
    </Paper>
  );
};

const JournalEntryDateRangeSelector = () => {
  const { entryDateRangeParams } = useSelector((x) => x.journal);

  const handleStartDateChange = (startDate) => {
    const parsedDate = toDateString(startDate);
    dispatch(
      setEntryDateRangeParams({
        ...entryDateRangeParams,
        startDate: parsedDate,
      })
    );
  };

  const handleEndDateChange = (endDate) => {
    const parsedDate = toDateString(endDate);
    dispatch(
      setEntryDateRangeParams({
        ...entryDateRangeParams,
        endDate: parsedDate,
      })
    );
  };

  const dispatch = useDispatch();

  return (
    <StyledPaper el={2}>
      <DateRangeSelector
        startDate={entryDateRangeParams?.startDate ?? ''}
        setStartDate={handleStartDateChange}
        endDate={entryDateRangeParams?.endDate ?? ''}
        setEndDate={handleEndDateChange}
      />
    </StyledPaper>
  );
};

export { JournalEntryDateRangeSelector };
