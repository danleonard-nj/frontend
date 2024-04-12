import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearEmailRule,
  getEmailRules,
} from '../../store/email/emailActions';
import { EmailRuleDetail } from '../email/EmailRuleDetail';
import { EmailRuleList } from '../email/EmailRuleList';
import {
  dialogType,
  openDialog,
} from '../../store/dialog/dialogSlice';
import { setEmailRule } from '../../store/email/emailSlice';

const DashoardEmailRuleLayout = () => {
  const dispatch = useDispatch();
  const { selectedEmailRule } = useSelector((x) => x.email);

  const handleOpenCreateDialog = () => {
    dispatch(clearEmailRule());
    dispatch(openDialog(dialogType.createEmailRuleDialog));
  };

  const handleRefresh = () => {
    dispatch(getEmailRules());
  };

  useEffect(() => {
    dispatch(getEmailRules());
  }, []);

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item lg={12}>
          <Box
            display='flex'
            alignItems='flex-end'
            justifyContent='flex-end'>
            {' '}
            {/* Modified line */}
            <ButtonGroup>
              <Button onClick={handleRefresh}>Refresh</Button>
              <Button onClick={handleOpenCreateDialog}>Create</Button>
            </ButtonGroup>
          </Box>
        </Grid>
        <Grid item lg={4} xs={12}>
          <Paper sx={{ padding: 2 }}>
            <EmailRuleList />
          </Paper>
        </Grid>
        <Grid item lg={8} xs={12}>
          <Paper sx={{ padding: 2 }}>
            {selectedEmailRule && <EmailRuleDetail />}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export { DashoardEmailRuleLayout };
