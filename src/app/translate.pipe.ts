import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  constructor(private readonly translateService: TranslateService) {}

  transform(
    key: string,
    params?: Record<string, string | number | boolean>,
  ): string {
    return this.translateService.translate(key, params);
  }
}
