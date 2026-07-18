import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../theme.service';
import { TranslatePipe } from '../../translate.pipe';
import { TranslateService } from '../../translate.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss','./hero-float.scss'],
})

export class HeroComponent implements OnInit, OnDestroy {
  private translateService= inject(TranslateService);
  private theme= inject(ThemeService);
  private cdr= inject(ChangeDetectorRef);

   // ---- Στοιχεία προφίλ — άλλαξέ τα με τα δικά σου ----
  readonly name = 'Το Όνομά Σου';
  readonly role = 'Front-end Developer';
  readonly stack: string[] = ['Angular', 'TypeScript', 'Node.js', 'Tailwind'];
 
  // ---- Terminal typewriter ----
  private readonly commands: string[] = [
    'code --build',
    'code --solve',
    'code --repeat',
  ];
 
  readonly typedText = signal('');
  readonly showCursorSolid = signal(true);
  readonly tiltTransform = signal(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
  );
  readonly language = this.translateService.language;
 
  private commandIndex = 0;
  private charIndex = 0;
  private mode: 'typing' | 'pausing' | 'deleting' = 'typing';
  private typeTimer?: ReturnType<typeof setTimeout>;
  private cursorTimer?: ReturnType<typeof setInterval>;
 
  ngOnInit(): void {
    this.tick();
    // ανεξάρτητο blink για τον κέρσορα ώστε να μη "παγώνει" ενώ γράφει
    this.cursorTimer = setInterval(() => {
      this.showCursorSolid.update((v) => !v);
    }, 500);
  }

  setLanguage(lang: 'en' | 'el'): void {
    void this.translateService.setLanguage(lang).then(() => {
      this.cdr.markForCheck();
    });
  }
 
  ngOnDestroy(): void {
    if (this.typeTimer) clearTimeout(this.typeTimer);
    if (this.cursorTimer) clearInterval(this.cursorTimer);
  }

  // Mobile menu state
  mobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.cdr.markForCheck();
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    this.cdr.markForCheck();
  }

  // Theme helpers
  isDark(): boolean {
    return this.theme.current === 'dark';
  }

  themeToggle(): void {
    this.theme.toggle();
    // notify Angular to check this OnPush component
    this.cdr.markForCheck();
  }
 
  private tick(): void {
    const current = this.commands[this.commandIndex];
    let delay = 55;
 
    if (this.mode === 'typing') {
      this.charIndex++;
      this.typedText.set(current.slice(0, this.charIndex));
      if (this.charIndex >= current.length) {
        this.mode = 'pausing';
        delay = 1400;
      }
    } else if (this.mode === 'pausing') {
      this.mode = 'deleting';
      delay = 300;
    } else {
      this.charIndex--;
      this.typedText.set(current.slice(0, this.charIndex));
      delay = 30;
      if (this.charIndex <= 0) {
        this.mode = 'typing';
        this.commandIndex = (this.commandIndex + 1) % this.commands.length;
        delay = 400;
      }
    }
 
    this.typeTimer = setTimeout(() => this.tick(), delay);
  }
 
  /** Απαλό 3D tilt που ακολουθεί το ποντίκι — η φωτο "αντιδρά" αντί να κάθεται άκαμπτη. */
  onPhotoMove(event: MouseEvent, wrap: HTMLElement): void {
    const rect = wrap.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateY = relX * 8;
    const rotateX = relY * -8;
    this.tiltTransform.set(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.015)`
    );
  }
 
  onPhotoLeave(): void {
    this.tiltTransform.set(
      'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
    );
  }
}