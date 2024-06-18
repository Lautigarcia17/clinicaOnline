import { Routes } from '@angular/router';
import { alreadyLoggedInGuard } from './core/guards/already-logged-in.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '', 
        loadComponent: () => import('./shared/components/layout/layout.component'),
        children: [
          {
            path: '', redirectTo: '/home', pathMatch: 'full'
          },
          {
            path: 'home', loadComponent: () => import('./features/home/home.component')
          },
          {
            path: 'login', loadComponent: () => import('./features/auth/login/login.component'), canActivate: [alreadyLoggedInGuard],
          },
          {
            path: 'register', loadComponent: () => import('./features/auth/register/register.component'), canActivate: [alreadyLoggedInGuard],
          },
          {
            path: 'profile', loadComponent: () => import('./features/profile/profile.component'), canActivate: [authGuard],
          },
          {
            path: 'manageUsers', loadComponent: () => import('./features/manage-users/manage-users.component'), canActivate: [authGuard],
          },
          {
            path: 'requestShift', loadComponent: () => import('./features/shifts/request-shift/request-shift.component'), canActivate: [authGuard],
          }
          ,
          {
            path: 'shifts', loadComponent: () => import('./features/shifts/shifts/shifts.component'), canActivate: [authGuard],
          },
          {
            path: 'patients', loadComponent: () => import('./features/manage-patients/manage-patients.component'), canActivate: [authGuard],
          }
        ]
      },

];