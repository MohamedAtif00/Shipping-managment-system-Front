import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './main/home/home.component';
import { JobsListComponent } from './main/jobs-list/jobs-list.component';
import { CreateJobComponent } from './main/create-job/create-job.component';
import { MainRoutingModule } from './main-routing/main-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HttpClientModule } from '@angular/common/http';
import { JobPostComponent } from './main/jobs-list/job-post/job-post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobDetailsComponent } from './main/job-details/job-details.component';



@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    HomeComponent,
    JobsListComponent,
    CreateJobComponent,
    JobPostComponent,
    JobDetailsComponent
  ],
  imports: [
    CommonModule,
     MainRoutingModule,
     HttpClientModule,
     ModalModule.forChild(),
     BsDatepickerModule,
     ReactiveFormsModule,
     FormsModule
  ]
})
export class MainModule { }
