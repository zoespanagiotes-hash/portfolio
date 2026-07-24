import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { LoadingSpinner } from '../../loading-spinner/loading-spinner';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../theme.service';
import { TranslatePipe } from '../../translate.pipe';
import { TranslateService } from '../../translate.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    LoadingSpinner
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrls: [
    './hero.scss',
    './hero-float.scss',
  ],
})
export class HeroComponent implements OnInit, OnDestroy {
  private readonly translateService = inject(TranslateService);
  private readonly theme = inject(ThemeService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly name = 'Το Όνομά Σου';
  readonly role = 'Front-end Developer';

  readonly stack: string[] = [
    'Angular',
    'TypeScript',
    'Node.js',
    'Tailwind',
  ];

  readonly profileImageUrl =
    'https://flqxwbvtstxurehpapkh.supabase.co/storage/v1/object/public/images/profile/profile-illustration.png';

  readonly imageLoaded = signal(false);
  readonly imageError = signal(false);

  private readonly commands: string[] = [
    'code --build',
    'code --solve',
    'code --repeat',
  ];

  readonly typedText = signal('');

  readonly showCursorSolid = signal(true);

  readonly tiltTransform = signal(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
  );

  readonly language = this.translateService.language;

  mobileMenuOpen = false;

  private commandIndex = 0;
  private charIndex = 0;

  private mode: 'typing' | 'pausing' | 'deleting' =
    'typing';

  private typeTimer?: ReturnType<typeof setTimeout>;
  private cursorTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.tick();

    this.cursorTimer = setInterval(() => {
      this.showCursorSolid.update((value) => !value);
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.typeTimer) {
      clearTimeout(this.typeTimer);
    }

    if (this.cursorTimer) {
      clearInterval(this.cursorTimer);
    }
  }

  onImageLoad(): void {
    this.imageLoaded.set(true);
    this.imageError.set(false);
  }

  onImageError(): void {
    this.imageLoaded.set(false);
    this.imageError.set(true);

    console.error(
      'Η εικόνα προφίλ δεν φορτώθηκε:',
      this.profileImageUrl,
    );
  }

  setLanguage(lang: 'en' | 'el'): void {
    void this.translateService
      .setLanguage(lang)
      .then(() => {
        this.cdr.markForCheck();
      });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.cdr.markForCheck();
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    this.cdr.markForCheck();
  }

  isDark(): boolean {
    return this.theme.current === 'dark';
  }

  themeToggle(): void {
    this.theme.toggle();
    this.cdr.markForCheck();
  }

  onPhotoMove(
    event: MouseEvent,
    wrap: HTMLElement,
  ): void {
    const rect = wrap.getBoundingClientRect();

    const relX =
      (event.clientX - rect.left) / rect.width - 0.5;

    const relY =
      (event.clientY - rect.top) / rect.height - 0.5;

    const rotateY = relX * 8;
    const rotateX = relY * -8;

    this.tiltTransform.set(
      `perspective(1000px) rotateX(${rotateX.toFixed(
        2,
      )}deg) rotateY(${rotateY.toFixed(
        2,
      )}deg) scale(1.015)`,
    );
  }

  onPhotoLeave(): void {
    this.tiltTransform.set(
      'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
    );
  }

  private tick(): void {
    const current = this.commands[this.commandIndex];

    let delay = 55;

    if (this.mode === 'typing') {
      this.charIndex++;

      this.typedText.set(
        current.slice(0, this.charIndex),
      );

      if (this.charIndex >= current.length) {
        this.mode = 'pausing';
        delay = 1400;
      }
    } else if (this.mode === 'pausing') {
      this.mode = 'deleting';
      delay = 300;
    } else {
      this.charIndex--;

      this.typedText.set(
        current.slice(0, this.charIndex),
      );

      delay = 30;

      if (this.charIndex <= 0) {
        this.mode = 'typing';

        this.commandIndex =
          (this.commandIndex + 1) %
          this.commands.length;

        delay = 400;
      }
    }

    this.typeTimer = setTimeout(
      () => this.tick(),
      delay,
    );
  }
}