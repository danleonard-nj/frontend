import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../../../store/reminders/reminderSlice';

export const EditNotificationDialogLayout = () => {
  const dispatch = useDispatch();
  const notification = useSelector((x) => x.reminders.notification) ?? {};

  const handleChange = (event) => {
    dispatch(
      setNotification({
        ...notification,
        [event.target.name]: event.target.value,
      })
    );
  };

  return (
    <Card>
      <CardHeader title='Location' />
      <CardContent>
        <Grid container spacing={2} sx={{ padding: 1 }}>
          <Grid item lg={12}>
            <TextField
              fullWidth
              label='Name'
              name='notificationName'
              onChange={handleChange}
              value={notification.notificationName}
            />
          </Grid>
          <Grid item lg={12}>
            <TextField
              fullWidth
              label='Recipient'
              name='recipient'
              onChange={handleChange}
              value={notification.recipient}
            />
          </Grid>
          <Grid item lg={12}>
            <FormControl fullWidth>
              <InputLabel id='select-notification-type-label'>
                Notification Type
              </InputLabel>
              <Select
                labelId='select-notification-type-label'
                id='select-notification-type'
                value={notification?.notificationType ?? ''}
                label='Notification Type'
                name='notificationType'
                onChange={handleChange}>
                <MenuItem value='SMS'>SMS</MenuItem>
                <MenuItem value='Email'>Email</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
