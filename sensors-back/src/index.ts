import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import bodyParser from "body-parser";
import {
  getSensors,
  getSensorsData,
  updateSensors,
  updateThrusterSpeed,
} from "./services/sensor.service";
import cors from "cors";
import { createClient } from "redis";
import { Sensor } from "./entities/sensor.entity";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const redisClient = createClient();
redisClient.on("error", (err) => console.log("Redis client error: ", err));
redisClient.connect().then(() => console.log("Connected to Redis client!"));

const server = createServer(app);
const wss = new WebSocketServer({ server });

let sensors: Sensor[] = []; 
getSensors(redisClient).then((data) => {
  sensors = data;
});

wss.on("connection", (ws) => {
  console.log("Client connected!");
  const interval = Number(process.env.TICK_INTERVAL || 1000);

  ws.send(JSON.stringify(getSensorsData(sensors, interval)));

  const ticker = setInterval(() => {
    sensors = updateSensors(sensors, redisClient);
    ws.send(JSON.stringify(getSensorsData(sensors, interval)));
  }, interval);

  ws.on("close", () => {
    clearInterval(ticker);
    console.log("Client disconnected!");
  });
});

app.post("/sensor/:name/thruster", (req: Request, res: Response) => {
  const name = req.params.name;
  const { x, y, z } = req.body;
  try {
    const speed = updateThrusterSpeed(sensors, name, x, y, z);
    res.status(200).json({ ...speed });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

server.listen(port, () => {
  console.log(`---- Server started on port ${port} ----`);
});
