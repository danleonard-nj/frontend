import { Button, Grid, Paper } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEntries } from '../../store/journal/journalActions';
import { JournalEntryDateRangeSelector } from './JournalEntryDateRangeSelector';
import { JournalEntryTable } from './JournalEntryTable';

const StyledPaper = ({ el, children }) => {
  return (
    <Paper
      elevation={el}
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      {children}
    </Paper>
  );
};

const JournalHistoryTab = () => {
  const {
    entryDateRangeParams: { startDate, endDate },
  } = useSelector((x) => x.journal);

  const handleRefresh = () => {
    dispatch(getEntries());
  };

  useEffect(() => {
    dispatch(getEntries());
  }, [startDate, endDate]);

  const dispatch = useDispatch();

  return (
    <StyledPaper el={2}>
      <Grid item lg={12} xs={12} sm={12}>
        <Grid item lg={12} xs={12} sm={12} align='right'>
          <JournalEntryDateRangeSelector />
        </Grid>

        <Grid item lg={12} xs={12} sm={12}>
          <JournalEntryTable />
        </Grid>
        <Grid item lg={12} xs={12} sm={12} align='right'>
          <Button onClick={handleRefresh}>Refresh</Button>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export { JournalHistoryTab };
