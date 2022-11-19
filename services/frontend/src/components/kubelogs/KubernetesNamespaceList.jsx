import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Slider,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  filterPodsByNamespace,
  getLogs,
  getPods,
} from '../../store/kubeLogs/kubeLogActions';
import {
  setLogTail,
  setSelectedLogsTab,
  setSelectedNamespace,
  setSelectedPod,
} from '../../store/kubeLogs/kubeLogSlice';
import Spinner from '../Spinner';

const KubernetesNamespaceList = () => {
  const dispatch = useDispatch();
  const namespaces = useSelector((x) => x.kubeLogs.namespaces) ?? [];
  const namespacesLoading = useSelector((x) => x.kubeLogs.namespacesLoading);

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
            <ListItemButton onClick={() => handleSelectNamespace(namespace)}>
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
