import { Container } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { DashboardApiEventHistoryLayout } from '../layouts/DashboardApiEventHistoryLayout';
import { DashboardBankingLayout } from '../layouts/DashboardBankingLayout';
import { DashboardChatGPTLayout } from '../layouts/DashboardChatGPTLayout';
import { DashoardEmailRuleLayout } from '../layouts/DashboardEmailRuleLayout';
import { DashboardFeatureLayout } from '../layouts/DashboardFeatureLayout';
import DashboardKasaLayout from '../layouts/DashboardKasaLayout';
import DashboardKasaSceneLayout from '../layouts/DashboardKasaSceneLayout';
import { DashboardKubernetesLogLayout } from '../layouts/DashboardKubernetesLogLayout';
import { DashboardLocationHistoryLayout } from '../layouts/DashboardLocationHistoryLayout';
import { DashboardNestLayout } from '../layouts/DashboardNestLayout';
import DashboardReverbLayout from '../layouts/DashboardReverbLayout';
import { DashboardScheduleLayout } from '../layouts/DashboardScheduleLayout';
import DashboardShipEngineLayout from '../layouts/DashboardShipEngineLayout';
import DashboardTaskLayout from '../layouts/DashboardTaskLayout';
import { DashboardTorrentLayout } from '../layouts/DashboardTorrentLayout';
import { DashboardPodcastLayout } from '../layouts/DashboardPodcastLayout';
import { DashboardRedisManagementLayout } from '../layouts/DashboardRedisManagementLayout';

export default function Dashboard() {
  const dashboardPage = useSelector((x) => x.dashboard.page);

  return (
    <Container
      maxWidth='xl'
      sx={{ marginTop: 5 }}
      id='dashboard-container'>
      {dashboardPage === 'schedules' && <DashboardScheduleLayout />}
      {dashboardPage === 'tasks' && <DashboardTaskLayout />}
      {dashboardPage === 'kasa' && <DashboardKasaLayout />}
      {dashboardPage === 'scenes' && <DashboardKasaSceneLayout />}
      {dashboardPage === 'shipengine' && (
        <DashboardShipEngineLayout />
      )}
      {dashboardPage === 'reverb' && <DashboardReverbLayout />}
      {/* {dashboardPage === 'fitness' && <DashboardFitnessLayout />} */}
      {dashboardPage === 'locations' && (
        <DashboardLocationHistoryLayout />
      )}
      {dashboardPage === 'kubernetes' && (
        <DashboardKubernetesLogLayout />
      )}
      {dashboardPage === 'features' && <DashboardFeatureLayout />}
      {dashboardPage === 'email' && <DashoardEmailRuleLayout />}
      {dashboardPage === 'chatgpt' && <DashboardChatGPTLayout />}
      {dashboardPage === 'nest' && <DashboardNestLayout />}
      {dashboardPage === 'banking' && <DashboardBankingLayout />}
      {dashboardPage === 'torrents' && <DashboardTorrentLayout />}
      {dashboardPage === 'events' && (
        <DashboardApiEventHistoryLayout />
      )}
      {dashboardPage === 'podcasts' && <DashboardPodcastLayout />}
      {dashboardPage === 'redis' && (
        <DashboardRedisManagementLayout />
      )}
    </Container>
  );
}
