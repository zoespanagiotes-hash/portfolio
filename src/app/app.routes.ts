import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/mainPage/main')
            .then(m => m.Main)
    },
    {
        path: 'certifications',
        loadComponent: () =>
            import('./pages/certifications/certifications')
            .then(m => m.Certifications)
    },
    {
        path: '**',
        loadComponent: () =>
            import('./not-found-redirect')
            .then(m => m.NotFoundRedirectComponent)
    }
];
