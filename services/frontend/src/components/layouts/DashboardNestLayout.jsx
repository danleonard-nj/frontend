import { Button, Grid, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSensorInfo } from '../../store/nest/nestActions';
import { setSelectedSensor } from '../../store/nest/nestSlice';
import { GenericJsonEditor } from '../GenericJsonEditor';
import Spinner from '../Spinner';
import { SensorInfoCard } from '../nest/NestSensorCard';
import { NestSideNav } from '../nest/NestSideNav';

const NestSensorInfoPage = () => {
  const dispatch = useDispatch();
  const { sensorInfo, sensorInfoLoading, selectedSensor } =
    useSelector((x) => x.nest);

  const handleViewSensor = (sensor) => {
    dispatch(setSelectedSensor(sensor));
  };

  const handleRefreshSensorInfo = () => {
    dispatch(getSensorInfo());
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={6}>
        {sensorInfoLoading ? (
          <Spinner />
        ) : (
          <Grid container spacing={2}>
            {sensorInfo.map((sensor) => (
              <Grid item lg={6}>
                <SensorInfoCard
                  sensor={sensor}
                  onViewClick={() => handleViewSensor(sensor)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
      <Grid item lg={6}>
        <Grid container spacing={2}>
          <Grid item lg={12} align='right'>
            <Button
              variant='contained'
              onClick={handleRefreshSensorInfo}>
              Refresh
            </Button>
          </Grid>
          <Grid item lg={12}>
            <GenericJsonEditor
              value={JSON.stringify(selectedSensor, null, 2)}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const DashboardNestLayout = () => {
  const dispatch = useDispatch();

  const { selectedSensor = {} } = useSelector((x) => x.nest);

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
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { DashboardNestLayout };
