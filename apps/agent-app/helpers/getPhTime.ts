//this function simply returns the current time in the philippines, since the default UTC time is UTC+0 not UTC+8

export function getPhTime() {
  const nowUtc = new Date();
  const phOffset = 8 * 60 * 60 * 1000;
  const phTime = new Date(nowUtc.getTime() + phOffset);
  return phTime;
}
