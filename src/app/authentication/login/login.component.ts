import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

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


  CheckUsername():AsyncValidatorFn
  {
    return (AbstractControl):Observable<ValidationErrors|null> =>{
      let username = this.loginForm.controls['username'].value;
      return this.authServ.CheckUsrname(username).pipe(
        map((data)=>{
          console.log(data);
          
          return data?{nameTaken:true}: null
        }),
        catchError(() => of(null))
      );
    }
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
    this.authServ.Login(info).subscribe((data) => {
      if(!data.value) this.error = (<unknown>data.errors[0]) as Error
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
