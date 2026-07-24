import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { AssetService } from '../../Services/asset-service';

import { TimelineComponent } from '../../Components/timeline-component/timeline-component';
import { NavbarComponent } from '../../Components/navbar-component/navbar-component';
import { HeroComponent } from '../../Components/hero/hero';
import { Footer } from '../../Components/footer/footer';
import { Skills } from '../../Components/skills/skills';
import { AboutMe } from '../../Components/about-me/about-me';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    TimelineComponent,
    NavbarComponent,
    HeroComponent,
    Footer,
    Skills,
    AboutMe,
  ],
  templateUrl: './mainPage.html',
  styleUrl: './mainPage.scss',
})
export class MainPageComponent implements OnInit {
  readonly notFoundMessage = signal('');
  readonly connectionMessage = signal('');
  readonly isTestingConnection = signal(false);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly assetService = inject(AssetService);

  async ngOnInit(): Promise<void> {
    try {
      const connected =
        await this.assetService.testConnection();

      console.log('Supabase connected:', connected);
    } catch (error) {
      console.error('Supabase test failed:', error);
    }
  }

}