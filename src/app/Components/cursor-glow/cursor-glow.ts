import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-cursor-glow',
  standalone: true,
  templateUrl: './cursor-glow.html',
  styleUrl: './cursor-glow.scss',
})
export class CursorGlowComponent implements OnInit, OnDestroy {
  @ViewChild('glow', { static: true }) private glowRef!: ElementRef<HTMLDivElement>;

  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private hovering = false;
  private rafId?: number;

  // desktop-only, playful accent — skip entirely on touch devices and when
  // the user has asked the OS for reduced motion
  private readonly enabled =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  private readonly pointerMoveHandler = (e: PointerEvent) => this.onPointerMove(e);
  private readonly pointerOverHandler = (e: PointerEvent) => this.onPointerOver(e);

  ngOnInit(): void {
    if (!this.enabled) return;

    window.addEventListener('pointermove', this.pointerMoveHandler, { passive: true });
    window.addEventListener('pointerover', this.pointerOverHandler, { passive: true });

    const loop = () => {
      this.currentX += (this.targetX - this.currentX) * 0.18;
      this.currentY += (this.targetY - this.currentY) * 0.18;

      const scale = this.hovering ? 1.8 : 1;
      this.glowRef.nativeElement.style.transform =
        `translate3d(${this.currentX}px, ${this.currentY}px, 0) translate(-50%, -50%) scale(${scale})`;

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  ngOnDestroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    window.removeEventListener('pointermove', this.pointerMoveHandler);
    window.removeEventListener('pointerover', this.pointerOverHandler);
  }

  private onPointerMove(e: PointerEvent): void {
    this.targetX = e.clientX;
    this.targetY = e.clientY;
    this.glowRef.nativeElement.style.opacity = '1';
  }

  private onPointerOver(e: PointerEvent): void {
    const target = e.target as HTMLElement;
    this.hovering = !!target.closest?.(
      'a, button, [role="button"], input, textarea, select, label',
    );
    this.glowRef.nativeElement.classList.toggle('cursor-glow--active', this.hovering);
  }
}
