type AnimationControls = {
  pause: () => void;
  resume: () => void;
};

const controlsMap = new Map<string, AnimationControls>();
let resumeTimeoutId: ReturnType<typeof setTimeout> | null = null;

export const ambientAnimationsStore = {
  register(id: string, controls: AnimationControls) {
    controlsMap.set(id, controls);
  },

  unregister(id: string) {
    controlsMap.delete(id);
  },

  pauseAll() {
    // Cancel any pending resume
    if (resumeTimeoutId) {
      clearTimeout(resumeTimeoutId);
      resumeTimeoutId = null;
    }
    controlsMap.forEach((controls) => controls.pause());
  },

  resumeAllWithDelay(delayMs: number = 200) {
    // Cancel any existing pending resume
    if (resumeTimeoutId) {
      clearTimeout(resumeTimeoutId);
    }
    resumeTimeoutId = setTimeout(() => {
      controlsMap.forEach((controls) => controls.resume());
      resumeTimeoutId = null;
    }, delayMs);
  },
};
