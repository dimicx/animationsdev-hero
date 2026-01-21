"use client";

import { Bounce } from "@/components/bounce";
import { Click } from "@/components/click";
import { Clock } from "@/components/clock";
import { Code } from "@/components/code";
import { Defs } from "@/components/defs";
import { Lightbulb } from "@/components/lightbulb";
import { Timeline } from "@/components/timeline";
import { SPRING_CONFIGS } from "@/lib/animation-configs";
import { motion, MotionConfig } from "motion/react";
import { useRef } from "react";

export function Scene() {
  const isDraggingRef = useRef(false);

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <MotionConfig reducedMotion="user" transition={SPRING_CONFIGS.default}>
      <div className="-mb-4 mt-12 flex justify-center md:-mb-2 md:mt-8 select-none">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="622"
          height="319"
          fill="none"
          viewBox="0 0 622 319"
          className="h-auto max-w-full overflow-visible!"
          role="img"
          aria-label="Interactive animation showcasing various microinteractions"
          variants={{
            animate: {
              transition: { staggerChildren: 0.05 },
            },
          }}
          initial="initial"
          animate="animate"
        >
          <Code isDraggingRef={isDraggingRef} />
          <Bounce
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            isDraggingRef={isDraggingRef}
          />
          <Click isDraggingRef={isDraggingRef} />
          <Clock isDraggingRef={isDraggingRef} />
          <Timeline isDraggingRef={isDraggingRef} />
          <Lightbulb isDraggingRef={isDraggingRef} />
          <Defs />
        </motion.svg>
      </div>
    </MotionConfig>
  );
}
