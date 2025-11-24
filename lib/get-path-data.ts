// Helper to get path data - will run on client
export function getPathData(pathString: string) {
  if (typeof document === "undefined") return { length: 0, path: null };

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathString);

  return {
    length: path.getTotalLength(),
    path: path,
  };
}
