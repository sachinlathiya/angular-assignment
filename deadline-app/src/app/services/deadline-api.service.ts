import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { DeadlineResponse } from '../models/deadline-response.model';

@Injectable({ providedIn: 'root' })
export class DeadlineApiService {
  private readonly http = inject(HttpClient);

  fetchSecondsLeft(): Observable<number> {
    return this.http
      .get<DeadlineResponse | null>('/api/deadline')
      .pipe(map((response) => this.normalizeSecondsLeft(response)));
  }

  private normalizeSecondsLeft(response: DeadlineResponse | null): number {
    const value = response?.secondsLeft;

    if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
      return 0;
    }

    return Math.max(0, Math.floor(value));
  }
}
