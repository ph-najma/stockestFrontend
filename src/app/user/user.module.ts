import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLoginComponent } from '../components/user/user-login/user-login.component';
import { SignupUserComponent } from '../components/user/signup-user/signup-user.component';
import { HomeComponent } from '../components/user/home/home.component';
import { RouterModule } from '@angular/router';
import { nonauthenticatedGuard } from '../nonauthenticated.guard';
import { authGuard } from '../auth.guard';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'signup',
        component: SignupUserComponent,
        canActivate: [nonauthenticatedGuard],
      },
      {
        path: 'login',
        component: UserLoginComponent,
        canActivate: [nonauthenticatedGuard],
      },
      { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    ]),
    UserLoginComponent,
    SignupUserComponent,
    HomeComponent,
  ],
})
export class UserModule {}
