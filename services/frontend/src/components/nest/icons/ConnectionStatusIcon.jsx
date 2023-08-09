import SensorsIcon from '@mui/icons-material/Sensors';
import SensorsOffIcon from '@mui/icons-material/SensorsOff';
import React from 'react';

const iconStyle = {
  marginRight: '0.5rem',
};

const ConnectionStatusIcon = ({ status }) => {
  switch (status) {
    case 'ONLINE': {
      return <SensorsIcon color='success' sx={iconStyle} />;
    }
    case 'OFFLINE': {
      return <SensorsOffIcon color='error' sx={iconStyle} />;
    }
    default: {
      return <></>;
    }
  }
};

export { ConnectionStatusIcon };
