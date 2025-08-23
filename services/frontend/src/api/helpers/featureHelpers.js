import { blue, green, red } from '@mui/material/colors';

const featureType = {
  boolean: 'boolean',
  text: 'text',
  json: 'json',
  number: 'number',
};

const getAvatarLetter = (typeName) => {
  return typeName[0].toUpperCase();
};

const getAvatarColor = (type) => {
  switch (type) {
    case featureType.text:
      return green[500];
    case featureType.boolean:
      return blue[500];
    case featureType.boolean:
      return red[500];
  }
};

export { featureType, getAvatarColor, getAvatarLetter };
