import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dialogType, openDialog } from '../../../store/dialog/dialogSlice';
import {
  deleteNotification,
  saveNotification,
  setSelectedNotification,
} from '../../../store/reminders/notificationActions';
import { GridComponent } from '../grids/GridComponent';
import { getNotificationFields } from '../grids/gridConfigs';

export const NotificationGrid = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((x) => x.reminders.notifications) ?? [];

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    setRowData(
      notifications.map((notification) => ({
        ...notification,
        id: notification.notificationId,
      }))
    );
  }, [notifications]);

  const handleSave = (grid) => {
    dispatch(saveNotification(grid.row));
  };

  const handleDelete = (grid) => {
    dispatch(deleteNotification(grid.row.notificationId));
  };

  const handleEdit = (grid) => {
    dispatch(setSelectedNotification(grid.row.notificationId));
    dispatch(openDialog(dialogType.editReminderNotification));
  };

  const actions = {
    handleDelete: (grid) => handleDelete(grid),
    handleEdit: (grid) => handleEdit(grid),
    display: {
      view: false,
    },
  };

  const [columnDefs] = useState(getNotificationFields(actions));

  return (
    <GridComponent
      rowData={rowData}
      columns={columnDefs}
      isLoading={!notifications?.length}
      dimensions={{ height: 500, width: '100%' }}
    />
  );
};
