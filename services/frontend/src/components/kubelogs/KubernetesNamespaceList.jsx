import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  filterPodsByNamespace,
  getPods,
} from '../../store/kubeLogs/kubeLogActions';
import {
  setSelectedLogsTab,
  setSelectedNamespace,
} from '../../store/kubeLogs/kubeLogSlice';
import Spinner from '../Spinner';

const KubernetesNamespaceList = () => {
  const dispatch = useDispatch();

  const { namespaces, namespacesLoading } = useSelector(
    (x) => x.kubeLogs
  );

  const handleSelectNamespace = (namespace) => {
    dispatch(setSelectedNamespace(namespace));
    dispatch(filterPodsByNamespace(namespace));
    dispatch(setSelectedLogsTab(1));
  };

  useEffect(() => {
    dispatch(getPods());
  }, []);

  const NamespaceList = () => {
    return (
      <List>
        {namespaces.map((namespace) => (
          <>
            <ListItemButton
              onClick={() => handleSelectNamespace(namespace)}>
              <ListItemText>{namespace}</ListItemText>
            </ListItemButton>
            <Divider />
          </>
        ))}
      </List>
    );
  };

  return namespacesLoading ? <Spinner /> : <NamespaceList />;
};

export { KubernetesNamespaceList };
