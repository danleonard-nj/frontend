import { Container } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import DashboardFeatureLayout from '../layouts/DashboardFeatureLayout';
import { DashboardFitnessLayout } from '../layouts/DashboardFitnessLayout';
import DashboardKasaLayout from '../layouts/DashboardKasaLayout';
import DashboardKasaSceneLayout from '../layouts/DashboardKasaSceneLayout';
import { DashboardKubernetesLogLayout } from '../layouts/DashboardKubernetesLogLayout';
import { DashboardLocationHistoryLayout } from '../layouts/DashboardLocationHistoryLayout';
import DashboardRemindersLayout from '../layouts/DashboardRemindersLayout';
import DashboardReverbLayout from '../layouts/DashboardReverbLayout';
import DashboardScheduleLayout from '../layouts/DashboardScheduleLayout';
import DashboardShipEngineLayout from '../layouts/DashboardShipEngineLayout';
import DashboardTaskLayout from '../layouts/DashboardTaskLayout';

export default function Dashboard() {
  const dashboardPage = useSelector((x) => x.dashboard.page);

  return (
    <Container maxWidth='xl' sx={{ marginTop: 5 }} id='dashboard-container'>
      {dashboardPage === 'schedules' && <DashboardScheduleLayout />}
      {dashboardPage === 'tasks' && <DashboardTaskLayout />}
      {dashboardPage === 'kasa' && <DashboardKasaLayout />}
      {dashboardPage === 'scenes' && <DashboardKasaSceneLayout />}
      {dashboardPage === 'shipengine' && <DashboardShipEngineLayout />}
      {dashboardPage === 'reverb' && <DashboardReverbLayout />}
      {dashboardPage === 'reminders' && <DashboardRemindersLayout />}
      {dashboardPage === 'fitness' && <DashboardFitnessLayout />}
      {dashboardPage === 'locations' && <DashboardLocationHistoryLayout />}
      {dashboardPage === 'kubernetes' && <DashboardKubernetesLogLayout />}
      {dashboardPage === 'features' && <DashboardFeatureLayout />}
    </Container>
  );
}
