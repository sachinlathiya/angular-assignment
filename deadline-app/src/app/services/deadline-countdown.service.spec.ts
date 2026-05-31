import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { DeadlineApiService } from './deadline-api.service';
import { DeadlineCountdownService } from './deadline-countdown.service';

describe('DeadlineCountdownService', () => {
  let service: DeadlineCountdownService;
  let api: jasmine.SpyObj<DeadlineApiService>;

  beforeEach(() => {
    api = jasmine.createSpyObj('DeadlineApiService', ['fetchSecondsLeft']);

    TestBed.configureTestingModule({
      providers: [
        DeadlineCountdownService,
        { provide: DeadlineApiService, useValue: api },
      ],
    });

    service = TestBed.inject(DeadlineCountdownService);
  });

  it('counts down locally after the first API call', fakeAsync(() => {
    api.fetchSecondsLeft.and.returnValue(of({ secondsLeft: 3 }));

    const values: number[] = [];
    service.countdown$().subscribe((value) => values.push(value));

    tick(0);
    expect(values).toEqual([3]);

    tick(1000);
    expect(values).toEqual([3, 2]);

    tick(1000);
    expect(values).toEqual([3, 2, 1]);

    tick(1000);
    expect(values).toEqual([3, 2, 1, 0]);
  }));

  it('does not call the API again while ticking', fakeAsync(() => {
    api.fetchSecondsLeft.and.returnValue(of({ secondsLeft: 2 }));

    service.countdown$().subscribe();
    tick(3000);

    expect(api.fetchSecondsLeft).toHaveBeenCalledTimes(1);
  }));
});
