import { animate, AnimationPlaybackControls } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

interface FloatingConfig {
  to: number;
  duration: number;
  delay?: number;
}

interface RotationConfig {
  to: number;
  duration: number;
  delay?: number;
}

interface AnimationConfig {
  ref: React.RefObject<SVGGElement | HTMLElement | null>;
  type: "floating" | "rotation";
  to: number;
  duration: number;
  delay?: number;
}

interface SimpleConfig {
  floating?: FloatingConfig;
  rotation?: RotationConfig;
  shouldReduceMotion?: boolean | null;
}

interface MultiConfig {
  animations: AnimationConfig[];
  shouldReduceMotion?: boolean | null;
}

type UseAmbientAnimationsConfig = SimpleConfig | MultiConfig;

function isMultiConfig(
  config: UseAmbientAnimationsConfig
): config is MultiConfig {
  return "animations" in config;
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
 * Supports two usage patterns:
 *
 * Simple (single floating + rotation):
 * ```typescript
 * const { floatingRef, rotationRef, pause, resume } = useAmbientAnimations({
 *   floating: { to: 1, duration: 3 },
 *   rotation: { to: 5, duration: 10 },
 *   shouldReduceMotion,
 * });
 * ```
 *
 * Multi-animation (for components with multiple elements):
 * ```typescript
 * const { pause, resume } = useAmbientAnimations({
 *   animations: [
 *     { ref: mainFloatingRef, type: 'floating', to: 2, duration: 5 },
 *     { ref: mainRotationRef, type: 'rotation', to: 2, duration: 6, delay: 1 },
 *     { ref: mediumBubbleRef, type: 'floating', to: -1.5, duration: 3 },
 *   ],
 *   shouldReduceMotion,
 * });
 * ```
 */
export function useAmbientAnimations(config: SimpleConfig): {
  floatingRef: React.RefObject<SVGGElement | null>;
  rotationRef: React.RefObject<SVGGElement | null>;
  pause: () => void;
  resume: () => void;
};
export function useAmbientAnimations(config: MultiConfig): {
  pause: () => void;
  resume: () => void;
};
export function useAmbientAnimations(config: UseAmbientAnimationsConfig) {
  const floatingRef = useRef<SVGGElement | null>(null);
  const rotationRef = useRef<SVGGElement | null>(null);
  const controlsRef = useRef<AnimationPlaybackControls[]>([]);

  const shouldReduceMotion = isMultiConfig(config)
    ? config.shouldReduceMotion
    : config.shouldReduceMotion;

  // Start animations on mount
  useEffect(() => {
    if (shouldReduceMotion) return;

    const controls: AnimationPlaybackControls[] = [];

    if (isMultiConfig(config)) {
      // Multi-animation mode
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
    } else {
      // Simple mode
      if (config.floating && floatingRef.current) {
        const ctrl = animate(
          floatingRef.current,
          { transform: createFloatingKeyframes(config.floating.to) },
          {
            duration: config.floating.duration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            delay: config.floating.delay ?? 0,
          }
        );
        controls.push(ctrl);
      }

      if (config.rotation && rotationRef.current) {
        const ctrl = animate(
          rotationRef.current,
          { transform: createRotationKeyframes(config.rotation.to) },
          {
            duration: config.rotation.duration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            delay: config.rotation.delay ?? 0,
          }
        );
        controls.push(ctrl);
      }
    }

    controlsRef.current = controls;

    // Cleanup on unmount
    return () => {
      controls.forEach((ctrl) => ctrl.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReduceMotion]);

  const pause = useCallback(() => {
    controlsRef.current.forEach((ctrl) => ctrl.pause());
  }, []);

  const resume = useCallback(() => {
    controlsRef.current.forEach((ctrl) => ctrl.play());
  }, []);

  if (isMultiConfig(config)) {
    return { pause, resume };
  }

  return { floatingRef, rotationRef, pause, resume };
}
