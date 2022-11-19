import { Button, ButtonGroup, Grid, Stack, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { dialogType, openDialog } from '../../../store/dialog/dialogSlice';
import {
  deletePreset,
  savePreset,
} from '../../../store/kasa/actions/presetActions';
import { setNewPreset, setPreset } from '../../../store/kasa/presetSlice';

export default function KasaPresetToolbar() {
  const dispatch = useDispatch();
  const preset = useSelector((x) => x.preset.preset);

  const handleSavePreset = () => {
    dispatch(savePreset());
  };
  const handleNewPreset = () => {
    dispatch(openDialog(dialogType.addPreset));
  };

  const handleNameChange = (event) => {
    dispatch(
      setPreset({
        ...preset,
        preset_name: event.target.value,
      })
    );
  };

  function handlePresetDelete() {
    dispatch(deletePreset());
  }

  function handlePresetClone() {
    const clonedPreset = {
      ...preset,
      preset_name: `${preset.preset_name} (Clone)`,
      preset_id: null,
    };
    dispatch(setNewPreset(true));
    dispatch(savePreset(clonedPreset));
  }

  return (
    <Grid container spacing={3}>
      <Grid item lg={8} xs={12}>
        <Stack direction='row' spacing={2}>
          <TextField
            fullWidth
            label='Name'
            onChange={handleNameChange}
            size='small'
            value={preset?.preset_name ?? ''}
          />
          <TextField
            fullWidth
            label='ID'
            size='small'
            value={preset?.preset_id ?? ''}
          />
        </Stack>
      </Grid>
      <Grid
        item
        lg={4}
        xs={12}
        align='right'
        display='flex'
        alignItems='stretch'>
        <ButtonGroup variant='text' fullWidth>
          <Button color='info' onClick={handleNewPreset}>
            New
          </Button>
          <Button color='secondary' onClick={handlePresetClone}>
            Clone
          </Button>
          <Button onClick={handleSavePreset}>Save</Button>
          <Button color='error' onClick={handlePresetDelete}>
            Delete
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}
