import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import React from 'react';

const iconStyle = {
  marginRight: '0.5rem',
};

const ModeStatusIcon = ({ mode }) => {
  switch (mode) {
    case 'HEAT': {
      return <LocalFireDepartmentIcon color='error' sx={iconStyle} />;
    }
    case 'COOL': {
      return <AcUnitIcon color='info' sx={iconStyle} />;
    }
    default: {
      return <></>;
    }
  }
};

export { ModeStatusIcon };
