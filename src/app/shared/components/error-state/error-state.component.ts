import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: false,
  template: `
    <div class="error-state">
      <mat-icon color="warn">error_outline</mat-icon>
      <div>
        <h3>Something went wrong</h3>
        <p>{{ message }}</p>
      </div>
      <button mat-stroked-button color="primary" *ngIf="showRetry" (click)="retry.emit()">
        Retry
      </button>
    </div>
  `,
  styles: [
    `
      .error-state {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid var(--border-default);
        border-radius: 0.75rem;
        background: var(--surface-secondary);
      }

      h3 {
        margin: 0;
        font-size: 1rem;
      }

      p {
        margin: 0;
        color: var(--text-muted);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorStateComponent {
  @Input() message = 'Unable to load data.';
  @Input() showRetry = true;
  @Output() retry = new EventEmitter<void>();
}

