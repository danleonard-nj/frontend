import { combineReducers } from '@reduxjs/toolkit';
import alertReducer from './alert/alertSlice';
import apiEventSlice from './apiEvents/apiEventSlice';
import bankSlice from './bank/bankSlice';
import chatGptSlice from './chatgpt/chatGptSlice';
import dashboardReducer from './dashboard/dashboardSlice';
import dialogReducer from './dialog/dialogSlice';
import dmsSlice from './dms/dmsSlice';
import emailSlice from './email/emailSlice';
import featureSlice from './features/featureSlice';
import fitnessSlice from './fitness/fitnessSlice';
import journalSlice from './journal/journalSlice';
import deviceReducer from './kasa/deviceSlice';
import flowReducer from './kasa/flowSlice';
import presetReducer from './kasa/presetSlice';
import sceneReducer from './kasa/sceneSlice';
import kubeLogsSlice from './kubeLogs/kubeLogSlice';
import locationSlice from './locations/locationSlice';
import nestSlice from './nest/nestSlice';
import reverbReducer from './reverb/reverbSlice';
import scheduleReducer from './schedule/scheduleSlice';
import shipEngineReducer from './shipEngine/shipEngineSlice';
import taskReducer from './task/taskSlice';
import torrentSlice from './torrents/torrentSlice';
import weatherSlice from './weather/weatherSlice';
import podcastSlice from './podcasts/podcastSlice';

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
  podcast: podcastSlice,
});

export default rootReducer;
