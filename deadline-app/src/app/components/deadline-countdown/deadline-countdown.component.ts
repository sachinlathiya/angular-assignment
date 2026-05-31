import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { catchError, map, of } from 'rxjs';

import { DeadlineCountdownService } from '../../services/deadline-countdown.service';

type CountdownView =
  | { status: 'ok'; seconds: number }
  | { status: 'error' };

@Component({
  selector: 'app-deadline-countdown',
  imports: [AsyncPipe],
  templateUrl: './deadline-countdown.component.html',
  styleUrl: './deadline-countdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeadlineCountdownComponent {
  private readonly countdownService = inject(DeadlineCountdownService);

  readonly viewModel$ = this.countdownService.countdown$().pipe(
    map((seconds): CountdownView => ({ status: 'ok', seconds })),
    catchError(() => of<CountdownView>({ status: 'error' }))
  );
}
