import { Container, styled } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { DashoardEmailRuleLayout } from '../layouts/DashboardEmailRuleLayout';
import { DashboardFeatureLayout } from '../layouts/DashboardFeatureLayout';
import { DashboardFitnessLayout } from '../layouts/DashboardFitnessLayout';
import DashboardKasaLayout from '../layouts/DashboardKasaLayout';
import DashboardKasaSceneLayout from '../layouts/DashboardKasaSceneLayout';
import { DashboardKubernetesLogLayout } from '../layouts/DashboardKubernetesLogLayout';
import { DashboardLocationHistoryLayout } from '../layouts/DashboardLocationHistoryLayout';
import { DashboardNestLayout } from '../layouts/DashboardNestLayout';
import { DashboardReverbLayout } from '../layouts/DashboardReverbLayout';
import DashboardScheduleLayout from '../layouts/DashboardScheduleLayout';
import DashboardShipEngineLayout from '../layouts/DashboardShipEngineLayout';
import DashboardTaskLayout from '../layouts/DashboardTaskLayout';

const DashboardContainer = styled(Container)({
  marginTop: 5,
});

const Dashboard = () => {
  const dashboardPage = useSelector((x) => x.dashboard.page);

  return (
    <DashboardContainer maxWidth='xl' id='dashboard-container'>
      {dashboardPage === 'schedules' && <DashboardScheduleLayout />}
      {dashboardPage === 'tasks' && <DashboardTaskLayout />}
      {dashboardPage === 'kasa' && <DashboardKasaLayout />}
      {dashboardPage === 'scenes' && <DashboardKasaSceneLayout />}
      {dashboardPage === 'shipengine' && (
        <DashboardShipEngineLayout />
      )}
      {dashboardPage === 'reverb' && <DashboardReverbLayout />}
      {dashboardPage === 'fitness' && <DashboardFitnessLayout />}
      {dashboardPage === 'locations' && (
        <DashboardLocationHistoryLayout />
      )}
      {dashboardPage === 'kubernetes' && (
        <DashboardKubernetesLogLayout />
      )}
      {dashboardPage === 'features' && <DashboardFeatureLayout />}
      {dashboardPage === 'email' && <DashoardEmailRuleLayout />}
      {dashboardPage === 'nest' && <DashboardNestLayout />}
    </DashboardContainer>
  );
};

export { Dashboard };
