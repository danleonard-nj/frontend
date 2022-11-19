import { Portal, Select, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import '../../../../styles.css';

export const MapsAutocomplete = ({ getPlace }) => {
  const [placeText, setPlaceText] = useState('');
  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {
    fields: [
      'address_components',
      'geometry',
      'icon',
      'name',
      'formatted_address',
    ],
  };
  useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autoCompleteRef.current.addListener('place_changed', async () => {
      const place = await autoCompleteRef.current.getPlace();

      inputRef.current.value = place.formatted_address;
      getPlace(place);
    });
  }, []);

  return (
    <TextField
      fullWidth
      onChange={(event) => setPlaceText(event.target.value)}
      inputRef={inputRef}
    />
  );
};
