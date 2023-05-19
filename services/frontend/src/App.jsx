import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import React from 'react';
import './App.css';
import SnackbarAlert from './components/alerts/SnackbarAlert';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import { DialogProvider } from './components/DialogProvider';
import SideMenu from './components/menus/SideMenu';
import TopMenu from './components/menus/TopMenu';

var theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  console.log('rendered');
  return (
    <>
      <ThemeProvider theme={theme}>
        <SnackbarAlert />
        <CssBaseline enableColorScheme />
        <AuthenticatedTemplate>
          <TopMenu />
          <SideMenu />
          <Dashboard />
          <DialogProvider />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <Login />
        </UnauthenticatedTemplate>
      </ThemeProvider>
    </>
  );
}

export default App;
