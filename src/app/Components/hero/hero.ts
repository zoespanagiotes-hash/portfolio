import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
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
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly translateService = inject(TranslateService);
  private readonly theme = inject(ThemeService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('particleCanvas') private particleCanvasRef?: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D | null = null;
  private particles: { x: number; y: number; vx: number; vy: number }[] = [];
  private particleAnimationId?: number;
  private readonly mouse = { x: -9999, y: -9999 };
  private readonly reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private readonly particleResizeHandler = () => this.setupParticleCanvas();
  private readonly particlePointerHandler = (e: PointerEvent) => this.onHeroPointerMove(e);

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

  ngAfterViewInit(): void {
    this.setupParticleCanvas();
    window.addEventListener('resize', this.particleResizeHandler, { passive: true });
    window.addEventListener('pointermove', this.particlePointerHandler, { passive: true });
  }

  ngOnDestroy(): void {
    if (this.typeTimer) {
      clearTimeout(this.typeTimer);
    }

    if (this.cursorTimer) {
      clearInterval(this.cursorTimer);
    }

    if (this.particleAnimationId) {
      cancelAnimationFrame(this.particleAnimationId);
    }

    window.removeEventListener('resize', this.particleResizeHandler);
    window.removeEventListener('pointermove', this.particlePointerHandler);
  }

  private setupParticleCanvas(): void {
    const canvas = this.particleCanvasRef?.nativeElement;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    this.ctx = canvas.getContext('2d');
    this.ctx?.scale(dpr, dpr);

    const density = 18000;
    const count = Math.min(
      70,
      Math.max(20, Math.floor((rect.width * rect.height) / density)),
    );

    this.particles = Array.from({ length: count }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));

    if (this.particleAnimationId) {
      cancelAnimationFrame(this.particleAnimationId);
    }

    if (this.reducedMotion) {
      this.renderParticles(rect.width, rect.height);
      return;
    }

    const loop = () => {
      this.renderParticles(rect.width, rect.height);
      this.particleAnimationId = requestAnimationFrame(loop);
    };

    this.particleAnimationId = requestAnimationFrame(loop);
  }

  private renderParticles(width: number, height: number): void {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const maxDist = 130;
    const mouseRadius = 160;

    if (!this.reducedMotion) {
      for (const p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
    }

    for (let i = 0; i < this.particles.length; i++) {
      const a = this.particles[i];

      for (let j = i + 1; j < this.particles.length; j++) {
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          ctx.strokeStyle = `rgba(159, 180, 196, ${0.12 * (1 - dist / maxDist)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      const mdx = a.x - this.mouse.x;
      const mdy = a.y - this.mouse.y;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      const nearMouse = mDist < mouseRadius;

      if (nearMouse) {
        ctx.strokeStyle = `rgba(193, 80, 46, ${0.35 * (1 - mDist / mouseRadius)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(this.mouse.x, this.mouse.y);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.fillStyle = nearMouse ? '#C1502E' : 'rgba(159, 180, 196, 0.55)';
      ctx.arc(a.x, a.y, nearMouse ? 2.4 : 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private onHeroPointerMove(e: PointerEvent): void {
    const canvas = this.particleCanvasRef?.nativeElement;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
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