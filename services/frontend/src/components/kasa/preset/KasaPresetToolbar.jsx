import {
  Button,
  ButtonGroup,
  Grid,
  Stack,
  TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  dialogType,
  openDialog,
} from '../../../store/dialog/dialogSlice';
import {
  deletePreset,
  savePreset,
} from '../../../store/kasa/actions/presetActions';
import {
  setNewPreset,
  setPreset,
} from '../../../store/kasa/presetSlice';

const KasaPresetToolbar = () => {
  const dispatch = useDispatch();
  const { preset } = useSelector((x) => x.preset);

  // Save preset
  const handleSavePreset = () => {
    dispatch(savePreset());
  };

  // New preset
  const handleNewPreset = () => {
    dispatch(openDialog(dialogType.addPreset));
  };

  // Delete preset
  const handlePresetDelete = () => {
    dispatch(deletePreset());
  };

  // Clone preset
  const handlePresetClone = () => {
    const clonedPreset = {
      ...preset,
      preset_name: `${preset.preset_name} (Clone)`,
      preset_id: null,
    };
    dispatch(setNewPreset(true));
    dispatch(savePreset(clonedPreset));
  };

  // Update name
  const handleNameChange = (event) => {
    dispatch(
      setPreset({
        ...preset,
        preset_name: event.target.value,
      })
    );
  };

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
};

export { KasaPresetToolbar };
