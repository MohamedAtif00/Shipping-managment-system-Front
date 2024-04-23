import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../main/home/home.component';
import { MainComponent } from '../main/main.component';
import { CreateJobComponent } from '../main/create-job/create-job.component';
import { JobsListComponent } from '../main/jobs-list/jobs-list.component';
import { UserCanActivate } from 'src/app/authentication/gaurd/canactivate.gaurd';
import { JobDetailsComponent } from '../main/job-details/job-details.component';

const routes:Routes = [
  {path:'',component:MainComponent,children:[
    {path:'',component:HomeComponent},
    {path:'create-job',component:CreateJobComponent,canActivate:[UserCanActivate]},
    {path:'jobs-list',component:JobsListComponent},
    {path:'job-details/:id',component:JobDetailsComponent}
  ]}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class MainRoutingModule { }
