import { DialerSipSharp } from '@mui/icons-material';
import { Button, ButtonGroup } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getNewScene,
  getNewTask,
  parseSceneMapping,
} from '../../../api/data/kasa/scene';
import { updateFlowState } from '../../../store/kasa/actions/flowActions';
import {
  deleteScene,
  runScene,
  saveScene,
  updateSceneState,
} from '../../../store/kasa/actions/sceneActions';
import { setIsNew, setScene } from '../../../store/kasa/sceneSlice';
import { saveTask } from '../../../store/task/taskActions';
import { setTask } from '../../../store/task/taskSlice';

const KasaSceneToolbar = () => {
  const dispatch = useDispatch();
  const scene = useSelector((x) => x.scene.scene);
  const flow = useSelector((x) => x.flow.flow);
  const isNew = useSelector((x) => x.scene.isNew);

  const handleDeleteScene = () => {
    dispatch(deleteScene(scene.scene_id));
    handleNew();
  };

  const handleSceneRun = () => {
    dispatch(runScene(scene.scene_id));
  };

  const handleCreateTask = () => {
    const task = getNewTask(scene);
    dispatch(setTask(task));
    dispatch(saveTask());
  };

  const isButtonEnabled = () => {
    return scene?.scene_id != null || isNew;
  };

  const handleSave = () => {
    const model = parseSceneMapping(flow, scene);
    dispatch(saveScene(model));
  };

  const handleNew = () => {
    const newScene = getNewScene();
    dispatch(setScene(newScene));
    dispatch(setIsNew(true));
    dispatch(updateFlowState(() => []));
  };

  return (
    <ButtonGroup variant='text' fullWidth>
      <Button onClick={handleNew}>New</Button>
      <Button color='info' onClick={handleSave} disabled={!isButtonEnabled()}>
        Save
      </Button>
      <Button
        color='success'
        onClick={handleSceneRun}
        disabled={!isButtonEnabled()}>
        Run
      </Button>
      <Button
        color='warning'
        onClick={handleCreateTask}
        disabled={!isButtonEnabled()}>
        Task
      </Button>
      <Button
        color='error'
        onClick={handleDeleteScene}
        disabled={!isButtonEnabled()}>
        Delete
      </Button>
    </ButtonGroup>
  );
};

export default KasaSceneToolbar;
