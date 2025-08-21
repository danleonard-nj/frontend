import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Chip,
  Menu,
  MenuItem,
  FormControlLabel,
  Switch,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Clear,
  Download,
  Search,
  Settings,
  VerticalAlignBottom,
  FilterList,
  Close,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import './LogViewer.css';

const LogContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#0d1117',
  color: '#c9d1d9',
  fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
  fontSize: '13px',
  lineHeight: '1.4',
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  height: '600px',
  overflow: 'auto',
  border: '1px solid #30363d',
  position: 'relative',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#161b22',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#484f58',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#6e7681',
  },
}));

const LogLine = styled(Box)(({ theme, level }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  padding: '2px 8px',
  borderRadius: '2px',
  margin: '1px 0',
  borderLeft: `3px solid ${getLogLevelColor(level)}`,
  backgroundColor:
    level === 'ERROR'
      ? 'rgba(248, 81, 73, 0.1)'
      : level === 'WARN'
      ? 'rgba(255, 193, 7, 0.1)'
      : level === 'INFO'
      ? 'rgba(13, 110, 253, 0.1)'
      : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(177, 186, 196, 0.12)',
  },
}));

const Timestamp = styled(Typography)({
  color: '#7d8590',
  fontSize: '11px',
  minWidth: '140px',
  marginRight: '8px',
  fontFamily: 'monospace',
});

const LogLevel = styled(Chip)(({ level }) => ({
  fontSize: '10px',
  height: '20px',
  minWidth: '50px',
  marginRight: '8px',
  backgroundColor: getLogLevelColor(level),
  color: 'white',
  fontWeight: 'bold',
}));

const LogMessage = styled(Typography)({
  flex: 1,
  fontSize: '13px',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
});

const ControlBar = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor:
    theme.palette.mode === 'dark' ? '#21262d' : '#f6f8fa',
  borderRadius: theme.spacing(1),
}));

function getLogLevelColor(level) {
  switch (level) {
    case 'ERROR':
      return '#f85149';
    case 'WARN':
      return '#ffc107';
    case 'INFO':
      return '#0d6efd';
    case 'DEBUG':
      return '#6f42c1';
    default:
      return '#6e7681';
  }
}

function parseLogLine(line, index) {
  // Skip empty lines
  if (!line || line.trim().length === 0) {
    return null;
  }

  // Simple log parsing - only extract log level, keep original line intact
  const levelRegex =
    /\b(ERROR|WARN|WARNING|INFO|DEBUG|TRACE|FATAL)\b/i;

  let level = '';

  // Extract log level
  const levelMatch = line.match(levelRegex);
  if (levelMatch) {
    level = levelMatch[1].toUpperCase();
  }

  return {
    id: index,
    level: level || 'INFO',
    message: line,
    raw: line,
  };
}

