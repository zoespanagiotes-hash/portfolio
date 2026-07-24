import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/mainPage/mainPage')
            .then(m => m.MainPageComponent)
    },
    {
        path: 'certifications',
        loadComponent: () =>
            import('./pages/certifications/certifications')
            .then(m => m.CertificationsComponent)
    },
    {
        path: '**',
        loadComponent: () =>
            import('./not-found-redirect')
            .then(m => m.NotFoundRedirectComponent)
    }
];
