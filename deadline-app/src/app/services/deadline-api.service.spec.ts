import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DeadlineApiService } from './deadline-api.service';

describe('DeadlineApiService', () => {
  let service: DeadlineApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(DeadlineApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads secondsLeft from the backend', () => {
    let result: number | undefined;

    service.fetchSecondsLeft().subscribe((response) => {
      result = response.secondsLeft;
    });

    const req = httpMock.expectOne('/api/deadline');
    expect(req.request.method).toBe('GET');
    req.flush({ secondsLeft: 120 });

    expect(result).toBe(120);
  });
});
