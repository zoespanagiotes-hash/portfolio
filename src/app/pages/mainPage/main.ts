import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { TimelineComponent } from "../../Components/timeline-component/timeline-component";
import { NavbarComponent } from "../../Components/navbar-component/navbar-component";
import { HeroComponent } from "../../Components/hero/hero";

@Component({
  selector: 'app-main',
  imports: [NgIf, TimelineComponent, NavbarComponent, HeroComponent],
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
