import { createSlice } from '@reduxjs/toolkit';

export const dialogType = {
  addDevice: 'addDeviceDialog',
  addLink: 'addLinkDialog',
  deleteAction: 'deleteActionDialog',
  deleteSchedule: 'deleteSchedule',
  deleteTask: 'deleteTask',
  addPreset: 'addPreset',
  createShipment: 'createShipment',
  selectCarrier: 'selectCarrier',
  editReminder: 'editReminder',
  viewReminderDestinationDetails: 'viewReminderDestinationDetails',
  createReminderLocation: 'createReminderLocation',
  editReminderNotification: 'editReminderNotification',
  createFeatureDialog: 'createFeatureDialog',
  scheduleHistoryViewDialog: 'scheduleHistoryViewDialog',
  chatGptViewHistoryDialog: 'chatGptViewHistoryDialog',
  magnetLinkDialog: 'magnetLinkDialog',
  createEmailRuleDialog: 'createEmailRuleDialog',
  viewNestDeviceLogRecord: 'viewNestDeviceLogRecord',
};

const getInitialState = () => {
  const initialValues = {};
  const keys = Object.keys(dialogType);
  keys.forEach((key) => {
    initialValues[dialogType[key]] = false;
  });
  return initialValues;
};

const initialState = getInitialState();

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openDialog(state, { payload }) {
      state[payload] = true;
    },

    closeDialog(state, { payload }) {
      state[payload] = false;
    },
  },
});

export const { openDialog, closeDialog } = dialogSlice.actions;

export default dialogSlice.reducer;
