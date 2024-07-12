import { Vector3 } from "./vector3.entity";

export interface SensorData {
  name: string;
  temperature: number;
  timeOfLife: number;
  thrusterSpeed: Vector3;
  waterSpeed: Vector3;
  isLost: boolean;
}
