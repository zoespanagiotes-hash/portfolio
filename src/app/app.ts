import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TimelineComponent } from "./Components/timeline-component/timeline-component";
import { HeroComponent } from './Components/hero/hero';
import { NavbarComponent } from './Components/navbar-component/navbar-component';
import { CursorGlowComponent } from './Components/cursor-glow/cursor-glow';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CursorGlowComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
  // injected eagerly so the saved/default theme class is applied to
  // <html> before any component renders, avoiding a light-mode flash
  private readonly theme = inject(ThemeService);

  protected readonly title = signal('portfolio');
}
