import { NgModule } from '@angular/core';
import { TranslatePipe } from './translate.pipe';

@NgModule({
  imports: [TranslatePipe],
  exports: [TranslatePipe],
})
export class TranslateModule {}
