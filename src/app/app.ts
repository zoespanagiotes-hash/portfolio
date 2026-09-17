import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TimelineComponent } from "./Components/timeline-component/timeline-component";
import { HeroComponent } from './Components/hero/hero';
import { NavbarComponent } from './Components/navbar-component/navbar-component';
import { CursorGlowComponent } from './Components/cursor-glow/cursor-glow';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CursorGlowComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
  protected readonly title = signal('portfolio');
}
