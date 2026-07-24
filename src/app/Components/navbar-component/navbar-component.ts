import {
  Component,
  AfterViewInit,
  OnDestroy,
  Input,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../translate.pipe';
import { TranslateService } from '../../translate.service';
import { Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs';

export interface NavSection {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss',
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private translateService = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  readonly language = this.translateService.language;

  mobileOpen = false;
  mobileBurgerVisible = false; // becomes true when user scrolls on small screens
  private lastScroll = 0;
  private scrollHandler = this.onWindowScroll.bind(this);
  private resizeHandler = this.onWindowSizeChange.bind(this);
  private pointerMoveHandler: any;
  private pointerUpHandler: any;
  private dragging = false;
  private startY = 0;
  private startTop = 0;

  @ViewChild('desktopNav', { static: true }) desktopNav!: ElementRef<HTMLElement>;

  @Input() sections: NavSection[] = [
    { id: 'home', label: 'navbar.sections.home', icon: 'home' },
    { id: 'about', label: 'navbar.sections.about', icon: 'info' },
    { id: 'skills', label: 'navbar.sections.skills', icon: 'star' },
    { id: 'my-journey', label: 'navbar.sections.my-journey', icon: 'work' },
    { id: 'contact', label: 'navbar.sections.contact', icon: 'email' },
  ];

  readonly activeId = signal<string>('');

  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    // στοίβα microtask ώστε να έχουν προλάβει να μπουν τα ids στο DOM
    queueMicrotask(() => this.setupObserver());
    // listen to scroll + resize to show burger on mobile
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    window.addEventListener('resize', this.resizeHandler, { passive: true });
    this.onWindowSizeChange();

    // prepare pointer handlers for dragging
    this.pointerMoveHandler = this.onPointerMove.bind(this);
    this.pointerUpHandler = this.onPointerUp.bind(this);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    window.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener('pointermove', this.pointerMoveHandler);
    window.removeEventListener('pointerup', this.pointerUpHandler);
  }

  private setupObserver(): void {
    const elements = this.sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);

    if (!elements.length) {
      return;
    }

    // "ενεργό" θεωρείται το section που περνάει από την κάθετη γραμμή
    // στο μέσο της οθόνης — κλασική τεχνική scroll-spy
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeId.set(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );

    elements.forEach((el) => this.observer!.observe(el));

    if (!this.activeId()) {
      this.activeId.set(this.sections[0].id);
    }
  }

  // show burger button on mobile when the user scrolls or on initial mobile load
  private onWindowScroll(): void {
    const isMobile = window.innerWidth < 1024;
    const y = window.scrollY || window.pageYOffset;
    const shouldShow = isMobile && (y > 20 || this.mobileOpen);
    if (shouldShow !== this.mobileBurgerVisible) {
      this.mobileBurgerVisible = shouldShow;
      this.cdr.markForCheck();
    }
    this.lastScroll = y;
  }

  private onWindowSizeChange(): void {
    this.onWindowScroll();
  }

  // DRAGGING for desktop nav (pointer events)
  startDrag(event: PointerEvent): void {
    // only allow dragging on large screens (lg breakpoint ~ 1024px)
    if (window.innerWidth < 1024) return;
    // prepare for potential drag but don't commit until there is movement
    this.dragging = false;
    this.startY = event.clientY;

    // ensure pointer listeners are attached to detect movement
    window.addEventListener('pointermove', this.pointerMoveHandler);
    window.addEventListener('pointerup', this.pointerUpHandler);
  }

  private onPointerMove(e: PointerEvent): void {
    const nav = this.desktopNav?.nativeElement;
    if (!nav) return;
    const dy = e.clientY - this.startY;

    // If not yet dragging, start drag only after threshold to avoid clicks triggering reposition
    if (!this.dragging) {
      const threshold = 6; // pixels
      if (Math.abs(dy) < threshold) {
        return;
      }
      // start dragging: compute startTop from current bounding rect and disable translate
      this.dragging = true;
      const rect = nav.getBoundingClientRect();
      this.startTop = rect.top;
      nav.style.transform = 'none';
      nav.style.top = `${rect.top}px`;
    }

    let newTop = this.startTop + dy;
    // clamp to viewport
    const maxTop = window.innerHeight - nav.offsetHeight - 12;
    if (newTop < 12) newTop = 12;
    if (newTop > maxTop) newTop = maxTop;
    nav.style.top = `${newTop}px`;
  }

  private onPointerUp(): void {
    // if we never entered dragging, just remove listeners and do nothing (it's a click)
    if (!this.dragging) {
      window.removeEventListener('pointermove', this.pointerMoveHandler);
      window.removeEventListener('pointerup', this.pointerUpHandler);
      return;
    }

    this.dragging = false;
    window.removeEventListener('pointermove', this.pointerMoveHandler);
    window.removeEventListener('pointerup', this.pointerUpHandler);
  }

  setLanguage(lang: 'en' | 'el'): void {
    void this.translateService.setLanguage(lang).then(() => {
      this.cdr.markForCheck();
    });
  }

  private scrollToSection(id: string): void {
    const element = document.getElementById(id);

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    this.activeId.set(id);
  }

  async onLinkClick(event: Event, id: string): Promise<void> {
    event.preventDefault();
    this.closeMobileMenu();

    const isHomePage = this.router.url.split('#')[0] === '/';

    if (isHomePage) {
      this.scrollToSection(id);

      await this.router.navigate([], {
        fragment: id,
        replaceUrl: true,
      });

      return;
    }

    await this.router.navigate(['/'], {
      fragment: id,
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.scrollToSection(id);
        this.setupObserver();
      });
    });
  }

  toggleMobileMenu(): void {
    this.mobileOpen = !this.mobileOpen;
    this.cdr.markForCheck();
  }

  closeMobileMenu(): void {
    this.mobileOpen = false;
    this.cdr.markForCheck();
  }
}
