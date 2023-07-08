import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import React from 'react';
import { ChatGptConfigurationContent } from '../chatgpt/ChatGptConfigurationContent';

const ChatGptConfigurationAccordion = ({ isExpanded, expand }) => {
  return (
    <Accordion elevation={3} expanded={isExpanded} onChange={expand}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1a-content'
        id='panel1a-header'>
        <Typography>Configuration</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ChatGptConfigurationContent />
      </AccordionDetails>
    </Accordion>
  );
};

export { ChatGptConfigurationAccordion };
