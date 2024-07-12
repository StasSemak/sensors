export function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function getRandomVector(min: number, max: number) {
  return {
    x: getRandomNumber(min, max),
    y: getRandomNumber(min, max),
    z: getRandomNumber(min, max),
  };
}
