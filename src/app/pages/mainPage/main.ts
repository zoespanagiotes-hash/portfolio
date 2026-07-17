import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { TimelineComponent } from "../../Components/timeline-component/timeline-component";
import { NavbarComponent } from "../../Components/navbar-component/navbar-component";
import { HeroComponent } from "../../Components/hero/hero";
import { Footer } from "../../Components/footer/footer";
import { Skills } from "../../Components/skills/skills";
import { AboutMe } from "../../Components/about-me/about-me";

@Component({
  selector: 'app-main',
  imports: [TimelineComponent, NavbarComponent, HeroComponent, Footer, Skills, AboutMe],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  readonly notFoundMessage = signal('');

  constructor(route: ActivatedRoute, router: Router) {
    const notFound = route.snapshot.queryParamMap.get('notFound');
    if (notFound === 'true') {
      this.notFoundMessage.set('Η σελίδα δεν βρέθηκε. Επιστρέψατε στην κύρια σελίδα.');
      router.navigate([], {
        relativeTo: route,
        queryParams: { notFound: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
      setTimeout(() => this.notFoundMessage.set(''), 10000);
    }
  }
}
