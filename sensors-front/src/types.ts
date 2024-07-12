export type SensorData = {
    name: string;
    temperature: number;
    timeOfLife: number | null;
    thrusterSpeed: { x: number, y: number, z: number };
    waterSpeed: { x: number, y: number, z: number };
    isLost: boolean;
}