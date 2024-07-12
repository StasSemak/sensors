import { useSensorsQuery } from "../hooks/use-sensors-query";
import { SensorData } from "../types";
import { LoadingSpinner } from "./loading-spinner";
import { SensorCard } from "./sensor-card";

export function Dashboard() {
  return (
    <div className="max-w-[960px] w-full mx-auto min-h-screen flex flex-col justify-center items-center">
      <DashboardContent />
    </div>
  );
}

function DashboardContent() {
  const { data, isLoading, isError } = useSensorsQuery();

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <div className="text-2xl font-bold">Error happened!</div>;

  return <CardsGrid sensors={data} />;
}

function CardsGrid({ sensors }: { sensors: SensorData[] }) {
  return (
    <div className="grid grid-cols-4 grid-rows-3 w-full gap-4">
      {sensors.map((item, idx) => (
        <SensorCard key={idx} sensor={item}/>
      ))}
    </div>
  );
}
