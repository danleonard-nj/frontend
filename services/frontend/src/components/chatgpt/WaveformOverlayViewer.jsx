import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Modal,
  Backdrop,
  Fade,
  Slider,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

/**
 * Renders a base64 PNG waveform overlay image with interactive
 * zoom / pan / pinch-zoom, optimised for mobile and desktop.
 *
 * Props:
 *  - base64Png: string  (raw base64 PNG, no data-URI prefix)
 */
const WaveformOverlayViewer = ({ base64Png }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef(null);
  const containerRef = useRef(null);

  const src = `data:image/png;base64,${base64Png}`;

  // ── helpers ──────────────────────────────────────────────────────
  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const clampZoom = (z) => Math.min(Math.max(z, 1), 10);

  const handleZoomIn = () => setZoom((z) => clampZoom(z + 0.5));
  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = clampZoom(prev - 0.5);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  // ── mouse / touch drag ──────────────────────────────────────────
  const handlePointerDown = useCallback(
    (e) => {
      if (zoom <= 1) return;
      setDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      panStart.current = { ...pan };
    },
    [zoom, pan],
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragging) return;
      setPan({
        x: panStart.current.x + (e.clientX - dragStart.current.x),
        y: panStart.current.y + (e.clientY - dragStart.current.y),
      });
    },
    [dragging],
  );

  const handlePointerUp = useCallback(() => setDragging(false), []);

  // ── mouse wheel zoom ───────────────────────────────────────────
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom((z) => clampZoom(z - e.deltaY * 0.002));
  }, []);

  // Attach non-passive wheel handler so we can preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !modalOpen) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [modalOpen, handleWheel]);

  // ── pinch zoom (touch) ─────────────────────────────────────────
  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);

      if (lastPinchDist.current !== null) {
        const delta = dist - lastPinchDist.current;
        setZoom((z) => clampZoom(z + delta * 0.01));
      }
      lastPinchDist.current = dist;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    lastPinchDist.current = null;
  }, []);

  // ── shared image styles ─────────────────────────────────────────
  const imageStyle = (interactive) => ({
    display: 'block',
    width: '100%',
    height: 'auto',
    borderRadius: interactive ? 0 : 8,
    ...(interactive && {
      transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
      transformOrigin: 'center center',
      cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in',
      userSelect: 'none',
      touchAction: 'none',
    }),
  });

  // ── Toolbar used inside modal ───────────────────────────────────
  const Toolbar = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        bgcolor: 'rgba(0,0,0,0.7)',
        borderRadius: 2,
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
      }}>
      <IconButton
        onClick={handleZoomOut}
        size='small'
        sx={{ color: 'white' }}>
        <ZoomOutIcon />
      </IconButton>
      <Slider
        value={zoom}
        min={1}
        max={10}
        step={0.25}
        onChange={(_, v) => setZoom(v)}
        sx={{ width: 120, color: 'white', mx: 1 }}
        size='small'
      />
      <IconButton
        onClick={handleZoomIn}
        size='small'
        sx={{ color: 'white' }}>
        <ZoomInIcon />
      </IconButton>
      <IconButton
        onClick={resetView}
        size='small'
        sx={{ color: 'white' }}
        title='Reset view'>
        <RestartAltIcon />
      </IconButton>
      <Typography
        variant='caption'
        sx={{ color: 'grey.400', minWidth: 40, textAlign: 'center' }}>
        {Math.round(zoom * 100)}%
      </Typography>
    </Box>
  );

  return (
    <>
      {/* ── Inline preview ──────────────────────────────────────── */}
      <Paper
        elevation={2}
        sx={{
          mb: 3,
          overflow: 'hidden',
          position: 'relative',
          '&:hover .waveform-expand': { opacity: 1 },
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
            pt: 1.5,
            pb: 0.5,
          }}>
          <Typography variant='subtitle2' color='text.secondary'>
            Processed Waveform
          </Typography>
          <IconButton
            className='waveform-expand'
            size='small'
            onClick={() => {
              resetView();
              setModalOpen(true);
            }}
            sx={{
              opacity: { xs: 1, md: 0 },
              transition: 'opacity 0.2s',
            }}
            title='Expand waveform'>
            <FullscreenIcon fontSize='small' />
          </IconButton>
        </Box>

        <Box
          sx={{
            px: 2,
            pb: 2,
            cursor: 'pointer',
          }}
          onClick={() => {
            resetView();
            setModalOpen(true);
          }}>
          <img
            src={src}
            alt='Processed audio waveform'
            style={imageStyle(false)}
            draggable={false}
          />
        </Box>
      </Paper>

      {/* ── Fullscreen modal with zoom / pan ────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 300,
            sx: { bgcolor: 'rgba(0,0,0,0.85)' },
          },
        }}>
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
            }}>
            {/* Close button */}
            <IconButton
              onClick={() => setModalOpen(false)}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                zIndex: 2,
              }}>
              <CloseIcon />
            </IconButton>

            {/* Zoomable / pannable image area */}
            <Box
              ref={containerRef}
              sx={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 1, sm: 3 },
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}>
              <img
                src={src}
                alt='Processed audio waveform (expanded)'
                style={{
                  ...imageStyle(true),
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  width: 'auto',
                }}
                draggable={false}
              />
            </Box>

            <Toolbar />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default WaveformOverlayViewer;
