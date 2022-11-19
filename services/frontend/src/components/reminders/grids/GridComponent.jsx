import { Button } from '@mui/material';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';

export const GridComponent = ({
  rowData,
  columns,
  isLoading,
  dimensions,
  handleCreate,
}) => {
  const CustomToolbar = (handleCreate) => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <div style={{ marginLeft: 'auto', marginRight: 0 }}>
          <Button onClick={handleCreate}>New</Button>
        </div>
      </GridToolbarContainer>
    );
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={rowData}
            columns={columns}
            experimentalFeatures={{ newEditingApi: true }}
            editMode='row'
            density='compact'
            loading={isLoading}
            components={{ Toolbar: () => CustomToolbar(handleCreate) }}
            style={dimensions}
          />
        </div>
      </div>
    </div>
  );
};
