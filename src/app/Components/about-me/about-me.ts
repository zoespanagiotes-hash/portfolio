import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../translate.pipe';
import { TranslateService } from '../../translate.service';
import { LoadingSpinner } from '../../loading-spinner/loading-spinner';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [
    TranslatePipe,
    CommonModule,
    LoadingSpinner,
  ],
  templateUrl: './about-me.html',
  styleUrl: './about-me.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMe {
  private readonly translateService = inject(TranslateService);

  readonly language = this.translateService.language;

  readonly profileImageUrl =
    'https://flqxwbvtstxurehpapkh.supabase.co/storage/v1/object/public/images/profile/profile.jpg';

  readonly imageLoaded = signal(false);
  readonly imageError = signal(false);

  onImageLoad(): void {
    this.imageLoaded.set(true);
    this.imageError.set(false);
  }

  onImageError(): void {
    this.imageLoaded.set(false);
    this.imageError.set(true);

    console.error(
      'Η εικόνα About Me δεν φορτώθηκε:',
      this.profileImageUrl,
    );
  }
}