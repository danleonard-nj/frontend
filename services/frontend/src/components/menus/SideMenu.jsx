import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setSideMenu } from '../../store/dashboard/dashboardSlice';
import { pages } from '../../api/data/menus';

export default function SideMenu() {
  const dispatch = useDispatch();
  const sideMenuOpen = useSelector((x) => x.dashboard.sideMenuOpen);

  const handleClose = () => {
    dispatch(setSideMenu(false));
  };

  const handleSelect = (key) => {
    var pageKey = key.toLowerCase();
    dispatch(setPage(pageKey));
    handleClose();
  };

  return (
    <Drawer
      anchor='left'
      open={sideMenuOpen}
      onClose={handleClose}
      id='sidemenu-drawer'>
      <Box
        id='sidemenu-box'
        sx={{
          width: 250,
        }}
        role='presentation'>
        <List sx={{ bgcolor: 'paper' }} component='nav' id='sidemenu-list'>
          {pages.map((key) => (
            <ListItemButton onClick={() => handleSelect(key)} key={key}>
              <ListItemIcon>
                <SendIcon />
              </ListItemIcon>
              <ListItemText primary={key} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
