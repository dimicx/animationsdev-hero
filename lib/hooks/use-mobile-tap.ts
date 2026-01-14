import { useCallback, useEffect, useRef } from "react";
import { useMediaQuery } from "usehooks-ts";

interface UseMobileTapReturn {
  /** Whether ready for click action (always true on desktop) */
  isReadyForClickRef: React.RefObject<boolean>;
  /** Mark first tap complete, enabling click action */
  markTapped: () => void;
  /** Reset ready state */
  resetTap: () => void;
}

/**
 * Hook for handling mobile double-tap pattern.
 * On mobile: first tap triggers hover, second tap triggers click action.
 * On desktop: isReadyForClickRef is always true, allowing immediate clicks.
 *
 * @returns Object with markTapped, resetTap functions, and isReadyForClickRef
 *
 * @example
 * ```tsx
 * const { isReadyForClickRef, markTapped, resetTap } = useMobileTap();
 *
 * const handleClick = () => {
 *   if (!isReadyForClickRef.current) {
 *     markTapped(); // First tap on mobile
 *     return;
 *   }
 *   // Proceed with action
 * };
 * ```
 */
export function useMobileTap(): UseMobileTapReturn {
  const isMobile = useMediaQuery("(pointer: coarse)");
  // Start as true (desktop default), will be corrected by effect on mobile
  const isReadyForClickRef = useRef(true);

  // Sync ref when isMobile changes (handles SSR hydration where isMobile starts false)
  useEffect(() => {
    if (isMobile) {
      isReadyForClickRef.current = false;
    }
  }, [isMobile]);

  const markTapped = useCallback(() => {
    if (isMobile) {
      isReadyForClickRef.current = true;
    }
  }, [isMobile]);

  const resetTap = useCallback(() => {
    if (isMobile) {
      isReadyForClickRef.current = false;
    }
  }, [isMobile]);

  return {
    isReadyForClickRef,
    markTapped,
    resetTap,
  };
}
