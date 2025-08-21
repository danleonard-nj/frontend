import { Tab, Tabs } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedLogsTab } from '../../store/kubeLogs/kubeLogSlice';
import { KubernetesLogNamespaceTab } from '../kubelogs/KubernetesLogNamespaceTab';
import { KubernetesLogsTab } from '../kubelogs/KubernetesLogsTab';
import { KubernetesPodTab } from '../kubelogs/KubernetesPodTab';
import { EnhancedKubernetesLogs } from '../kubelogs/EnhancedKubernetesLogsContainer';

const DashboardKubernetesLogLayout = () => {
  const dispatch = useDispatch();
  const { selectedLogsTab } = useSelector((x) => x.kubeLogs);

  const handleTabChange = (tab) => {
    dispatch(setSelectedLogsTab(tab));
  };

  return (
    <>
      <Tabs
        value={selectedLogsTab}
        onChange={(event, tab) => handleTabChange(tab)}>
        <Tab label='Namespaces' value={0} />
        <Tab label='Pods' value={1} />
        <Tab label='Live Logs' value={2} />
        <Tab label='Logs (Legacy)' value={3} />
      </Tabs>
      {selectedLogsTab === 0 && <KubernetesLogNamespaceTab />}
      {selectedLogsTab === 1 && <KubernetesPodTab />}
      {selectedLogsTab === 2 && <EnhancedKubernetesLogs />}
      {selectedLogsTab === 3 && <KubernetesLogsTab />}
    </>
  );
};

export { DashboardKubernetesLogLayout };
