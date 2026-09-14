import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';

export const MIN_CONFIG_WIDTH = 280;
export const MAX_CONFIG_WIDTH = 960;
export const DEFAULT_CONFIG_WIDTH = 480;
const KEYBOARD_STEP = 24;
const STORAGE_KEY = 'wb-config-width';

function clamp(width: number): number {
  return Math.min(MAX_CONFIG_WIDTH, Math.max(MIN_CONFIG_WIDTH, Math.round(width)));
}

function readStoredWidth(): number {
  if (typeof window === 'undefined') {
    return DEFAULT_CONFIG_WIDTH;
  }
  const stored = Number(window.localStorage.getItem(STORAGE_KEY));
  return Number.isFinite(stored) && stored > 0 ? clamp(stored) : DEFAULT_CONFIG_WIDTH;
}

/**
 * Manages the draggable divider between the playground's configuration and
 * preview columns: pointer dragging, keyboard resizing (arrow keys, Home/End,
 * Enter to reset), and persistence of the chosen width.
 */
export function usePanelResize() {
  const [width, setWidth] = useState<number>(readStoredWidth);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; width: number } | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(width));
  }, [width]);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      dragStart.current = { x: event.clientX, width };
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
    },
    [width],
  );

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (!dragStart.current) {
      return;
    }
    setWidth(clamp(dragStart.current.width + (event.clientX - dragStart.current.x)));
  }, []);

  const handlePointerUp = useCallback((event: PointerEvent<HTMLElement>) => {
    if (!dragStart.current) {
      return;
    }
    dragStart.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
    const adjust = (delta: number) => {
      setWidth((current) => clamp(current + delta));
      event.preventDefault();
    };
    switch (event.key) {
      case 'ArrowLeft':
        adjust(-KEYBOARD_STEP);
        break;
      case 'ArrowRight':
        adjust(KEYBOARD_STEP);
        break;
      case 'Home':
        setWidth(MIN_CONFIG_WIDTH);
        event.preventDefault();
        break;
      case 'End':
        setWidth(MAX_CONFIG_WIDTH);
        event.preventDefault();
        break;
      case 'Enter':
        setWidth(DEFAULT_CONFIG_WIDTH);
        event.preventDefault();
        break;
      default:
    }
  }, []);

  const handleDoubleClick = useCallback(() => {
    setWidth(DEFAULT_CONFIG_WIDTH);
  }, []);

  return {
    width,
    dragging,
    dividerProps: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onKeyDown: handleKeyDown,
      onDoubleClick: handleDoubleClick,
    },
  };
}
