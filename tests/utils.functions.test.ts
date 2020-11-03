import { convertSecondToHHMM } from '@src/core';

describe('utils ==> convertSecondsToHHMM function tests', () => {
  it('should convert 60 seconds to 00:01', () => {
    const expected = '00:01';
    const actual = convertSecondToHHMM(60);
    expect(actual).toBe(expected);
  });

  it('should convert 01 seconds to 00:00', () => {
    const expected = '00:00';
    const actual = convertSecondToHHMM(1);
    expect(actual).toBe(expected);
  });

  it('should convert 7200 seconds to 02:00', () => {
    const expected = '02:00';
    const actual = convertSecondToHHMM(7200);
    expect(actual).toBe(expected);
  });

  it('should always return in format hh:mm', () => {
    const expected = '01:00';
    const actual = convertSecondToHHMM(3600);
    expect(actual).toBe(expected);
  });
});
