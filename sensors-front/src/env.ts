export const env = {
    WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL as string,
    API_URL: import.meta.env.VITE_API_URL as string,
    THRUSTER_SPEED_DECREMENT: Number(import.meta.env.VITE_THRUSTER_SPEED_DECREMENT),
    THRUSTER_SPEED_INCREMENT: Number(import.meta.env.VITE_THRUSTER_SPEED_INCREMENT),
}