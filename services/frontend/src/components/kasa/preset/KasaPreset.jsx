import { Grid, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { deviceTypes } from '../../../api/data/kasa/device';
import KasaSelectDeviceTypeDialog from '../KasaSelectDeviceTypeDialog';
import KasaPresetLight from './KasaPresetLight';
import KasaPresetPlug from './KasaPresetPlug';
import KasaPresetToolbar from './KasaPresetToolbar';

export default function KasaPreset() {
  const deviceType = useSelector((x) => x.preset.preset.device_type);
  const presetLoading = useSelector((x) => x.preset.presetLoading);
  return (
    <>
      <KasaSelectDeviceTypeDialog />
      <Grid container spacing={3}>
        <Grid item lg={12} xs={12}>
          <Paper elevation={2} sx={{ padding: 1 }}>
            <KasaPresetToolbar />
          </Paper>
        </Grid>
        <Grid item lg={6} xs={12}>
          {!presetLoading && (
            <Paper sx={{ padding: 3 }} elevation={4}>
              {deviceType === deviceTypes.SmartLight && <KasaPresetLight />}
              {deviceType === deviceTypes.SmartPlug && <KasaPresetPlug />}
            </Paper>
          )}
        </Grid>
      </Grid>
    </>
  );
}
