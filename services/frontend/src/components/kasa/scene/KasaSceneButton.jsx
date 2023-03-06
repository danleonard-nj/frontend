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

const KasaSceneButton = ({ scene }) => {
  const regions = useSelector((x) => x.device.regions);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef(null);

  // Handle clicking the main button (fire a run scene call)
  const handleMainButtonClick = () => {
    dispatch(runScene(scene.scene_id, null));
  };

  // Handle clicking an item in dropdown icon button (fire a
  // run scene call w/ selected category)
  const handleMenuItemClick = (regionId) => {
    dispatch(runScene(scene.scene_id, regionId));
    setOpen(false);
  };

  // Toggle for dropdown icon button
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // Handle closing the icon button menu
  const handleClose = (event) => {
    !(
      anchorRef.current && anchorRef.current.contains(event.target)
    ) && setOpen(false);
  };
  return (
    <>
      <ButtonGroup
        variant='contained'
        ref={anchorRef}
        sx={{ height: '100%' }}
        fullWidth
        aria-label='split button'>
        <Button
          onClick={handleMainButtonClick}
          fullWidth
          color='info'>
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
