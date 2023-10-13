import { Button, Grid, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  tableColumns,
  transformJournalData,
} from '../../api/data/journal';
import { toDateString } from '../../api/helpers/dateTimeUtils';
import {
  dialogType,
  openDialog,
} from '../../store/dialog/dialogSlice';
import { getEntries } from '../../store/journal/journalActions';

const StyledPaper = ({ el, children }) => {
  return (
    <Paper
      elevation={el}
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      {children}
    </Paper>
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

  const handleOpenAddEntryDialog = () => {
    console.log('open dialog');
    dispatch(openDialog([dialogType.journalAddEntryDialog]));
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const filtered = getTodayEntries(entries);
    setData(transformJournalData(filtered, categories, units));
  }, [entries]);

  return (
    <StyledPaper el={2}>
      <Grid item lg={12} xs={12} sm={12}>
        <Grid item lg={12} xs={12} sm={12} align='right'>
          <Button onClick={handleOpenAddEntryDialog}>Add</Button>
        </Grid>
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

export { JournalTodayTab };
