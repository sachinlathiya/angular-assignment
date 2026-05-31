import { Pipe, PipeTransform } from '@angular/core';

export interface CountdownBreakdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Pipe({
  name: 'countdownBreakdown',
  pure: true,
})
export class CountdownBreakdownPipe implements PipeTransform {
  transform(totalSeconds: number): CountdownBreakdown {
    const safe = Math.max(0, Math.floor(totalSeconds));

    return {
      days: Math.floor(safe / 86_400),
      hours: Math.floor((safe % 86_400) / 3_600),
      minutes: Math.floor((safe % 3_600) / 60),
      seconds: safe % 60,
    };
  }
}
