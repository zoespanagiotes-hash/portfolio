import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LoadingSpinner {
  @Input() size = 48;
  @Input() label = 'Φόρτωση...';
  @Input() showLabel = false;
}
