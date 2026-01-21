type AnimationControls = {
  pause: () => void;
  resume: () => void;
};

const controlsMap = new Map<string, AnimationControls>();

export const ambientAnimationsStore = {
  register(id: string, controls: AnimationControls) {
    controlsMap.set(id, controls);
  },

  unregister(id: string) {
    controlsMap.delete(id);
  },

  pauseAll() {
    controlsMap.forEach((controls) => controls.pause());
  },

  resumeAll() {
    controlsMap.forEach((controls) => controls.resume());
  },
};
