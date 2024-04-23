import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainModule } from './main/main.module';

const routes: Routes = [
  {path:'',loadChildren:()=>import('./main/main.module').then(x =>x.MainModule)},
  {path:'auth',loadChildren:()=>import('./authentication/authentication.module').then(x =>x.AuthenticationModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
