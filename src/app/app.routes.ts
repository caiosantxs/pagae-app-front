import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';
import { HangoutDetails } from './pages/hangouts/hangout-details/hangout-details';
import { HangoutCreator } from './pages/hangouts/hangout-creator/hangout-creator';
import { JoinHangout } from './pages/join-hangout/join-hangout';
import { SimplificarDividas } from './pages/simplificar-dividas/simplificar-dividas';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'hangouts', loadComponent: () => import('./pages/hangouts/hangouts-list/hangouts').then(m => m.Hangouts) },
      { path: 'hangouts/new', component: HangoutCreator },
      { path: 'hangouts/:id', component: HangoutDetails},
      { path: 'acertos', component: SimplificarDividas },
      { path: 'join/:id', component: JoinHangout },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
