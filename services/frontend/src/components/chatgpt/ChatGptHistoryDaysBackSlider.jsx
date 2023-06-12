import { Slider } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const ChatGptHistoryDaysBackSlider = ({ onChangeCommitted }) => {
  const { historyDaysBack = 7 } = useSelector((x) => x.chatgpt);
  const [slider, setSlider] = useState(historyDaysBack);

  // const handleSliderChangeCommitted = () => {
  //   setHistoryDaysBack(slider);
  // };

  const handleSliderChange = (event) => {
    setSlider(event.target.value);
  };

  return (
    <Slider
      value={slider ?? 0}
      onChange={handleSliderChange}
      onChangeCommitted={() => onChangeCommitted(slider)}
      valueLabelDisplay='auto'
    />
  );
};

export { ChatGptHistoryDaysBackSlider };
