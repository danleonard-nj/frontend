import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { setSideMenu } from '../../store/dashboard/dashboardSlice';
import { useMsal } from '@azure/msal-react';

const capitalize = (value) => {
  return value
    .split('')
    .map((char, index) => (index == 0 ? char.toUpperCase() : char))
    .join('');
};

export default function TopMenu() {
  const { instance } = useMsal();

  const dispatch = useDispatch();
  const title = useSelector((x) => x.dashboard.page);

  function openSidebar() {
    dispatch(setSideMenu(true));
  }

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: '/',
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }} id='top-menu-flex'>
      <AppBar position='static' id='top-menu-bar'>
        <Toolbar id='top-menu-toolbar'>
          <IconButton
            id='top-menu-hamburger-button'
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            onClick={openSidebar}
            sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1 }}
            id='top-menu-page-title'>
            {capitalize(title)}
          </Typography>
          <Button
            color='inherit'
            onClick={handleLogout}
            id='top-menu-logout-button'>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
