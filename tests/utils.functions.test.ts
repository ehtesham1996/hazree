import { convertSecondToHHMM, timeSince } from '@src/core';

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

describe('utils ===> timeSince function test', () => {
  it('should return 2 days ago for input date older to 2 days', () => {
    const date = new Date();
    const input = date.setDate(date.getDate() - 2) - 1000;
    const expected = '2 days ago';
    const actual = timeSince(input);
    expect(actual).toBe(expected);
  });

  it('should show now if input is negative', () => {
    const date = new Date();
    const input = date.setDate(date.getTime() + 5000);
    const expected = 'now';
    const actual = timeSince(input);
    expect(actual).toBe(expected);
  });

  it('should return 5 seconds ago for input date 5 seconds old', () => {
    const date = new Date();
    const input = date.getTime() - 5000;
    const expected = '5 seconds ago';
    const actual = timeSince(input);
    expect(actual).toBe(expected);
  });

  it('should return now for input date 0', () => {
    const expected = 'now';
    const actual = timeSince(0);
    expect(actual).toBe(expected);
  });

  it('should return 1 minutes ago for input date 1 minute ago', () => {
    const date = new Date();
    const input = date.getTime() - 60000;
    const expected = '1 minutes ago';
    const actual = timeSince(input);
    expect(actual).toBe(expected);
  });

  it('should return 3 months ago for input date 3 months ago', () => {
    const date = new Date();
    const input = date.getTime() - 7889400000;
    const expected = '3 months ago';
    const actual = timeSince(input);
    expect(actual).toBe(expected);
  });

  it('should return 1 year ago for input date 13 months ago', () => {
    const date = new Date();
    const input = date.getTime() - 34187400000;
    const expected = '1 years ago';
    const actual = timeSince(input);
    expect(actual).toBe(expected);
  });

  it('should return 23 hours ago for input date 23 hours ago', () => {
    const date = new Date();
    const input = date.getTime() - 82800000;
    const expected = '23 hours ago';
    const actual = timeSince(input);
    expect(actual).toBe(expected);
  });
});
