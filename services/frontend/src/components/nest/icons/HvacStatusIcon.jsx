import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import React from 'react';

const iconStyle = {
  marginRight: '0.5rem',
};

const HvacStatusIcon = ({ status }) => {
  switch (status) {
    case 'HEATING': {
      return <LocalFireDepartmentIcon color='error' sx={iconStyle} />;
    }
    case 'COOLING': {
      return <AcUnitIcon color='info' sx={iconStyle} />;
    }
    default: {
      return <PowerSettingsNewIcon color='disabled' sx={iconStyle} />;
    }
  }
};

export { HvacStatusIcon };
