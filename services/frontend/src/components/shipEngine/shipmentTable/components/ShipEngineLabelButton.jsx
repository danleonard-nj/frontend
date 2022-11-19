import { Button, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { canCancelLabel } from '../../../../api/helpers/shipEngineHelpers';

export default LabelButton = () => {
  const label = useSelector((x) => x.shipEngine.label);

  return (
    <Tooltip
      title={
        canCancelLabel(label)
          ? tooltipText.cancelLabel
          : tooltipText.cannotCancelLabel
      }>
      <span>
        <Button
          color='error'
          variant='contained'
          size='small'
          disabled={!canCancelLabel(label)}>
          Cancel Label
        </Button>
      </span>
    </Tooltip>
  );
};
