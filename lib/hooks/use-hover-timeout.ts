import { useReducedMotion } from "motion/react";
import { useCallback, useRef } from "react";
import { useMediaQuery } from "usehooks-ts";
import { ambientAnimationsStore } from "@/lib/stores/ambient-animations-store";

// Safari detection - check once at module load
const isSafari =
  typeof window !== "undefined" &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

interface UseHoverTimeoutProps {
  /** Delay in milliseconds before hover animation starts */
  delay: number;
  /** Callback fired when hover state starts (after delay) */
  onHoverStart: () => void;
  /** Callback fired when hover state ends */
  onHoverEnd: () => void;
  /** Optional ref to check if hover is disabled */
  disabledRef?: React.RefObject<boolean>;
}

/**
 * Hook for handling hover interactions with a delay threshold.
 * Prevents quick mouse pass-throughs from triggering hover animations by requiring
 * the mouse to stay hovered for a minimum duration before starting the animation.
 *
 * @param delay - Delay in milliseconds before hover animation starts
 * @param onHoverStart - Callback fired when hover state starts (after delay)
 * @param onHoverEnd - Callback fired when hover state ends
 * @param disabledRef - Optional ref to check if hover is disabled
 * @returns Object with handleMouseEnter and handleMouseLeave event handlers
 */
export function useHoverTimeout({
  delay,
  onHoverStart,
  onHoverEnd,
  disabledRef,
}: UseHoverTimeoutProps) {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useMediaQuery("(pointer: coarse)");
  const mouseEnterTimeRef = useRef<number>(0);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const _delay = isMobile ? 0 : delay;

  const handleMouseEnter = useCallback(() => {
    if (disabledRef?.current || shouldReduceMotion) return;

    // Pause all ambient animations immediately (Safari only - to prevent frame drops)
    // This also cancels any pending resume timer in the store
    if (isSafari) {
      ambientAnimationsStore.pauseAll();
    }

    mouseEnterTimeRef.current = Date.now();

    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Delay starting hover animation until we're sure it's not a quick pass-through
    hoverTimeoutRef.current = setTimeout(() => {
      if (disabledRef?.current || shouldReduceMotion) return;
      onHoverStart();
    }, _delay);
  }, [_delay, onHoverStart, disabledRef, shouldReduceMotion]);

  const handleMouseLeave = useCallback(() => {
    if (disabledRef?.current || shouldReduceMotion) return;

    // Resume all ambient animations after a short delay (Safari only)
    // Timer is managed by the store to handle cross-component hover transitions
    if (isSafari) {
      ambientAnimationsStore.resumeAllWithDelay(200);
    }

    const hoverDuration = Date.now() - mouseEnterTimeRef.current;

    // Clear the pending hover animation if mouse left before timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Only process if hover was long enough (animation actually started)
    if (hoverDuration >= _delay) {
      onHoverEnd();
    }
  }, [_delay, onHoverEnd, disabledRef, shouldReduceMotion]);

  return { handleMouseEnter, handleMouseLeave };
}
