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
import fitnessSlice from './fitness/fitnessSlice';
import locationSlice from './locations/locationSlice';
import kubeLogsSlice from './kubeLogs/kubeLogSlice';
import featureSlice from './features/featureSlice';
import emailSlice from './email/emailSlice';
import chatGptSlice from './chatgpt/chatGptSlice';
import nestSlice from './nest/nestSlice';
import bankSlice from './bank/bankSlice';
import weatherSlice from './weather/weatherSlice';
import torrentSlice from './torrents/torrentSlice';
import apiEventSlice from './apiEvents/apiEventSlice';
import dmsSlice from './dms/dmsSlice';
import journalSlice from './journal/journalSlice';

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
  fitness: fitnessSlice,
  location: locationSlice,
  kubeLogs: kubeLogsSlice,
  feature: featureSlice,
  email: emailSlice,
  chatgpt: chatGptSlice,
  nest: nestSlice,
  bank: bankSlice,
  weather: weatherSlice,
  torrents: torrentSlice,
  apiEvents: apiEventSlice,
  dms: dmsSlice,
  journal: journalSlice,
});

export default rootReducer;
