import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
];
