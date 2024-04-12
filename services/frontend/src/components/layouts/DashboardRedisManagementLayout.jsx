import { Grid, Tab, Tabs } from '@mui/material';
import React from 'react';
import { RedisDiagnosticsTab } from '../redis/RedisDiagnosticsTab';
import { RedisKeyTab } from '../redis/RedisKeyListTab';

const DashboardRedisManagementLayout = () => {
  const [selectedTab, setSelectedTab] = React.useState('keys');

  const handleSetTab = (tab) => {
    console.log('Setting tab', tab);
    setSelectedTab(tab);
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={12}>
        {/* <Typography variant='h5'>Redis Management</Typography> */}
        <Tabs
          sx={{ marginBottom: '1rem' }}
          value={selectedTab}
          onChange={(e, tab) => handleSetTab(tab)}>
          <Tab label='Keys' value='keys' />
          <Tab label='Diagnostics' value='diagnostics' />
        </Tabs>
      </Grid>
      <Grid item lg={12}>
        {selectedTab === 'keys' && <RedisKeyTab />}
        {selectedTab === 'diagnostics' && <RedisDiagnosticsTab />}
      </Grid>
    </Grid>
  );
};

export { DashboardRedisManagementLayout };
