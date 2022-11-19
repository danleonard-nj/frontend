import { Tab, Tabs } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedLogsTab } from '../../store/kubeLogs/kubeLogSlice';
import { KubernetesLogNamespaceTab } from '../kubelogs/KubernetesLogNamespaceTab';
import { KubernetesLogsTab } from '../kubelogs/KubernetesLogsTab';
import { KubernetesPodTab } from '../kubelogs/KubernetesPodTab';

const DashboardKubernetesLogLayout = () => {
  const dispatch = useDispatch();
  const selectedLogsTab = useSelector((x) => x.kubeLogs.selectedLogsTab);

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
        <Tab label='Logs' value={2} />
      </Tabs>
      {selectedLogsTab === 0 && <KubernetesLogNamespaceTab />}
      {selectedLogsTab === 1 && <KubernetesPodTab />}
      {selectedLogsTab === 2 && <KubernetesLogsTab />}
    </>
  );
};

export { DashboardKubernetesLogLayout };
