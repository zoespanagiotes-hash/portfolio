import { Component, inject } from '@angular/core';
import { TranslatePipe } from '../../translate.pipe';
import { TranslateService } from '../../translate.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-me',
  imports: [TranslatePipe, CommonModule],
  standalone: true,
  templateUrl: './about-me.html',
  styleUrl: './about-me.scss',
})
export class AboutMe {
  private translateService = inject(TranslateService);

  readonly language = this.translateService.language;
}
