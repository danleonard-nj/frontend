import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  Collapse,
  TableHead,
  TableRow,
  List,
  Paper,
  Typography,
  TextField,
} from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { getLocalDateTimeFromTimestamp } from '../../../api/helpers/dateTimeUtils';
import { chatGptEndpoints } from '../../../api/data/chatGpt';

const ImageContent = ({ images }) => {
  return (
    <List>
      {images.map((image, index) => (
        <h1>{image}</h1>
      ))}
    </List>
  );
};

const ExpandedImageContent = ({ row }) => {
  <Table>
    <TableHead>
      <TableCell>Endpoint</TableCell>
      <TableCell>Count</TableCell>
      <TableCell>Size</TableCell>
    </TableHead>
    <TableBody>
      <TableRow hover key={row.history_id}>
        <TableCell>{row.endpoint}</TableCell>
        <TableCell>{row.response.request.body.n}</TableCell>
        <TableCell>{row.response.request.body.n}</TableCell>
      </TableRow>
    </TableBody>
  </Table>;
};

const ExpandedCompletionContent = ({ row }) => {
  return (
    <Table>
      <TableHead>
        <TableCell>Endpoint</TableCell>
        <TableCell>Bk</TableCell>
        <TableCell>Created</TableCell>
        <TableCell>Model</TableCell>
        <TableCell>Prompt Tokens</TableCell>
        <TableCell>Completion Tokens</TableCell>
        <TableCell>Total Tokens</TableCell>
        <TableCell>Duration</TableCell>
      </TableHead>
      <TableBody>
        <TableRow hover key={row.history_id}>
          <TableCell>{row.endpoint}</TableCell>
          <TableCell>{row.response.response.body.id}</TableCell>
          <TableCell>{row.response.response.body.created}</TableCell>
          <TableCell>{row.response.response.body.model}</TableCell>
          <TableCell>
            {row.response.response.body.usage.prompt_tokens}
          </TableCell>
          <TableCell>
            {row.response.response.body.usage.completion_tokens}
          </TableCell>
          <TableCell>
            {row.response.response.body.usage.total_tokens}
          </TableCell>
          <TableCell>{row.response.stats.duration}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const ChatGptHistoryTable = ({ history }) => {
  console.log('history', history);
  const [expanded, setExpanded] = useState('');

  const ExpandButton = ({ isExpanded, row }) => {
    return (
      <IconButton
        aria-label='expand row'
        sx={{ margin: 'auto' }}
        onClick={() => handleExpandRow(row)}>
        {isExpanded ? (
          <KeyboardArrowUpIcon />
        ) : (
          <KeyboardArrowDownIcon />
        )}
      </IconButton>
    );
  };

  const handleExpandRow = (row) => {
    row.history_id === expanded
      ? setExpanded('')
      : setExpanded(row.history_id);
    console.log('row', row);
  };

  return (
    <Table size='small'>
      <TableHead>
        <TableCell />
        <TableCell>ID</TableCell>
        <TableCell>Date</TableCell>
        <TableCell>Endpoint</TableCell>
        <TableCell>Method</TableCell>
        <TableCell>Duration</TableCell>
      </TableHead>
      <TableBody>
        {history?.map((row, index) => (
          <>
            <TableRow hover key={index}>
              <TableCell>
                <ExpandButton
                  isExpanded={row.history_id === expanded}
                  row={row}
                />
              </TableCell>
              <TableCell>{row.history_id}</TableCell>
              <TableCell>
                {getLocalDateTimeFromTimestamp(row.created_date)}
              </TableCell>
              <TableCell>{row.endpoint}</TableCell>
              <TableCell>{row.method}</TableCell>
              <TableCell>
                {row.response?.stats?.duration ?? 0}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{ border: 0, paddingTop: 0, paddingBottom: 0 }}
                colSpan={12}>
                <Collapse
                  in={row.history_id === expanded}
                  timeout='auto'
                  unmountOnExit>
                  {row.endpoint === '/v1/images/generations' && (
                    <Paper
                      elevation={3}
                      sx={{ margin: '1rem', padding: 2 }}>
                      <ExpandedImageContent row={row} />
                      <TextField
                        label='Prompt'
                        fullWidth
                        value={row?.response?.request?.body?.prompt}
                        inputProps={{ readOnly: false }}
                        sx={{ marginTop: '2rem' }}
                      />
                      <TextField
                        label='Response'
                        fullWidth
                        multiline
                        value={
                          row?.response?.response?.body?.choices[0]
                            ?.text
                        }
                        inputProps={{ readOnly: false }}
                        sx={{ marginTop: '1rem' }}
                      />
                    </Paper>
                  )}
                  {row.endpoint === chatGptEndpoints.completions && (
                    <Paper
                      elevation={3}
                      sx={{ margin: '1rem', padding: 2 }}>
                      <ExpandedCompletionContent row={row} />
                      <TextField
                        label='Prompt'
                        fullWidth
                        value={row?.response?.request?.body?.prompt}
                        inputProps={{ readOnly: false }}
                        sx={{ marginTop: '2rem' }}
                      />
                      <TextField
                        label='Response'
                        fullWidth
                        multiline
                        value={
                          row?.response?.response?.body?.choices[0]
                            ?.text
                        }
                        inputProps={{ readOnly: false }}
                        sx={{ marginTop: '1rem' }}
                      />
                    </Paper>
                  )}
                </Collapse>
              </TableCell>
            </TableRow>
          </>
        ))}
      </TableBody>
    </Table>
  );
};

export { ChatGptHistoryTable };
