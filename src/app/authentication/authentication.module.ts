import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationRoutingModule } from './authentication-routing/authentication-routing.module';
import { DonorLoginComponent } from './donor-login/donor-login.component';
import { DonorRegisterComponent } from './donor-register/donor-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLoginComponent } from './admin-login/admin-login.component';



@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    DonorLoginComponent,
    DonorRegisterComponent,
    AdminLoginComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthenticationModule { }
