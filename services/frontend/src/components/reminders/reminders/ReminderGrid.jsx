import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
import { dialogType, openDialog } from '../../../store/dialog/dialogSlice';
import {
  deleteReminder,
  getReminder,
} from '../../../store/reminders/reminderActions';
import { setNewReminder } from '../../../store/reminders/reminderSlice';
import { GridComponent } from '../grids/GridComponent';
import { getReminderFields } from '../grids/gridConfigs';

export const ReminderGrid = () => {
  const dispatch = useDispatch();
  const reminders = useSelector((x) => x.reminders.reminders);
  const timezones = useSelector((x) => x.reminders.timezones);

  const [rowData, setRowData] = useState([]);
  const [timezoneData, setTimezoneData] = useState([]);

  const handleCreate = () => {
    dispatch(setNewReminder(true));
    dispatch(openDialog(dialogType.editReminder));
  };

  useEffect(() => {
    setRowData(
      reminders.map((reminder) => ({
        ...reminder,
        id: uuid(),
      }))
    );
  }, [reminders]);

  useEffect(() => {
    setTimezoneData(timezones);
  }, [timezones]);

  const handleEdit = (grid) => {
    dispatch(getReminder(grid.row.reminderId, grid.row.reminderType));
    dispatch(openDialog(dialogType.editReminder));
  };

  const handleView = (grid) => {
    dispatch(getReminder(grid.row.reminderId, grid.row.reminderType));
    dispatch(openDialog(dialogType.viewReminderDestinationDetails));
  };

  const handleDelete = (grid) => {
    dispatch(deleteReminder(grid.row.reminderId, grid.row.reminderType));
  };

  const actions = {
    handleEdit: (grid) => handleEdit(grid),
    handleView: (grid) => handleView(grid),
    handleDelete: (grid) => handleDelete(grid),
  };

  const [columnDefs] = useState(getReminderFields(timezones, actions));

  return (
    <GridComponent
      rowData={rowData}
      columns={columnDefs}
      isLoading={!timezoneData?.length || !rowData?.length}
      dimensions={{ height: 400, width: '100%' }}
      handleCreate={handleCreate}
    />
  );
};
