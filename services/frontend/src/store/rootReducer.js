import { combineReducers } from '@reduxjs/toolkit';
import scheduleReducer from './schedule/scheduleSlice';
import taskReducer from './task/taskSlice';
import alertReducer from './alert/alertSlice';
import dashboardReducer from './dashboard/dashboardSlice';
import dialogReducer from './dialog/dialogSlice';
import deviceReducer from './kasa/deviceSlice';
import sceneReducer from './kasa/sceneSlice';
import flowReducer from './kasa/flowSlice';
import presetReducer from './kasa/presetSlice';
import shipEngineReducer from './shipEngine/shipEngineSlice';
import reverbReducer from './reverb/reverbSlice';
import reminderSlice from './reminders/reminderSlice';
import fitnessSlice from './fitness/fitnessSlice';
import locationSlice from './locations/locationSlice';
import kubeLogsSlice from './kubeLogs/kubeLogSlice';
import featureSlice from './features/featureSlice';

const rootReducer = combineReducers({
  schedule: scheduleReducer,
  task: taskReducer,
  alert: alertReducer,
  dashboard: dashboardReducer,
  dialog: dialogReducer,
  device: deviceReducer,
  scene: sceneReducer,
  flow: flowReducer,
  preset: presetReducer,
  shipEngine: shipEngineReducer,
  reverb: reverbReducer,
  reminders: reminderSlice,
  fitness: fitnessSlice,
  location: locationSlice,
  kubeLogs: kubeLogsSlice,
  feature: featureSlice,
});

export default rootReducer;
