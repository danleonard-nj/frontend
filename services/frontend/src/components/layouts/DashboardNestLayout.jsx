import { Grid, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSensorInfo } from '../../store/nest/nestActions';
import { NestSensorInfoPage } from '../nest/NestSensorInfoPage';
import { NestSideNav } from '../nest/NestSideNav';
import { NestThermostatPage } from '../nest/NestThermostatPage';

const DashboardNestLayout = () => {
  const dispatch = useDispatch();

  const { selectedSensor = {}, commandLoading = false } = useSelector(
    (x) => x.nest
  );

  const [sideNav, setSideNav] = useState('sensor-info');

  console.log('Selected sensor', selectedSensor);
  console.log('Side nav', sideNav);

  const handleRefreshSensorInfo = () => {
    dispatch(getSensorInfo());
  };

  const handleSideNavChange = (value) => {
    console.log('side nav change', value);
    setSideNav(value);
  };

  useEffect(() => {
    if (sideNav === 'sensor-info') {
      dispatch(getSensorInfo());
    }
  }, [dispatch, sideNav]);

  // const NestPageHeader = () => {
  //   return (
  //     <Grid container>
  //       <Grid item lg={10}>
  //         <Typography variant='h5' gutterBottom>
  //           Sensor Info
  //         </Typography>
  //       </Grid>
  //       <Grid item lg={2} align='right'>
  //         <Button
  //           variant='contained'
  //           onClick={handleRefreshSensorInfo}
  //           sx={{ float: 'right' }}>
  //           Refresh
  //         </Button>
  //       </Grid>
  //     </Grid>
  //   );
  // };

  return (
    <Paper
      elevation={2}
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      {/* <Drawer
        variant='temporary'
        anchor='right'
        open={jsonSidebarOpen}
        onClose={setJsonSidebarOpen(false)}> */}

      {/* )
      </Drawer> */}
      <Grid container spacing={2}>
        <Grid item lg={3} xs={12} sm={12}>
          <NestSideNav selected={sideNav} onChange={setSideNav} />
        </Grid>
        <Grid item lg={9}>
          <Grid container spacing={2}>
            <Grid item lg={12}>
              {sideNav === 'sensor-info' && <NestSensorInfoPage />}
              {sideNav === 'thermostat' && <NestThermostatPage />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { DashboardNestLayout };
