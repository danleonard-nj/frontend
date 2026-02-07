import React, { useRef, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';

// ── Visualization tuning constants ──────────────────────────────────

/**
 * Visual gain applied to the raw audio samples before drawing.
 *
 * Microphone samples are floats in [-1, 1] but normal speech rarely
 * exceeds ±0.15.  This multiplier scales the waveform so it fills
 * more of the canvas height.  Increase if the waveform looks flat,
 * decrease if it clips too aggressively.
 */
const GAIN = 4.0;

/**
 * How many seconds of audio history to show in the scrolling window.
 */
const HISTORY_SECONDS = 4;

/**
 * Line width (CSS px) of the waveform stroke.
 */
const LINE_WIDTH = 1.5;

/**
 * How many raw samples to collapse into one history point.
 * Higher = less memory, smoother scroll.  At 44100 Hz and
 * a downsample of 32, each point ≈ 0.7 ms — plenty for a
 * visual waveform at canvas widths under 1000px.
 */
const DOWNSAMPLE = 32;

/**
 * Scrolling waveform visualizer — recording-strip style.
 *
 * Accumulates audio history into a rolling buffer and draws the last
 * HISTORY_SECONDS of audio scrolling from right (newest) to left
 * (oldest), similar to a DAW recording strip or the ChatGPT voice
 * mode waveform.
 *
 * Uses getFloatTimeDomainData for full 32-bit precision.
 *
 * Visual-only — does not affect the audio stream or recording data.
 *
 * @param {{ analyserNode: AnalyserNode | null, isActive: boolean }} props
 */
const WaveformVisualizer = ({ analyserNode, isActive }) => {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const dataArrayRef = useRef(null);

  // Rolling history buffer — stores downsampled peak values.
  // At 44100 Hz / DOWNSAMPLE(32) ≈ 1378 points per second.
  // For HISTORY_SECONDS(4) ≈ 5513 points — very lightweight.
  const historyRef = useRef(null);
  const historyLenRef = useRef(0);

  // Track which analyser snapshot we last consumed to avoid
  // re-pushing the same data if the animation loop runs faster
  // than the analyser refreshes.
  const lastTimeRef = useRef(0);

  // ── Logical canvas size (CSS pixels, updated by ResizeObserver) ──
  const logicalSizeRef = useRef({ w: 300, h: 48 });

  /**
   * Ensure the history buffer is allocated for the current sample rate.
   */
  const ensureHistory = useCallback((sampleRate) => {
    const pointsPerSecond = sampleRate / DOWNSAMPLE;
    const capacity = Math.ceil(pointsPerSecond * HISTORY_SECONDS);
    if (
      !historyRef.current ||
      historyRef.current.length !== capacity
    ) {
      historyRef.current = new Float32Array(capacity);
      historyLenRef.current = 0;
    }
  }, []);

  /**
   * Push new analyser samples into the rolling history buffer.
   * Downsamples by picking the peak (max absolute) value in each
   * DOWNSAMPLE-sized chunk — this preserves transients better than
   * averaging and keeps the waveform punchy.
   */
  const pushSamples = useCallback((rawData) => {
    const history = historyRef.current;
    if (!history) return;
    const capacity = history.length;

    // Downsample: for every DOWNSAMPLE raw samples, store peak
    const chunks = Math.floor(rawData.length / DOWNSAMPLE);
    if (chunks === 0) return;

    // Shift existing data left to make room for new points
    if (historyLenRef.current + chunks > capacity) {
      const overflow = historyLenRef.current + chunks - capacity;
      history.copyWithin(0, overflow);
      historyLenRef.current = Math.max(
        0,
        historyLenRef.current - overflow,
      );
    }

    for (let c = 0; c < chunks; c++) {
      let peak = 0;
      const base = c * DOWNSAMPLE;
      for (let j = 0; j < DOWNSAMPLE; j++) {
        const v = rawData[base + j];
        if (Math.abs(v) > Math.abs(peak)) peak = v;
      }
      history[historyLenRef.current++] = peak;
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserNode;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    const { w: width, h: height } = logicalSizeRef.current;
    const centerY = height / 2;

    // ── 1. Read float time-domain samples ──────────────────────────
    if (
      !dataArrayRef.current ||
      dataArrayRef.current.length !== analyser.fftSize
    ) {
      dataArrayRef.current = new Float32Array(analyser.fftSize);
    }
    analyser.getFloatTimeDomainData(dataArrayRef.current);

    // ── 2. Allocate / push into history ────────────────────────────
    // Use the AudioContext's sample rate (usually 44100 or 48000).
    const sampleRate = analyser.context?.sampleRate || 44100;
    ensureHistory(sampleRate);

    // Only push if enough time has passed (avoid duplicating the
    // same analyser snapshot when RAF runs faster than audio).
    const now = performance.now();
    const frameDurationMs = (analyser.fftSize / sampleRate) * 1000;
    if (now - lastTimeRef.current >= frameDurationMs * 0.8) {
      pushSamples(dataArrayRef.current);
      lastTimeRef.current = now;
    }

    // ── 3. Clear canvas ────────────────────────────────────────────
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ── 4. Draw a faint center line ────────────────────────────────
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // ── 5. Draw scrolling waveform ─────────────────────────────────
    const history = historyRef.current;
    const len = historyLenRef.current;
    if (!history || len === 0) {
      animFrameRef.current = requestAnimationFrame(draw);
      return;
    }

    // Map the history buffer across the canvas width.
    // The rightmost pixel = newest sample, leftmost = oldest.
    const capacity = history.length;

    // We want exactly `capacity` points to fill the canvas width.
    // If we have fewer than capacity, offset so data is right-aligned.
    const pixelsPerPoint = width / capacity;

    ctx.beginPath();
    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const startOffset = capacity - len; // empty space on the left
    let started = false;

    for (let i = 0; i < len; i++) {
      const sample = Math.max(-1, Math.min(1, history[i] * GAIN));
      const x = (startOffset + i) * pixelsPerPoint;
      const y = centerY - sample * centerY * 0.9;

      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    animFrameRef.current = requestAnimationFrame(draw);
  }, [analyserNode, ensureHistory, pushSamples]);

  useEffect(() => {
    if (isActive && analyserNode) {
      // Reset history when starting a new recording session.
      historyLenRef.current = 0;
      if (historyRef.current) historyRef.current.fill(0);
      lastTimeRef.current = 0;
      animFrameRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isActive, analyserNode, draw]);

  // Resize canvas to match container (keeps it crisp on HiDPI)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.getContext('2d').scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        logicalSizeRef.current = { w: width, h: height };
      }
    });

    observer.observe(canvas.parentElement);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </Box>
  );
};

export default WaveformVisualizer;
