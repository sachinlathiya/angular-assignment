import { AsyncPipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { catchError, map, of, startWith } from 'rxjs';

import { CountdownBreakdownPipe } from '../../pipes/countdown-breakdown.pipe';
import { DeadlineCountdownService } from '../../services/deadline-countdown.service';

type CountdownView =
  | { status: 'loading' }
  | { status: 'ok'; seconds: number }
  | { status: 'error' };

@Component({
  selector: 'app-deadline-countdown',
  imports: [AsyncPipe, DecimalPipe, CountdownBreakdownPipe],
  templateUrl: './deadline-countdown.component.html',
  styleUrl: './deadline-countdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeadlineCountdownComponent {
  private readonly countdownService = inject(DeadlineCountdownService);

  readonly viewModel$ = this.countdownService.countdown$().pipe(
    map((seconds): CountdownView => ({ status: 'ok', seconds })),
    startWith({ status: 'loading' } satisfies CountdownView),
    catchError(() => of<CountdownView>({ status: 'error' }))
  );
}
