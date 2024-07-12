export function colorFromTime(time: number) {
  if (time <= 5) return "#ef4444";
  if (time > 5 && time <= 10) return "#facc15";
  return "#a3e635";
}

export function normalizeHeight(value: number, max: number = 48) {
  return value * (max / 35);
}
