import { Container, Grid, Paper } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmailRules } from '../../store/email/emailActions';
import { EmailRuleDetail } from '../email/EmailRuleDetail';
import { EmailRuleList } from '../email/EmailRuleList';

const DashoardEmailRuleLayout = () => {
  const dispatch = useDispatch();
  const { selectedEmailRule } = useSelector((x) => x.email);

  useEffect(() => {
    dispatch(getEmailRules());
  }, []);

  return (
    <Container>
      <Grid container spacing={3}>
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
