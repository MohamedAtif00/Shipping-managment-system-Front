import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {

  loginForm!:FormGroup;
  error!:Error;

  constructor(private authServ:AuthService,private router:Router){}


  ngOnInit(): void {
    this.loginForm = new FormGroup
    (
        {
          username: new FormControl('', [Validators.required]),
          password: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
          ])
        }
    );
  }


  

 submitForm() {
  //if (this.registerFor) {
    console.log(this.loginForm);
    // Perform form submission logic here
  //}

  let info = {
    username:this.loginForm.controls['username'].value,
    password:this.loginForm.controls['password'].value,
  }

  if(this.loginForm.valid)
  {
    this.authServ.AdminLogin(info).subscribe((data) => {
      if(data.errors)
      {
        console.log(data.errors[0]);
        this.error = (<unknown>data.errors[0]) as Error
      }else
      {
        console.log('hello');
        
      }



      if(data.value) 
        this.router.navigate(['']);

    });
  } 
}




}