const LogViewer = ({
  logs = [],
  isStreaming = false,
  onStreamToggle,
  onClear,
  title = 'Kubernetes Logs',
  podName = '',
  namespace = '',
  loading = false,
}) => {
  const containerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevels, setSelectedLevels] = useState([
    'ERROR',
    'WARN',
    'INFO',
    'DEBUG',
  ]);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [showLevels, setShowLevels] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  // Parse logs into structured format, filtering out empty lines
  const parsedLogs = logs
    .map((log, index) => parseLogLine(log, index))
    .filter((log) => log !== null);

  // Enhanced search with highlighting
  const highlightSearchTerm = (text, term) => {
    if (!term) return text;

    const regex = new RegExp(
      `(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi'
    );
    return text.replace(
      regex,
      '<mark style="background-color: #ffd33d; color: #000;">$1</mark>'
    );
  };

  // Filter logs based on search term and selected levels
  useEffect(() => {
    let filtered = parsedLogs;

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.message
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          log.raw.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLevels.length > 0) {
      filtered = filtered.filter((log) =>
        selectedLevels.includes(log.level)
      );
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, selectedLevels]);

  // Scroll to top when new logs are loaded (not streaming)
  useEffect(() => {
    if (containerRef.current && logs.length > 0 && !loading) {
      containerRef.current.scrollTop = 0;
      setAutoScroll(false);
    }
  }, [podName, namespace, loading]);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        containerRef.current;
      const isScrolledToBottom =
        scrollHeight - scrollTop === clientHeight;

      if (!isScrolledToBottom) {
        containerRef.current.scrollTop = scrollHeight;
      }
    }
  }, [filteredLogs, autoScroll]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        containerRef.current;
      const isScrolledToBottom =
        scrollHeight - scrollTop <= clientHeight + 50;
      setAutoScroll(isScrolledToBottom);
    }
  }, []);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight;
      setAutoScroll(true);
    }
  };

  const downloadLogs = () => {
    const logContent = logs.join('\n');
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${namespace}-${podName}-logs-${
      new Date().toISOString().split('T')[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleLevel = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    );
  };

  return (
    <Box>
      <ControlBar elevation={1}>
        <Box display='flex' alignItems='center' gap={1}>
          <Typography variant='h6' sx={{ mr: 2 }}>
            {title}
          </Typography>
          {podName && (
            <Chip
              label={`${namespace}/${podName}`}
              size='small'
              variant='outlined'
              sx={{ fontFamily: 'monospace' }}
            />
          )}
          <Chip
            label={`${filteredLogs.length} lines`}
            size='small'
            color='primary'
          />
        </Box>

        <Box display='flex' alignItems='center' gap={1}>
          <Tooltip title='Search logs'>
            <IconButton onClick={() => setShowSearch(!showSearch)}>
              <Search />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={
              isStreaming ? 'Pause streaming' : 'Start streaming'
            }>
            <IconButton
              onClick={onStreamToggle}
              color={isStreaming ? 'secondary' : 'primary'}>
              {isStreaming ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Tooltip>

          <Tooltip title='Clear logs'>
            <IconButton onClick={onClear}>
              <Clear />
            </IconButton>
          </Tooltip>

          <Tooltip title='Download logs'>
            <IconButton onClick={downloadLogs}>
              <Download />
            </IconButton>
          </Tooltip>

          <Tooltip title='Scroll to bottom'>
            <IconButton
              onClick={scrollToBottom}
              color={autoScroll ? 'primary' : 'default'}>
              <VerticalAlignBottom />
            </IconButton>
          </Tooltip>

          <Tooltip title='Filter settings'>
            <IconButton
              onClick={(e) => setSettingsAnchor(e.currentTarget)}>
              <FilterList />
            </IconButton>
          </Tooltip>
        </Box>
      </ControlBar>

      {showSearch && (
        <Paper elevation={1} sx={{ p: 2, mb: 1 }}>
          <TextField
            fullWidth
            size='small'
            placeholder='Search logs...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position='end'>
                  <IconButton
                    size='small'
                    onClick={() => setSearchTerm('')}>
                    <Close />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Paper>
      )}

      <Box sx={{ position: 'relative' }}>
        <LogContainer ref={containerRef} onScroll={handleScroll}>
          {filteredLogs.length === 0 ? (
            <Box
              display='flex'
              alignItems='center'
              justifyContent='center'
              height='100%'
              color='#7d8590'>
              <Typography>
                {logs.length === 0
                  ? 'No logs available'
                  : 'No logs match the current filter'}
              </Typography>
            </Box>
          ) : (
            filteredLogs.map((log) => (
              <LogLine key={log.id} level={log.level}>
                {showLevels && (
                  <LogLevel
                    label={log.level}
                    level={log.level}
                    size='small'
                  />
                )}
                <LogMessage>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlightSearchTerm(
                        log.message,
                        searchTerm
                      ),
                    }}
                  />
                </LogMessage>
              </LogLine>
            ))
          )}
        </LogContainer>

        {loading && !isStreaming && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(13, 17, 23, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              borderRadius: 1,
            }}>
            <Box sx={{ textAlign: 'center', color: '#c9d1d9' }}>
              <div
                className='spinner'
                style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #30363d',
                  borderTop: '4px solid #58a6ff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px',
                }}
              />
              <Typography variant='body2'>Loading logs...</Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Menu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={() => setSettingsAnchor(null)}
        PaperProps={{
          sx: { minWidth: 250, p: 1 },
        }}>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={showLevels}
                onChange={(e) => setShowLevels(e.target.checked)}
              />
            }
            label='Show Log Levels'
          />
        </MenuItem>
        <MenuItem divider>
          <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
            Log Levels
          </Typography>
        </MenuItem>
        {['ERROR', 'WARN', 'INFO', 'DEBUG'].map((level) => (
          <MenuItem key={level}>
            <FormControlLabel
              control={
                <Switch
                  checked={selectedLevels.includes(level)}
                  onChange={() => toggleLevel(level)}
                />
              }
              label={level}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LogViewer;
