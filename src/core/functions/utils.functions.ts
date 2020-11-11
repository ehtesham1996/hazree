/**
 * @param seconds number of seconds to be converted to HH:MM
 * @description This utiltiy function convert the number of seconds to HH:MM format
 */
export function convertSecondToHHMM(seconds = 0): string {
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  // eslint-disable-next-line prefer-template
  return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}`;
}
