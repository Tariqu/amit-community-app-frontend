import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { UsersComponent } from './features/users/users/users.component';
import { AuthGuard } from './auth/auth.guard';
import { ErrorComponent } from './shared/components/error/error.component';
import { SuccessComponent } from './shared/components/success/success.component';
import { FamiliesComponent } from './features/families/families.component';
import { CreateFamilyComponent } from './features/families/components/create-family/create-family.component';
import { PubFillDetailsComponent } from './features/families/components/pub-fill-details/pub-fill-details.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'families', component: FamiliesComponent, canActivate: [AuthGuard] },
  {
    path: 'create-families',
    component: CreateFamilyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-families/:id',
    component: CreateFamilyComponent,
    canActivate: [AuthGuard],
  },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'fill-details/:token', component: PubFillDetailsComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'success', component: SuccessComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
