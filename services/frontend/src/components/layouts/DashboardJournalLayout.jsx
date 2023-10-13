import { Box, Grid, Paper, Tab, Tabs, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  getCategories,
  getUnits,
} from '../../store/journal/journalActions';
import { JournalHistoryTab } from '../journal/JournalHistoryTab';
import { JournalTodayTab } from '../journal/JournalTodayTab';

const StyledPaper = ({ el, children }) => {
  return (
    <Paper
      elevation={el}
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      {children}
    </Paper>
  );
};

const TableContainer = styled(Box)(({ theme }) => ({
  height: '75vh',
  width: '100%',
}));

const DashboardJournalLayout = () => {
  const [tab, setTab] = useState(0);

  const dispatch = useDispatch();

  const handleTabSelect = (event, value) => {
    setTab(value);
  };

  useEffect(() => {
    dispatch(getUnits());
    dispatch(getCategories());
  }, []);

  return (
    <StyledPaper el={2}>
      <Grid container spacing={2}>
        <Grid item lg={12} xs={12} sm={12}>
          <Tabs value={tab} onChange={handleTabSelect}>
            <Tab label='Today' />
            <Tab label='History' />
          </Tabs>
        </Grid>
        <Grid item lg={12} xs={12} sm={12}>
          {tab === 0 && <JournalTodayTab />}
          {tab === 1 && <JournalHistoryTab />}
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export { DashboardJournalLayout };
