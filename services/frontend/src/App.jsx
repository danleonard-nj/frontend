import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { CssBaseline, createTheme } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import { ThemeProvider } from '@mui/system';
import React from 'react';
import './App.css';
import { DialogProvider } from './components/DialogProvider';
import { SnackbarAlert } from './components/alerts/SnackbarAlert';
import Login from './components/auth/Login';
import { Dashboard } from './components/dashboard/Dashboard';
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
        <StyledEngineProvider injectFirst>
          <AuthenticatedTemplate>
            <TopMenu />
            <SideMenu />
            <Dashboard />
            <DialogProvider />
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <Login />
          </UnauthenticatedTemplate>
        </StyledEngineProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
