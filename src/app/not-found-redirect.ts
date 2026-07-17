import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found-redirect',
  standalone: true,
  template: '',
})
export class NotFoundRedirectComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.navigate([''], { queryParams: { notFound: 'true' }, replaceUrl: true });
  }
}
