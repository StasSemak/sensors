import { SensorData } from "../entities/sensor-data.entity";
import { Sensor } from "../entities/sensor.entity";
import { getRandomNumber, getRandomVector } from "../utils";

export async function getSensors(redisClient: any) {
  const key = process.env.REDIS_SENSORS_KEY!;
  const sensorsData = await redisClient.get(key);

  if(!sensorsData) return createSensors();
  const sensorsDataParsed = JSON.parse(sensorsData);
  return sensorsDataParsed.map((data: any) => Sensor.fromJSON(data));
}

function createSensors() {
  const names = [
    "alpha",
    "beta",
    "gamma",
    "delta",
    "epsilon",
    "zeta",
    "eta",
    "theta",
    "iota",
    "kappa",
    "lambda",
    "mu",
  ];

  const sensorPosMin = parseInt(process.env.SENSOR_POSITION_MIN!);
  const sensorPosMax = parseInt(process.env.SENSOR_POSITION_MAX!);
  const waterSpeedMin = parseInt(process.env.WATER_SPEED_MIN!);
  const waterSpeedMax = parseInt(process.env.WATER_SPEED_MAX!);
  const temperatureMin = parseInt(process.env.TEMPERATURE_MIN!);
  const temperatureMax = parseInt(process.env.TEMPERATURE_MAX!);
  const connectionRadius = parseInt(process.env.CONNECTION_RADIUS!);

  const sensors: Sensor[] = [];
  for (const name of names) {
    const sensor = new Sensor(
      name,
      getRandomVector(sensorPosMin, sensorPosMax),
      getRandomVector(waterSpeedMin, waterSpeedMax),
      getRandomNumber(temperatureMin, temperatureMax),
      connectionRadius
    );
    sensors.push(sensor);
  }
  return sensors;
}

export function getSensorsData(sensors: Sensor[], tickInterval: number) {
  const sensorsData: SensorData[] = [];

  for(const sensor of sensors) {
    sensorsData.push({
      name: sensor.getName(),
      temperature: sensor.getTemperature(),
      thrusterSpeed: sensor.getThrusterSpeed(),
      waterSpeed: sensor.getWaterSpeed(),
      timeOfLife: sensor.timeOfLife(tickInterval),
      isLost: sensor.getIsLost(),
    });
  }

  return sensorsData;
}

export function updateSensors(sensors: Sensor[], redisClient: any) {
  const speedIncrementMin = parseInt(process.env.WATER_SPEED_INCREMENT_MIN!);
  const speedIncrementMax = parseInt(process.env.WATER_SPEED_INCREMENT_MAX!);
  const tempIncrementMin = parseInt(process.env.TEMPERATURE_INCREMENT_MIN!);
  const tempIncrementMax = parseInt(process.env.TEMPERATURE_INCREMENT_MAX!);
  for (const sensor of sensors) {
    if (!sensor.getIsLost()) {
      sensor.updateWaterSpeed(getRandomVector(speedIncrementMin, speedIncrementMax));
      sensor.updateTemperature(getRandomNumber(tempIncrementMin, tempIncrementMax));
      sensor.updatePosition();
    }
  }

  saveToRedis(sensors, redisClient);

  return sensors;
}

export function updateThrusterSpeed(
  sensors: Sensor[],
  name: string,
  x: number | undefined,
  y: number | undefined,
  z: number | undefined
) {
  const sensor = sensors.find((x) => x.getName() === name);
  if (!sensor) throw new Error(`No sensor found with name ${name}`);

  const incrementMin = parseInt(process.env.THRUSTER_INCREMENT_MIN!);
  const incrementMax = parseInt(process.env.THRUSTER_INCREMENT_MAX!);

  if (x && (x < incrementMin || x > incrementMax))
    throw new Error("Value of x does not fit the range!");
  if (y && (y < incrementMin || y > incrementMax))
    throw new Error("Value of y does not fit the range!");
  if (z && (z < incrementMin || z > incrementMax))
    throw new Error("Value of z does not fit the range!");

  sensor.updateThrusterSpeed({
    x: x ?? 0,
    y: y ?? 0,
    z: z ?? 0,
  });

  return sensor.getThrusterSpeed();
}

async function saveToRedis(sensors: Sensor[], redisClient: any) {
  const key = process.env.REDIS_SENSORS_KEY!;
  await redisClient.set(key, JSON.stringify(sensors));
}