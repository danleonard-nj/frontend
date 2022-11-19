import { Divider, List, ListItemButton, ListItemText } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getLogs } from '../../store/kubeLogs/kubeLogActions';
import {
  setSelectedLogsTab,
  setSelectedPod,
} from '../../store/kubeLogs/kubeLogSlice';

const KubernetesPodList = () => {
  const dispatch = useDispatch();
  const selectedNamespace = useSelector((x) => x.kubeLogs.selectedNamespace);
  const selectedNamespacePods = useSelector(
    (x) => x.kubeLogs.selectedNamespacePods
  );
  const selectedNamespacePodsLoading = useSelector(
    (x) => x.kubeLogs.selectedNamespacePodsLoading
  );

  const handleSelectPod = ({ name }) => {
    dispatch(setSelectedPod(name));
    dispatch(getLogs(selectedNamespace, name));
    dispatch(setSelectedLogsTab(2));
  };

  const PodList = () => {
    return (
      <List>
        {selectedNamespacePods.map((pod) => (
          <>
            <ListItemButton onClick={() => handleSelectPod(pod)}>
              <ListItemText>{pod.name}</ListItemText>
            </ListItemButton>
            <Divider />
          </>
        ))}
      </List>
    );
  };

  return !selectedNamespacePodsLoading && <PodList />;
};

export { KubernetesPodList };
