import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of, throwError } from 'rxjs';

import { DeadlineCountdownComponent } from './deadline-countdown.component';
import { DeadlineCountdownService } from '../../services/deadline-countdown.service';

describe('DeadlineCountdownComponent', () => {
  let fixture: ComponentFixture<DeadlineCountdownComponent>;
  let countdownService: jasmine.SpyObj<DeadlineCountdownService>;

  beforeEach(async () => {
    countdownService = jasmine.createSpyObj('DeadlineCountdownService', [
      'countdown$',
    ]);

    await TestBed.configureTestingModule({
      imports: [DeadlineCountdownComponent],
      providers: [
        { provide: DeadlineCountdownService, useValue: countdownService },
      ],
    }).compileComponents();
  });

  function renderCountdown(stream: Observable<number>): void {
    countdownService.countdown$.and.returnValue(stream);
    fixture = TestBed.createComponent(DeadlineCountdownComponent);
    fixture.detectChanges();
  }

  it('shows the countdown text', () => {
    renderCountdown(of(42));

    const line = fixture.debugElement.query(By.css('.countdown-line'))
      .nativeElement.textContent;

    expect(line).toContain('Seconds left to deadline:');
    expect(line).toContain('42');
  });

  it('shows zero when the deadline has passed', () => {
    renderCountdown(of(0));

    const value = fixture.debugElement.query(By.css('.countdown-value'))
      .nativeElement.textContent;

    expect(value.trim()).toBe('0');
  });

  it('shows an error message when loading fails', () => {
    renderCountdown(throwError(() => new Error('network')));

    const error = fixture.debugElement.query(By.css('.card--error'));
    expect(error).toBeTruthy();
  });

  it('shows a loading skeleton before first value arrives', () => {
    renderCountdown(new Observable<number>());

    const loadingCard = fixture.debugElement.query(By.css('.card--loading'));
    expect(loadingCard).toBeTruthy();
  });
});
