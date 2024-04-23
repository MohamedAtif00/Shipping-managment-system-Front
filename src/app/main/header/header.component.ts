import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/Service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  {

  

  constructor(public auth:AuthService,private router:Router){}


  LogOut()
  {
    this.auth.Logout();
    this.router.navigate(['']);
  }
}
