import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: false,
  template: `
    <div class="loading-state" role="status" aria-live="polite">
      <mat-progress-spinner diameter="48" mode="indeterminate"></mat-progress-spinner>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [
    `
      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        color: var(--text-muted);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingStateComponent {
  @Input() message = 'Loading data...';
}

