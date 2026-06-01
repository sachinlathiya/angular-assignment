import { inject, Injectable } from '@angular/core';
import { distinctUntilChanged, map, Observable, switchMap, takeWhile, timer } from 'rxjs';

import { DeadlineApiService } from './deadline-api.service';

@Injectable({ providedIn: 'root' })
export class DeadlineCountdownService {
  private readonly api = inject(DeadlineApiService);

  /**
   * Loads the remaining time once, then ticks locally every second.
   * No repeated HTTP calls after the initial fetch.
   */
  countdown$(): Observable<number> {
    return this.api.fetchSecondsLeft().pipe(
      map((secondsLeft) => Date.now() + secondsLeft * 1000),
      switchMap((deadlineMs) => this.tickUntilDeadline(deadlineMs))
    );
  }

  private tickUntilDeadline(deadlineMs: number): Observable<number> {
    return timer(0, 1000).pipe(
      map(() => this.secondsUntil(deadlineMs)),
      distinctUntilChanged(),
      takeWhile((seconds) => seconds > 0, true)
    );
  }

  private secondsUntil(deadlineMs: number): number {
    return Math.max(0, Math.floor((deadlineMs - Date.now()) / 1000));
  }
}
