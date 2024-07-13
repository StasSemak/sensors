import { useEffect, useRef, useState } from "react";
import { SensorData } from "../types";
import { colorFromTime } from "../utils";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react";
import { useKeyPress } from "../hooks/use-key-press";
import { useOutsideClick } from "../hooks/use-outside-click";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { env } from "../env";

export function SensorPopup({
  sensor,
  closeFunc,
}: {
  sensor: SensorData;
  closeFunc: () => void;
}) {
  const popupRef = useRef<HTMLDivElement>(null);

  useOutsideClick(popupRef, closeFunc);
  useKeyPress("Escape", closeFunc);

  return (
    <div className="min-w-screen min-h-screen bg-zinc-950/60 flex flex-col justify-center items-center">
      <div
        className="w-full max-w-[515px] bg-sky-900 flex items-start p-8 rounded-2xl text-zinc-100 border-4 transition-all"
        ref={popupRef}
        style={{ borderColor: colorFromTime(sensor.timeOfLife ?? Infinity) }}
      >
        <PopupContent sensor={sensor} />
        <div>
          <button
            className="self-end rounded bg-transparent hover:bg-sky-300/30 transition-all p-px h-min"
            onClick={closeFunc}
          >
            <XIcon className="size-6 stroke-zinc-100" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PopupContent({ sensor }: { sensor: SensorData }) {
  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-3xl font-bold">{sensor.name}</p>
      {sensor.isLost ? (
        <p className="text-2xl font-semibold text-red-500">Connection lost!</p>
      ) : (
        <>
          <p className="text-lg font-semibold">
            Time to lose connection:{" "}
            <span style={{ color: colorFromTime(sensor.timeOfLife ?? Infinity) }}>
              {(sensor.timeOfLife ?? 0).toFixed(4) + "s"}
            </span>
          </p>
          <div className="flex gap-7">
            <div className="flex flex-col gap-3 items-center">
              <p className="text-lg font-semibold">Water speed</p>
              <p>{sensor.waterSpeed.x.toFixed(4)}</p>
              <p>{sensor.waterSpeed.y.toFixed(4)}</p>
              <p>{sensor.waterSpeed.z.toFixed(4)}</p>
            </div>
            <div className="flex flex-col gap-3 items-center pt-10 font-semibold">
              <p>X</p>
              <p>Y</p>
              <p>Z</p>
            </div>
            <div className="flex flex-col gap-3 items-center">
              <p className="text-lg font-semibold">Thruster speed</p>
              <ThrusterSpeed
                value={sensor.thrusterSpeed.x}
                axis="x"
                name={sensor.name}
              />
              <ThrusterSpeed
                value={sensor.thrusterSpeed.y}
                axis="y"
                name={sensor.name}
              />
              <ThrusterSpeed
                value={sensor.thrusterSpeed.z}
                axis="z"
                name={sensor.name}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ThrusterSpeed({
  value, axis, name
}: {
  value: number;
  axis: "x" | "y" | "z";
  name: string;
}) {
  const [speed, setSpeed] = useState<number>(value);

  useEffect(() => {
    setSpeed(value);
  }, [value]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-speed", name, axis],
    mutationFn: async (payload: any) => {
      const res = await axios.post<Record<typeof axis, number>>(`${env.API_URL}/sensor/${name}/thruster`, payload);
      return res.data;
    },
    onSuccess: (data) => {
      setSpeed(data[axis]);
    },
  });

  return (
    <div className="flex w-full items-center justify-between">
      <button 
        className="inline-flex items-center justify-center p-1 rounded-sm bg-transparent hover:bg-sky-300/30"
        onClick={() => {
          mutate({ [axis]: env.THRUSTER_SPEED_DECREMENT })
        }}
      >
        <MinusIcon className="size-4 stroke-zinc-100" />
      </button>
      <p className={`${isPending && "animate-pulse"}`}>{speed.toFixed(4)}</p>
      <button 
        className="inline-flex items-center justify-center p-1 rounded-sm bg-transparent hover:bg-sky-300/30"
        onClick={() => { 
          mutate({ [axis]: env.THRUSTER_SPEED_INCREMENT })
        }}
      >
        <PlusIcon className="size-4 stroke-zinc-100" />
      </button>
    </div>
  );
}
