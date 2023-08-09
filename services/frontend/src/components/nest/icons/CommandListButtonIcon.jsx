import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SettingsIcon from '@mui/icons-material/Settings';
import React from 'react';

const iconStyle = {
  marginRight: '0.5rem',
};

const CommandListButtonIcon = ({ command }) => {
  switch (command.command) {
    case 'SetHeat': {
      return <LocalFireDepartmentIcon color='error' sx={iconStyle} />;
    }
    case 'SetCool': {
      return <AcUnitIcon color='info' sx={iconStyle} />;
    }
    case 'SetPowerOff': {
      return <PowerSettingsNewIcon color='disabled' sx={iconStyle} />;
    }
    default: {
      return <SettingsIcon color='disabled' sx={iconStyle} />;
    }
  }
};

export { CommandListButtonIcon };
