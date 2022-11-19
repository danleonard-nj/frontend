import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dialogType, openDialog } from '../../../store/dialog/dialogSlice';
import { deleteLocation } from '../../../store/reminders/locationActions';
import { newLocation } from '../../../store/reminders/reminderSlice';
import { GridComponent } from '../grids/GridComponent';
import { getLocationFields } from '../grids/gridConfigs';

export const LocationGrid = () => {
  const dispatch = useDispatch();
  const locations = useSelector((x) => x.reminders.locations) ?? [];
  const [rowData, setRowData] = useState([]);

  console.log(locations);

  useEffect(() => {
    console.log('in use effect');
    setRowData(
      locations.map((location) => ({
        ...location,
        id: location.locationId,
      }))
    );
  }, [locations]);

  const handleDelete = (grid) => {
    dispatch(deleteLocation(grid.row.locationId));
  };

  const handleCreate = () => {
    dispatch(newLocation());
    dispatch(openDialog(dialogType.createReminderLocation));
  };

  const actions = {
    handleDelete: (grid) => handleDelete(grid),
    display: {
      view: false,
      edit: false,
    },
  };

  const [columnDefs] = useState(getLocationFields(actions));

  return (
    <GridComponent
      rowData={rowData}
      columns={columnDefs}
      isLoading={!rowData?.length}
      dimensions={{ height: 400, width: '100%' }}
      handleCreate={handleCreate}
    />
  );
};
