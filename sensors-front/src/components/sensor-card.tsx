import { ThermometerIcon, TimerIcon } from "lucide-react";
import { SensorData } from "../types";
import { colorFromTime, normalizeHeight } from "../utils";
import { useState } from "react";
import { createPortal } from "react-dom";
import { SensorPopup } from "./popup";

export function SensorCard({ sensor }: { sensor: SensorData }) {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  return (
    <>
      <div
        className="w-full bg-sky-900 h-[140px] flex justify-between rounded-xl text-sky-50 p-4 border-2 cursor-pointer transition-all"
        style={{ borderColor: colorFromTime(sensor.timeOfLife ?? Infinity) }}
        onClick={() => setIsPopupOpen(true)}
      >
        <CardContent sensor={sensor}/>
      </div>
      {isPopupOpen && createPortal(
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            minWidth: "100%",
            zIndex: 999,
          }}
        >
          <SensorPopup sensor={sensor} closeFunc={() => setIsPopupOpen(false)}/>
        </div>,
        document.body
      )}
    </>
  );
}

function CardContent({ sensor }: { sensor: SensorData }) {
  return(
    <>
      <div className="flex flex-col gap-3">
        <p className="text-2xl font-semibold">{sensor.name}</p>
        {sensor.isLost ? (
          <p className="text-lg font-semibold text-red-500">Connection lost!</p>
        ) : (
          <>
            <div className="flex gap-1 items-center">
              <ThermometerIcon className="size-5 stroke-sky-50" />
              <p className="font-semibold">
                {sensor.temperature.toFixed(4) + "°C"}
              </p>
            </div>
            <div className="flex gap-1 items-center">
              <TimerIcon className="size-5 stroke-sky-50" />
              <p
                className="font-semibold transition-all"
                style={{ color: colorFromTime(sensor.timeOfLife ?? Infinity) }}
              >
                {(sensor.timeOfLife ?? Infinity).toFixed(4) + "s"}
              </p>
            </div>
          </>
        )}
      </div>
      {!sensor.isLost && <TemperatureBar temperature={sensor.temperature} />}
    </>
  )
}

function TemperatureBar({ temperature }: { temperature: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-12 bg-red-300 w-3 flex flex-col justify-end">
        <div
          className="bg-red-500 transition-all"
          style={{ height: temperature < 0 ? 0 : normalizeHeight(temperature) }}
        />
      </div>
      <div className="h-0.5 bg-zinc-700 w-4" />
      <div className="h-12 bg-sky-200 w-3">
        <div
          className="bg-sky-500 transition-all"
          style={{ height: temperature > 0 ? 0 : normalizeHeight(-temperature) }}
        />
      </div>
    </div>
  );
}
