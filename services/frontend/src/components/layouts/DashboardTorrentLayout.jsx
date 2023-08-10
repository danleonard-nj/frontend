import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import {
  setPage,
  setSearchTerm,
  setTorrentSource,
} from '../../store/torrents/torrentSlice';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  getMagnet,
  searchTorrents,
} from '../../store/torrents/torrentActions';
import Spinner from '../Spinner';
import {
  closeDialog,
  dialogType,
  openDialog,
} from '../../store/dialog/dialogSlice';
import React from 'react';
import { useState } from 'react';
import { torrentSource } from '../../api/data/torrents';

const copyToClipboard = (value) => {
  navigator.clipboard.writeText(value);
};

const TorrentTable = ({ torrents, onMagnetLinkDisplay }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Seeders</TableCell>
          <TableCell>Leechers</TableCell>
          <TableCell>Size</TableCell>
          <TableCell>Upload Date</TableCell>
          <TableCell>Uploader</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {torrents.map((torrent) => (
          <TableRow key={torrent.stub}>
            <TableCell>{torrent.name}</TableCell>
            <TableCell>{torrent.date}</TableCell>
            <TableCell>{torrent.size}</TableCell>
            <TableCell>{torrent.seeders}</TableCell>
            <TableCell>{torrent.leechers}</TableCell>
            <TableCell>{torrent.uploader}</TableCell>
            <TableCell>
              <Button
                variant='outlined'
                onClick={() => onMagnetLinkDisplay(torrent)}>
                Magnet
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const MagnetLinkDialog = () => {
  const isVisible = useSelector(
    (x) => x.dialog[dialogType.magnetLinkDialog]
  );

  const { magnet, magnetLoading } = useSelector((x) => x.torrents);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeDialog(dialogType.magnetLinkDialog));
  };

  const copyMagnetLink = () => {
    copyToClipboard(magnet?.magnet);
  };

  const onMagnetLinkClick = () => {
    copyMagnetLink();
  };

  const MagnetLinkContent = () => {
    return (
      <TextField
        value={magnet?.magnet ?? ''}
        onClick={onMagnetLinkClick}
        fullWidth
        InputProps={{ readOnly: true }}
      />
    );
  };

  return (
    <Dialog
      onClose={handleClose}
      open={isVisible}
      maxWidth='sm'
      fullWidth>
      <DialogTitle>Magnet Link</DialogTitle>
      <DialogContent>
        {magnetLoading ? <Spinner /> : <MagnetLinkContent />}
      </DialogContent>
      <DialogActions>
        <Button onClick={copyMagnetLink}>Copy</Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const DashboardTorrentLayout = () => {
  const [isInitialSearchSubmitted, setIsInitialSearchSubmitted] =
    useState(false);

  const dispatch = useDispatch();

  const {
    searchTerm,
    torrents,
    torrentsLoading,
    page,
    torrentSource,
  } = useSelector((x) => x.torrents);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleSearch = () => {
    !isInitialSearchSubmitted && setIsInitialSearchSubmitted(true);
    dispatch(searchTorrents());
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDisplayMagnetLink = (torrent) => {
    dispatch(getMagnet(torrent));
    dispatch(openDialog(dialogType.magnetLinkDialog));
  };

  const handlePaginationChangeEvent = (event, value) => {
    dispatch(setPage(value));
    dispatch(searchTorrents());
  };

  const handleTorrentSourceChange = (e) => {
    dispatch(setTorrentSource(e.target.value));
  };

  const ResultDisplay = () =>
    torrentsLoading ? (
      <Spinner />
    ) : (
      <TorrentTable
        torrents={torrents}
        onMagnetLinkDisplay={handleDisplayMagnetLink}
      />
    );

  return (
    <Paper
      elevation={2}
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={3}>
        <Grid item lg={6}>
          <Typography variant='h6'>Torrents</Typography>
          <Typography variant='body2'>
            1337x.to Search Proxy
          </Typography>
        </Grid>
        <Grid item lg={6} align='right'>
          <FormControl>
            <InputLabel id='torrent-source-select-label'>
              Torrent Source
            </InputLabel>
            <Select
              labelId='torrent-source-select-label'
              id='torrent-source-select'
              value={torrentSource ?? ''}
              label='Torrent Source'
              onChange={handleTorrentSourceChange}>
              <MenuItem value='1337x'>1337x</MenuItem>
              <MenuItem value='piratebay'>TPB</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={12}>
          <TextField
            fullWidth
            size='small'
            defaultValue='Search...'
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>
              Torrent Source
            </InputLabel> */}

          {/* </FormControl> */}
        </Grid>
        <Grid item lg={12}>
          {isInitialSearchSubmitted && <ResultDisplay />}
        </Grid>
        <Grid item lg={12} align='right'>
          {torrentSource === '1337x' && (
            <Pagination
              defaultPage={1}
              count={999}
              onChange={handlePaginationChangeEvent}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export { DashboardTorrentLayout, MagnetLinkDialog };
