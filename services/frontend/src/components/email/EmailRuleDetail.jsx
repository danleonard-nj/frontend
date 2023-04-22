import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { actionType } from '../../api/data/email';
import Spinner from '../Spinner';
import DashboardTitle from '../dashboard/DashboardTitle';

const EmailRuleDetail = () => {
  const { emailRuleLoading, emailRule } = useSelector((x) => x.email);

  return emailRuleLoading ? (
    <Spinner />
  ) : (
    <>
      <Grid container spacing={3}>
        <Grid item lg={12}>
          <DashboardTitle>{emailRule.name}</DashboardTitle>
        </Grid>
        <Grid item lg={12}>
          <Grid container spacing={3}>
            <Grid item lg={9} xs={12}>
              <TextField
                required
                value={emailRule.name}
                id='email-rule-name-textbox'
                name='name'
                label='Rule Name'
                fullWidth
                variant='standard'
                // onChange={(event) =>
                //   handleChange(event.target.value, 'cron')
                // }
              />
            </Grid>
            <Grid item lg={3} xs={12}>
              <TextField
                required
                value={emailRule.max_results}
                id='email-rule-max-results-textbox'
                name='max_results'
                label='Max Results'
                type='number'
                fullWidth
                variant='standard'
                // onChange={(event) =>
                //   handleChange(event.target.value, 'cron')
                // }
              />
            </Grid>
            <Grid item lg={12} xs={12}>
              <TextField
                required
                value={emailRule.description}
                id='email-rule-description-textbox'
                name='description'
                label='Rule Description'
                fullWidth
                variant='standard'
                // onChange={(event) =>
                //   handleChange(event.target.value, 'cron')
                // }
              />
            </Grid>
            <Grid item lg={9} xs={12}>
              <TextField
                required
                value={emailRule.query}
                id='email-rule-query-textbox'
                name='query'
                label='Query'
                fullWidth
                variant='standard'
                // onChange={(event) =>
                //   handleChange(event.target.value, 'cron')
                // }
              />
            </Grid>
            <Grid item lg={3} xs={12}>
              <FormControl fullWidth>
                <InputLabel id='select-action-type-label'>
                  Action
                </InputLabel>
                <Select
                  labelId='select-action-type-label'
                  value={emailRule?.action ?? ''}
                  name='action'
                  label='Action'
                  // onChange={(event) => handleTaskChange(event)}
                >
                  {Object.keys(actionType).map((actionType) => (
                    <MenuItem key={actionType} value={actionType}>
                      {actionType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {emailRule?.modified_date && (
              <Grid item lg={12} xs={12}>
                <TextField
                  required
                  value={new Date(
                    emailRule?.modified_date
                  ).toLocaleString()}
                  id='email-rule-modified-date-textbox'
                  name='modified_date'
                  label='Modified Date'
                  fullWidth
                  InputProps={{ readOnly: true }}
                  variant='standard'
                />
              </Grid>
            )}
            <Grid item lg={12} xs={12}>
              <TextField
                required
                value={new Date(
                  emailRule?.created_date
                ).toLocaleString()}
                id='email-rule-created-date-textbox'
                name='created_date'
                label='Created Date'
                fullWidth
                InputProps={{ readOnly: true }}
                variant='standard'
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export { EmailRuleDetail };
