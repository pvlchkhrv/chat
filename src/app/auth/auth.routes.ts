import { Route } from '@angular/router';

export const AUTH_ROUTES: Route[] = [
  { path: 'login',
    loadComponent: () => import('./login/login') },
  {
    path: 'register',
    loadComponent: () => import('./register/register'),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
