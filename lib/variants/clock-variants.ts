const REPEAT_DELAY = 6;
const INITIAL_DELAY = 3.5;

const backgroundVariants = {
  initial: {
    transform: "rotate(0deg) scale(1)",
  },
  hover: {
    transform: [
      "rotate(0deg) scale(1)",
      "rotate(-4deg) scale(0.99)",
      "rotate(-3deg) scale(1)",
    ],
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  click: {
    transform: [
      "rotate(-3deg) scale(1)",
      "rotate(-8deg) scale(0.98)",
      "rotate(-6deg) scale(1)",
    ],
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  "scale-click": {
    transform: [
      "rotate(-6deg) scale(1)",
      "rotate(-6deg) scale(0.98)",
      "rotate(-6deg) scale(1.015)",
      "rotate(-6deg) scale(1)",
    ],
    transition: {
      duration: 0.4,
      times: [0, 0.25, 0.6, 1],
      ease: "easeOut",
    },
  },
};

const clockAndBellsVariants = {
  initial: {
    transform: "translateY(0px) rotate(0deg) scale(1)",
  },
  hover: {
    transform: [
      "translateY(0px) rotate(0deg) scale(1)",
      "translateY(-3px) rotate(0deg) scale(1)",
    ],
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  click: {
    transform: [
      "translateY(0px) rotate(0deg) scale(1)",
      "translateY(0px) rotate(-10deg) scale(0.95)",
      "translateY(0px) rotate(-8deg) scale(1.03)",
      "translateY(0px) rotate(-8deg) scale(1)",
    ],
    transition: {
      duration: 0.4,
      times: [0, 0.25, 0.6, 1],
      ease: "easeOut",
    },
  },
  "scale-click": {
    transform: [
      "translateY(0px) rotate(-8deg) scale(1)",
      "translateY(0px) rotate(-8deg) scale(0.95)",
      "translateY(0px) rotate(-8deg) scale(1.03)",
      "translateY(0px) rotate(-8deg) scale(1)",
    ],
    transition: {
      duration: 0.4,
      times: [0, 0.25, 0.6, 1],
      ease: "easeOut",
    },
  },
};

const clockVariants = {
  initial: { x: "0px" },
  hover: {
    x: ["0px", "-1.5px", "1.75px", "-1.75px", "1.75px", "-1.5px", "0px"],
    transition: {
      x: {
        duration: 0.25,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
};

const bellVariants = {
  initial: {
    x: "0px",
    rotate: "0deg",
  },
  hover: (i: number) => ({
    x:
      i === 0
        ? ["0px", "-2px", "2px", "-2px", "2px", "-2px", "0px"]
        : ["0px", "-1.5px", "1.5px", "-1.5px", "1.5px", "-1.5px", "0px"],
    rotate: i === 0 ? "0deg" : ["0deg", "-8deg"],
    transition: {
      x: {
        delay: i === 0 ? 0.015 : 0.03,
        duration: 0.25,
        repeat: Infinity,
        ease: "linear",
      },
      rotate: {
        duration: 3,
        ease: "easeOut",
      },
    },
  }),
};

const bellsVariants = {
  initial: {
    y: "0px",
    rotate: "0deg",
  },
  hover: {
    y: ["0px", "-8px"],
    rotate: "0deg",
    transition: {
      y: {
        duration: 3,
        ease: "easeOut",
      },
      rotate: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  },
  idle: (initialDelay: boolean) => ({
    y: "0px",
    rotate: ["0deg", "-8deg", "8deg", "0deg"],
    transition: {
      duration: 1,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
      delay: initialDelay ? INITIAL_DELAY : REPEAT_DELAY,
    },
  }),
};

export {
  backgroundVariants,
  bellsVariants,
  bellVariants,
  clockAndBellsVariants,
  clockVariants,
};
