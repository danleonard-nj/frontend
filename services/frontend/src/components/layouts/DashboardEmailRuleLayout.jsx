import {
  Container,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionType } from '../../api/data/email';
import {
  getEmailRule,
  getEmailRules,
} from '../../store/email/emailActions';
import { setSelectedEmailRule } from '../../store/email/emailSlice';
import Spinner from '../Spinner';
import DashboardTitle from '../dashboard/DashboardTitle';
import { EmailRuleDetail } from '../email/EmailRuleDetail';
import { EmailRuleList } from '../email/EmailRuleList';

const DashoardEmailRuleLayout = () => {
  const dispatch = useDispatch();
  const { selectedEmailRule } = useSelector((x) => x.email);

  useEffect(() => {
    console.log('Fetching email rules');
    dispatch(getEmailRules());
  }, []);

  useEffect(() => {
    console.log('Fetching rule: ', selectedEmailRule?.rule_id);
    dispatch(getEmailRule(selectedEmailRule?.rule_id));
  }, [selectedEmailRule]);

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
