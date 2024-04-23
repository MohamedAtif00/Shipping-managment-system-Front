import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { DonorRegisterComponent } from '../donor-register/donor-register.component';
import { DonorLoginComponent } from '../donor-login/donor-login.component';
import { AdminLoginComponent } from '../admin-login/admin-login.component';

const routes:Routes = [
  {path: 'register', component:RegisterComponent},
  {path: 'donor-register', component:DonorRegisterComponent},
  {path:'login',component:LoginComponent},
  {path:'donor-login',component:DonorLoginComponent},
  {path:'admin-login',component:AdminLoginComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class AuthenticationRoutingModule { }
