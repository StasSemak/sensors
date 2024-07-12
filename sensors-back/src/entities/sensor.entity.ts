import { Vector3 } from "./vector3.entity";

export class Sensor {
  private name: string;
  private initialPosition: Vector3;
  private position: Vector3;
  private waterSpeed: Vector3;
  private thrusterSpeed: Vector3;
  private temperature: number;
  private connectionRadius: number;

  constructor(
    name: string,
    position: Vector3,
    waterSpeed: Vector3,
    temperature: number,
    connectionRadius: number
  ) {
    this.name = name;
    this.initialPosition = { ...position };
    this.position = position;
    this.waterSpeed = waterSpeed;
    this.temperature = temperature;
    this.thrusterSpeed = {
      x: -waterSpeed.x,
      y: -waterSpeed.y,
      z: -waterSpeed.z,
    };
    this.connectionRadius = connectionRadius;
  }

  toJSON() {
    return {
      name: this.name,
      initialPosition: this.initialPosition,
      position: this.position,
      waterSpeed: this.waterSpeed,
      thrusterSpeed: this.thrusterSpeed,
      temperature: this.temperature,
      connectionRadius: this.connectionRadius,
    }
  }
  static fromJSON(data: any) {
    const sensor = new Sensor(
      data.name,
      data.position,
      data.waterSpeed,
      data.temperature,
      data.connectionRadius
    );
    sensor.initialPosition = data.initialPosition;
    sensor.thrusterSpeed = data.thrusterSpeed;
    return sensor;
  }

  getName() {
    return this.name;
  }
  getPosition() {
    return this.position;
  }
  getWaterSpeed() {
    return this.waterSpeed;
  }
  getThrusterSpeed() {
    return this.thrusterSpeed;
  }
  getTemperature() {
    return this.temperature;
  }
  getConnectionRadius() {
    return this.connectionRadius;
  }
  getSpeed() {
    return {
      x: this.waterSpeed.x + this.thrusterSpeed.x,
      y: this.waterSpeed.y + this.thrusterSpeed.y,
      z: this.waterSpeed.z + this.thrusterSpeed.z,
    };
  }
  getIsLost() {
    if (Math.abs(this.position.x - this.initialPosition.x) > this.connectionRadius) return true;
    if (Math.abs(this.position.y - this.initialPosition.y) > this.connectionRadius) return true;
    if (Math.abs(this.position.z - this.initialPosition.z) > this.connectionRadius) return true;
    return false;
  }

  updateWaterSpeed(value: Vector3) {
    this.waterSpeed.x += value.x;
    this.waterSpeed.y += value.y;
    this.waterSpeed.z += value.z;
  }
  updateTemperature(value: number) {
    this.temperature += value;
  }
  updatePosition() {
    const speed = this.getSpeed();
    this.position.x += speed.x;
    this.position.y += speed.y;
    this.position.z += speed.z;
  }
  updateThrusterSpeed(value: Vector3) {
    this.thrusterSpeed.x += value.x;
    this.thrusterSpeed.y += value.y;
    this.thrusterSpeed.z += value.z;
  }

  timeOfLife(tickInterval: number) {
    const timeX = this.timeOfLifePerAxis("x", tickInterval);
    const timeY = this.timeOfLifePerAxis("y", tickInterval);
    const timeZ = this.timeOfLifePerAxis("z", tickInterval);
    return Math.min(timeX, timeY, timeZ);
  }
  private timeOfLifePerAxis(axis: "x" | "y" | "z", tickInterval: number) {
    const boundDistance = this.connectionRadius - Math.abs(this.position[axis] - this.initialPosition[axis]);
    const currentSpeedPerTick = Math.abs(this.getSpeed()[axis]);
    const currentSpeedPerSecond = currentSpeedPerTick * (tickInterval / 1000);
    return boundDistance / currentSpeedPerSecond;
  }
}
