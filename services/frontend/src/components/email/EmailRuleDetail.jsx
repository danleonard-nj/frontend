import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { actionType } from '../../api/data/email';
import {
  deleteEmailRule,
  updateEmailRule,
} from '../../store/email/emailActions';
import { setEmailRule } from '../../store/email/emailSlice';
import Spinner from '../Spinner';
import DashboardTitle from '../dashboard/DashboardTitle';

const formatJson = (data) => {
  return data ? JSON.stringify(data, null, 4) : '';
};

const jsonTableHeight = 250;

const EmailRuleDetail = () => {
  const dispatch = useDispatch();

  const { emailRuleLoading, emailRule } = useSelector((x) => x.email);

  const handleRuleValueUpdate = (value, field) => {
    dispatch(
      setEmailRule({
        ...emailRule,
        [field]: value,
      })
    );
  };

  const handleDeleteRule = () => {
    dispatch(deleteEmailRule(emailRule.rule_id));
  };

  const handleUpdateRule = () => {
    dispatch(updateEmailRule(emailRule));
  };

  const onJsonChange = (value) => {
    dispatch(
      setEmailRule({
        ...emailRule,
        data: JSON.parse(value),
      })
    );
  };

  return emailRuleLoading ? (
    <Spinner />
  ) : (
    <>
      <Grid container spacing={3}>
        <Grid item lg={12}>
          <Box display='flex' justifyContent='space-between'>
            <DashboardTitle>{emailRule.name}</DashboardTitle>
            <ButtonGroup variant='text'>
              <Button onClick={handleUpdateRule}>Save</Button>
              <Button color='error' onClick={handleDeleteRule}>
                Delete
              </Button>
            </ButtonGroup>
          </Box>
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
                onChange={(event) =>
                  handleRuleValueUpdate(
                    event.target.value,
                    event.target.name
                  )
                }
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
                onChange={(event) =>
                  handleRuleValueUpdate(
                    event.target.value,
                    event.target.name
                  )
                }
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
                onChange={(event) =>
                  handleRuleValueUpdate(
                    event.target.value,
                    event.target.name
                  )
                }
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
                onChange={(event) =>
                  handleRuleValueUpdate(
                    event.target.value,
                    event.target.name
                  )
                }
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
                  onChange={(event) =>
                    handleRuleValueUpdate(
                      event.target.value,
                      event.target.name
                    )
                  }>
                  {Object.values(actionType).map((actionType) => (
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
          <Grid item lg={12} xs={12} marginTop='2rem'>
            {Object.keys(emailRule.data).length > 0 && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Key</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(emailRule.data).map((key) => (
                    <TableRow hover key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>
                        {emailRule.data[key].toString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export { EmailRuleDetail };
