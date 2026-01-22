import { animate, AnimationPlaybackControls } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { ambientAnimationsStore } from "@/lib/stores/ambient-animations-store";

interface AnimationConfig {
  ref: React.RefObject<SVGGElement | HTMLElement | null>;
  type: "floating" | "rotation";
  to: number;
  duration: number;
  delay?: number;
}

interface UseAmbientAnimationsConfig {
  id: string;
  animations: AnimationConfig[];
  shouldReduceMotion?: boolean | null;
}

function createFloatingKeyframes(to: number) {
  return ["translateY(0px)", `translateY(${to}px)`];
}

function createRotationKeyframes(to: number) {
  return ["rotate(0deg) translateZ(0)", `rotate(${to}deg) translateZ(0)`];
}

/**
 * Hook for managing ambient floating and rotation animations with imperative control.
 * Provides pause/resume functionality for hover interactions.
 *
 * Usage:
 * ```typescript
 * const floatingRef = useRef<SVGGElement>(null);
 * const rotationRef = useRef<SVGGElement>(null);
 *
 * useAmbientAnimations({
 *   id: "my-component",
 *   animations: [
 *     { ref: floatingRef, type: 'floating', to: 2, duration: 5 },
 *     { ref: rotationRef, type: 'rotation', to: 2, duration: 6, delay: 1 },
 *   ],
 *   shouldReduceMotion,
 * });
 * ```
 */
export function useAmbientAnimations(config: UseAmbientAnimationsConfig): {
  pause: () => void;
  resume: () => void;
} {
  const controlsRef = useRef<AnimationPlaybackControls[]>([]);

  // Start animations on mount
  useEffect(() => {
    if (config.shouldReduceMotion) return;

    const controls: AnimationPlaybackControls[] = [];

    config.animations.forEach((anim) => {
      const element = anim.ref.current;
      if (!element) return;

      const keyframes =
        anim.type === "floating"
          ? createFloatingKeyframes(anim.to)
          : createRotationKeyframes(anim.to);

      const ctrl = animate(
        element,
        { transform: keyframes },
        {
          duration: anim.duration,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          delay: anim.delay ?? 0,
        }
      );
      controls.push(ctrl);
    });

    controlsRef.current = controls;

    // Cleanup on unmount
    return () => {
      controls.forEach((ctrl) => ctrl.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.shouldReduceMotion]);

  const pause = useCallback(() => {
    controlsRef.current.forEach((ctrl) => ctrl.pause());
  }, []);

  const resume = useCallback(() => {
    controlsRef.current.forEach((ctrl) => ctrl.play());
  }, []);

  // Register with global store for coordinated pause/resume
  useEffect(() => {
    ambientAnimationsStore.register(config.id, { pause, resume });
    return () => {
      ambientAnimationsStore.unregister(config.id);
    };
  }, [config.id, pause, resume]);

  return { pause, resume };
}
