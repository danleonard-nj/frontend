import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { ChatGptHistoryTable } from './tables/ChatGptHistoryTable';

const ChatGptAccordianHistoryTable = ({
  expanded,
  setExpanded,
  endpoint,
  history,
}) => {
  return (
    <Accordion
      elevation={4}
      expanded={expanded}
      onChange={setExpanded}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1a-content'
        id='panel1a-header'>
        <Typography>{endpoint}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ChatGptHistoryTable history={history} />
      </AccordionDetails>
    </Accordion>
  );
};

export { ChatGptAccordianHistoryTable };
