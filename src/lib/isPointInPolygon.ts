import type { Point, Polygon } from "../types/editor";

// Проверка точки внутри полигона
export const isPointInPolygon = (point: Point, polygon: Polygon) => {
  const x = point.x;
  const y = point.y;
  let inside = false;

  for (
    let i = 0, j = polygon.points.length - 1;
    i < polygon.points.length;
    j = i++
  ) {
    const xi = polygon.points[i].x;
    const yi = polygon.points[i].y;
    const xj = polygon.points[j].x;
    const yj = polygon.points[j].y;

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
};
