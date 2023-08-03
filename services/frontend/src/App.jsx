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
import { TopMenu } from './components/menus/TopMenu';
import {
  JsonHubProtocol,
  HubConnectionState,
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from '@microsoft/signalr';
import { useState } from 'react';
import { useEffect } from 'react';

const configureHandlers = (connection) => {
  connection.on('renderTrigger', (triggerKey) => {
    console.log('renderTrigger', triggerKey);
  });
};

const configureSignalRConnection = () =>
  new HubConnectionBuilder()
    .withUrl(
      'https://api.dan-leonard.com/api/invoker/signalr/negotiate',
      {
        logMessageContent: true,
        transport: HttpTransportType.LongPolling,
      }
    )
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build();

var theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [connection, setConnection] = useState();

  useEffect(() => {
    console.log('configuring signalr');

    const connection = configureSignalRConnection();

    configureHandlers(connection);

    connection
      .start()
      .then((res) => console.log(res))
      .catch(console.error);
  }, []);

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
