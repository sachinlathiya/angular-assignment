import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DeadlineResponse } from '../models/deadline-response.model';

@Injectable({ providedIn: 'root' })
export class DeadlineApiService {
  private readonly http = inject(HttpClient);

  fetchSecondsLeft(): Observable<DeadlineResponse> {
    return this.http.get<DeadlineResponse>('/api/deadline');
  }
}
