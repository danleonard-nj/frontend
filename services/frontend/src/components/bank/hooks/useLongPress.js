import { useCallback, useRef, useEffect } from 'react';

export const useLongPress = (
  onLongPress,
  { delay = 500, shouldPreventDefault = true } = {}
) => {
  const timeout = useRef(null);
  const target = useRef(null);

  const start = useCallback(
    (event) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener('touchend', preventDefault, {
          passive: false,
        });
        target.current = event.target;
      }

      timeout.current = setTimeout(() => {
        onLongPress(event);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (event, shouldTriggerClick = true) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener(
          'touchend',
          preventDefault
        );
      }
    },
    [shouldPreventDefault]
  );

  const preventDefault = (event) => {
    if (!event.defaultPrevented) {
      event.preventDefault();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return {
    onMouseDown: (e) => start(e),
    onMouseUp: (e) => clear(e),
    onMouseLeave: (e) => clear(e, false),
    onTouchStart: (e) => start(e),
    onTouchEnd: (e) => clear(e),
    onTouchMove: (e) => clear(e, false), // Cancel on scroll/drag
    onContextMenu: (e) => {
      // Prevent context menu on long press
      if (shouldPreventDefault) {
        e.preventDefault();
      }
    },
  };
};
