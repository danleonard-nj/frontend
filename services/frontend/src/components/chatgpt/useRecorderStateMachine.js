import { useReducer, useRef, useCallback, useEffect } from 'react';

/**
 * Recording states enum
 */
export const RecState = Object.freeze({
  IDLE: 'idle',
  ARMING: 'arming',
  RECORDING: 'recording',
  STOPPING: 'stopping',
  PROCESSING: 'processing',
});

/**
 * Valid state transitions for the recording state machine
 */
const VALID_TRANSITIONS = {
  [RecState.IDLE]: [RecState.ARMING],
  [RecState.ARMING]: [RecState.RECORDING, RecState.IDLE], // IDLE for error recovery
  [RecState.RECORDING]: [RecState.STOPPING],
  [RecState.STOPPING]: [RecState.PROCESSING, RecState.IDLE], // IDLE for cancel
  [RecState.PROCESSING]: [RecState.IDLE],
};

const WARMUP_DELAY_MS = 300;
const STOP_DRAIN_DELAY_MS = 200;

function recorderReducer(state, action) {
  switch (action.type) {
    case 'TRANSITION': {
      const { to } = action;
      const valid = VALID_TRANSITIONS[state.phase];
      if (!valid || !valid.includes(to)) {
        console.warn(
          `[Recorder] Invalid transition: ${state.phase} → ${to}`,
        );
        return state;
      }
      return { ...state, phase: to };
    }
    // Force-reset used only by cancel (escape hatch from any state)
    case 'FORCE_IDLE':
      return { ...state, phase: RecState.IDLE };
    default:
      return state;
  }
}

/**
 * Custom hook implementing a deterministic recording state machine.
 *
 * States: idle → arming → recording → stopping → processing → idle
 *
 * Fixes mobile reliability issues:
 * - Disables browser audio processing (echo cancellation, noise suppression, AGC)
 * - Adds warm-up delay after MediaRecorder.start()
 * - Adds drain delay after MediaRecorder.stop()
 * - Ensures the final dataavailable buffer is captured
 *
 * @param {Object} options
 * @param {function} options.onAudioReady - Callback receiving the audio Blob for transcription
 * @returns {{ phase, analyserNode, arm, confirm, cancel }}
 */
export default function useRecorderStateMachine({ onAudioReady }) {
  const [state, dispatch] = useReducer(recorderReducer, {
    phase: RecState.IDLE,
  });

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const cancelledRef = useRef(false);

  const transition = useCallback((to) => {
    dispatch({ type: 'TRANSITION', to });
  }, []);

  /**
   * Clean up all media resources
   */
  const cleanupMedia = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  /**
   * ARM: Request mic access, set up MediaRecorder, warm up, then enter RECORDING
   */
  const arm = useCallback(async () => {
    if (state.phase !== RecState.IDLE) return;
    transition(RecState.ARMING);
    cancelledRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;
      chunksRef.current = [];

      // Set up AnalyserNode for visualization (visual-only, does not touch recording data).
      // fftSize = 2048 gives us 2048 time-domain samples for accurate RMS calculation.
      // smoothingTimeConstant is set low — we apply our own exponential smoothing in the visualizer.
      const audioCtx = new (
        window.AudioContext || window.webkitAudioContext
      )();

      // iOS Safari suspends AudioContext until resumed from a user gesture.
      // The arm() call originates from a click handler, so this satisfies the requirement.
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.3;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      // Do NOT connect analyser to destination — visual only

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      // Determine best supported MIME type
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = '';
        }
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined,
        audioBitsPerSecond: 128000,
      });

      mediaRecorderRef.current = recorder;

      // Collect every chunk (including the final one)
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      // Start the recorder
      recorder.start();

      // Warm-up delay to let the mic settle on mobile
      await new Promise((r) => setTimeout(r, WARMUP_DELAY_MS));

      // Check if cancelled during warm-up
      if (cancelledRef.current) {
        recorder.stop();
        cleanupMedia();
        return;
      }

      transition(RecState.RECORDING);
    } catch (err) {
      console.error('[Recorder] Failed to arm:', err);
      cleanupMedia();
      transition(RecState.IDLE);
      throw err;
    }
  }, [state.phase, transition, cleanupMedia]);

  /**
   * CONFIRM: Stop the recorder, wait for buffers to drain, then process
   */
  const confirm = useCallback(async () => {
    if (state.phase !== RecState.RECORDING) return;
    transition(RecState.STOPPING);

    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      transition(RecState.IDLE);
      cleanupMedia();
      return;
    }

    try {
      // Wait for the recorder to finish flushing its final buffer
      await new Promise((resolve) => {
        recorder.onstop = resolve;
        recorder.stop();
      });

      // Short drain delay to ensure the last dataavailable event has fired
      await new Promise((r) => setTimeout(r, STOP_DRAIN_DELAY_MS));

      transition(RecState.PROCESSING);

      // Build the blob from all collected chunks
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || 'audio/webm;codecs=opus',
      });

      // Clean up media resources before processing
      cleanupMedia();

      if (blob.size > 0 && onAudioReady) {
        await onAudioReady(blob);
      }
    } catch (err) {
      console.error('[Recorder] Error during confirm:', err);
    } finally {
      transition(RecState.IDLE);
    }
  }, [state.phase, transition, cleanupMedia, onAudioReady]);

  /**
   * CANCEL: Discard the recording and return to idle
   */
  const cancel = useCallback(() => {
    cancelledRef.current = true;

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = null;
      recorder.ondataavailable = null;
      recorder.stop();
    }

    cleanupMedia();

    // Force back to idle regardless of current phase
    dispatch({ type: 'FORCE_IDLE' });
  }, [cleanupMedia]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        recorder.onstop = null;
        recorder.ondataavailable = null;
        try {
          recorder.stop();
        } catch {
          // ignore
        }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return {
    phase: state.phase,
    analyserNode: analyserRef.current,
    arm,
    confirm,
    cancel,
  };
}
