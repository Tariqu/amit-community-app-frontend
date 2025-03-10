import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { UsersComponent } from './features/users/users/users.component';
import { AuthGuard } from './auth/auth.guard';
import { FillDetailsComponent } from './features/users/components/fill-details/fill-details.component';
import { ErrorComponent } from './shared/components/error/error.component';
import { SuccessComponent } from './shared/components/success/success.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'fill-details/:token', component: FillDetailsComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'success', component: SuccessComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
