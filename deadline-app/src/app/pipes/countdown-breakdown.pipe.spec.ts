import { CountdownBreakdownPipe } from './countdown-breakdown.pipe';

describe('CountdownBreakdownPipe', () => {
  const pipe = new CountdownBreakdownPipe();

  it('splits total seconds into days, hours, minutes, and seconds', () => {
    expect(pipe.transform(90_061)).toEqual({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
    });
  });

  it('never returns negative parts', () => {
    expect(pipe.transform(-5)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });
});
