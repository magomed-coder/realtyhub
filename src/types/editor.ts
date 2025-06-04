export type Point = { x: number; y: number };
export type ApartmentStatus = "available" | "reserved" | "sold";
export type Polygon = {
  id: string;
  points: Point[];
  number: string;
  status: ApartmentStatus;
};
