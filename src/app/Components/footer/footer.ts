import { Component, inject } from '@angular/core';
import { TranslatePipe } from '../../translate.pipe';
import { TranslateService } from '../../translate.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private translateService = inject(TranslateService);

  readonly language = this.translateService.language;
  readonly currentYear = new Date().getFullYear();

  get currentYearString(): string {
    return this.currentYear.toFixed();
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
