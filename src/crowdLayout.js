export function pointOnPath(points, progress) {
  const scaled = progress * (points.length - 1);
  const segment = Math.min(points.length - 2, Math.floor(scaled));
  const local = scaled - segment;
  return {
    x: points[segment][0] + (points[segment + 1][0] - points[segment][0]) * local,
    y: points[segment][1] + (points[segment + 1][1] - points[segment][1]) * local,
  };
}
