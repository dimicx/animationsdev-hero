import { getPathData } from "./get-path-data";

// Generate spring-based easing from path that simulates gravity
export function generateBounceEasing(pathString: string, samples = 50) {
  if (typeof document === "undefined") return null;

  const { path, length } = getPathData(pathString);
  if (!path) return null;

  const points: Array<{ distance: number; y: number }> = [];

  // Sample points along the path
  for (let i = 0; i <= samples; i++) {
    const distance = (i / samples) * length;
    const point = path.getPointAtLength(distance);
    points.push({ distance, y: point.y });
  }

  // Find local minima (bounce points where ball hits bottom and velocity reverses)
  const bounceIndices: number[] = [];
  for (let i = 1; i < points.length - 1; i++) {
    if (points[i].y > points[i - 1].y && points[i].y > points[i + 1].y) {
      bounceIndices.push(i);
    }
  }

  // Create easing function that accelerates going down, decelerates going up
  return (t: number) => {
    // Map t (0-1) to actual progress along path with physics
    const targetDistance = t * length;

    // Find current segment
    let segmentStart = 0;
    let segmentEnd = points.length - 1;

    for (let i = 0; i < points.length - 1; i++) {
      const startDist = points[i].distance;
      const endDist = points[i + 1].distance;

      if (targetDistance >= startDist && targetDistance <= endDist) {
        segmentStart = i;
        segmentEnd = i + 1;
        break;
      }
    }

    const p1 = points[segmentStart];
    const p2 = points[segmentEnd];
    const segmentProgress =
      (targetDistance - p1.distance) / (p2.distance - p1.distance);

    // Check if we're going up or down (based on Y change)
    const goingDown = p2.y > p1.y;

    // Apply easing: ease-in when falling (accelerate), ease-out when rising (decelerate)
    let easedProgress;
    if (goingDown) {
      // Quadratic ease-in: accelerate as we fall
      easedProgress = segmentProgress * segmentProgress;
    } else {
      // Quadratic ease-out: decelerate as we rise
      easedProgress = 1 - Math.pow(1 - segmentProgress, 2);
    }

    // Return the eased time value
    return (segmentStart + easedProgress) / samples;
  };
}
