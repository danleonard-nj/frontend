import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { runScene } from '../../../store/kasa/actions/sceneActions';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const KasaSceneButton = ({ scene }) => {
  const regions = useSelector((x) => x.device.regions);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef(null);

  const handleClick = () => {
    dispatch(runScene(scene.scene_id, null));
  };

  const handleMenuItemClick = (regionId) => {
    dispatch(runScene(scene.scene_id, regionId));
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target)
    ) {
      return;
    }

    setOpen(false);
  };
  return (
    <>
      <ButtonGroup
        variant='contained'
        ref={anchorRef}
        sx={{ height: '100%' }}
        fullWidth
        aria-label='split button'>
        <Button onClick={handleClick} fullWidth color='info'>
          {scene.scene_name}
        </Button>
        <IconButton
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup='menu'
          onClick={handleToggle}>
          <ArrowDropDownIcon />
        </IconButton>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom'
                  ? 'center top'
                  : 'center bottom',
            }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id='split-button-menu' autoFocusItem>
                  {regions.map((option) => (
                    <MenuItem
                      key={option.region_id}
                      onClick={() =>
                        handleMenuItemClick(option.region_id)
                      }>
                      {option.region_name}
                    </MenuItem>
                  ))}
                  <MenuItem key='remove'>Remove Category</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default KasaSceneButton;
