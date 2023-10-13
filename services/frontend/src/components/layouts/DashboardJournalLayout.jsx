import {
  Box,
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  styled,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCategories,
  getEntries,
  getUnits,
} from '../../store/journal/journalActions';
import { setEntryDateRangeParams } from '../../store/journal/journalSlice';
import { DataGrid } from '@mui/x-data-grid';
import { DateRangeSelector } from '../DateRangeSelector';
import { toDateString } from '../../api/helpers/dateTimeUtils';
import {
  tableColumns,
  transformJournalData,
} from '../../api/data/journal';

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

const TableContainer = styled(Box)(({ theme }) => ({
  height: '75vh',
  width: '100%',
}));

const JournalEntryTable = () => {
  const [data, setData] = useState([]);

  const {
    entries = [],
    entriesLoading = true,
    categories = [],
    categoriesLoading = true,
    units = [],
    unitsLoading = true,
  } = useSelector((x) => x.journal);

  useEffect(() => {
    setData(transformJournalData(entries, categories, units));
  }, [entries]);

  return (
    <TableContainer>
      <DataGrid
        rows={data}
        columns={tableColumns}
        loading={entriesLoading || categoriesLoading || unitsLoading}
      />
    </TableContainer>
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

const getTodayEntries = (entries) => {
  const results = entries.filter(
    (x) =>
      toDateString(new Date(x.entry_date)) ===
      toDateString(new Date())
  );

  return results.map((x) => ({
    ...x,
    id: x.entry_id,
  }));
};

const JournalTodayTab = () => {
  const [data, setData] = useState([]);

  const {
    entries = [],
    entriesLoading = true,
    categories = [],
    categoriesLoading = true,
    units = [],
    unitsLoading = true,
  } = useSelector((x) => x.journal);

  const handleRefresh = () => {
    dispatch(getEntries());
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const filtered = getTodayEntries(entries);
    setData(transformJournalData(filtered, categories, units));
  }, [entries]);

  return (
    <StyledPaper el={2}>
      <Grid item lg={12} xs={12} sm={12}>
        <Grid item lg={12} xs={12} sm={12}>
          <DataGrid
            rows={data}
            columns={tableColumns}
            loading={
              entriesLoading || categoriesLoading || unitsLoading
            }
          />
        </Grid>
        <Grid item lg={12} xs={12} sm={12} align='right'>
          <Button onClick={handleRefresh}>Refresh</Button>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

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
