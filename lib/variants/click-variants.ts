import { Transition } from "motion/react";

const REPEAT_DELAY = 6;
const INITIAL_DELAY = 2.5;
const DURATION = 0.55;
const IDLE_DURATION = 0.75;

const backgroundVariants = {
  initial: {
    transform: "scale(1)",
  },
  hover: {
    transform: ["scale(1)", "scale(0.97)", "scale(1.01)", "scale(1)"],
    transition: {
      duration: DURATION,
      ease: "easeOut",
      times: [0, 0.2, 0.6, 1],
      delay: 0.2,
    },
  },
  idle: (initialDelay: boolean) => ({
    transform: ["scale(1)", "scale(0.97)", "scale(1.005)", "scale(1)"],
    transition: {
      duration: IDLE_DURATION,
      times: [0.2, 0.4, 0.85, 1],
      ease: "easeOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
      delay: initialDelay ? INITIAL_DELAY : REPEAT_DELAY,
    },
  }),
  click: {
    transform: ["scale(1)", "scale(0.97)", "scale(1.01)", "scale(1)"],
    transition: {
      duration: DURATION,
      times: [0.1, 0.3, 0.65, 1],
      ease: "easeOut",
    },
  },
};

const getIdleLineTransition = (initialDelay: boolean): Transition => ({
  delay: initialDelay ? INITIAL_DELAY : REPEAT_DELAY,
  duration: IDLE_DURATION,
  repeat: Infinity,
  repeatType: "loop",
  repeatDelay: REPEAT_DELAY,
});
const idleStrokeDashoffset = [0, 0.55, 0.9];

const lineVariants = {
  initial: (i: number) => ({
    strokeDashoffset: idleStrokeDashoffset[i],
  }),
  hover: (i: number) => {
    return {
      strokeDashoffset: i === 1 ? [1, 0] : [1, 0.4],
      transition: {
        delay: i === 1 ? 0 : 0.04,
        duration: DURATION,
        times: [0.7, 0.9],
      },
    };
  },
  idle: ({ index, initialDelay }: { index: number; initialDelay: boolean }) => {
    const strokeDashoffset = idleStrokeDashoffset[index];
    const idleLineTransition = getIdleLineTransition(initialDelay);
    return {
      strokeDashoffset: [strokeDashoffset, 1, strokeDashoffset],
      transition: {
        times: [0.6, 0.6, 0.9],
        ...idleLineTransition,
      },
    };
  },
  click: (i: number) => {
    return {
      strokeDashoffset: i === 1 ? [1, 0] : [1, 0.4],
      transition: {
        delay: i === 1 ? 0 : 0.04,
        times: [0.4, 0.6],
        duration: DURATION,
      },
    };
  },
};

const handVariants = {
  initial: {
    transform: "translateX(0px) translateY(0px) rotate(0deg)",
  },
  hover: {
    transform: [
      "translateX(0px) translateY(0px) rotate(0deg)",
      "translateX(-4px) translateY(3px) rotate(25deg)",
    ],
    transition: {
      duration: DURATION,
      times: [0, 0.4],
      ease: "easeInOut",
    },
  },
  click: {
    transform: "translateX(-4px) translateY(3px) rotate(25deg)",
  },
};

export {
  backgroundVariants,
  DURATION,
  handVariants,
  IDLE_DURATION,
  INITIAL_DELAY,
  lineVariants,
  REPEAT_DELAY,
};
