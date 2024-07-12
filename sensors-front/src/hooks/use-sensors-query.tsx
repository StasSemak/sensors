import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { SensorData } from "../types";
import { env } from "../env";

export function useSensorsQuery() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = new WebSocket(env.WEBSOCKET_URL);

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data) as SensorData[];
      queryClient.setQueryData(["sensors-data"], () => data);
    };

    return () => {
      socket.close();
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["sensors-data"],
    queryFn: () => [] as SensorData[],
    enabled: false,
  });
}
