// services/frontend/src/components/dashboard/Dashboard.jsx
import { Box } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { DashboardApiEventHistoryLayout } from '../layouts/DashboardApiEventHistoryLayout';
import { DashboardBankingLayout } from '../layouts/DashboardBankingLayout';
import { DashboardCalendarLayout } from '../layouts/DashboardCalendarLayout';
import { DashboardChatGPTLayout } from '../layouts/DashboardChatGPTLayout';
import { DashoardEmailRuleLayout } from '../layouts/DashboardEmailRuleLayout';
import { DashboardFeatureLayout } from '../layouts/DashboardFeatureLayout';
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
    <Box
      sx={{
        marginTop: 5,
        px: { xs: 2, sm: 3, md: 4 }, // Responsive horizontal padding
        width: '100%',
      }}
      id='dashboard-container'>
      {dashboardPage === 'schedules' && <DashboardScheduleLayout />}
      {dashboardPage === 'tasks' && <DashboardTaskLayout />}
      {dashboardPage === 'shipengine' && (
        <DashboardShipEngineLayout />
      )}
      {dashboardPage === 'reverb' && <DashboardReverbLayout />}
      {dashboardPage === 'locations' && (
        <DashboardLocationHistoryLayout />
      )}
      {dashboardPage === 'kubernetes' && (
        <DashboardKubernetesLogLayout />
      )}
      {dashboardPage === 'features' && <DashboardFeatureLayout />}
      {dashboardPage === 'email' && <DashoardEmailRuleLayout />}
      {/* {dashboardPage === 'chatgpt' && <DashboardChatGPTLayout />} */}
      {/* {dashboardPage === 'nest' && <DashboardNestLayout />} */}
      {dashboardPage === 'banking' && <DashboardBankingLayout />}
      {dashboardPage === 'calendar' && <DashboardCalendarLayout />}
      {/* {dashboardPage === 'torrents' && <DashboardTorrentLayout />} */}
      {dashboardPage === 'events' && (
        <DashboardApiEventHistoryLayout />
      )}
      {dashboardPage === 'podcasts' && <DashboardPodcastLayout />}
      {dashboardPage === 'redis' && (
        <DashboardRedisManagementLayout />
      )}
    </Box>
  );
}
