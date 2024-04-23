import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserModel } from "src/app/share/Model/user.model";
import { DonorLoginRequest, StudentLoginRequest } from "../Model/request/login.request";
import { DonorLoginResponse, StudentLoginResponse } from "../Model/response/login.response";
import { AllowAccessResponse } from "../Model/response/allow-access.response";
import {  Register } from "../Model/request/register.request";
import { RegisterResponse } from "../Model/response/register.response";
import { Observable, map, of } from "rxjs";
import { GeneralResponse } from "src/app/share/Model/general.response";

@Injectable({
    providedIn:'root'
})
export class AuthService{


    getAllowAccess:string = 'https://localhost:7001/api/Authentication/AllowAccess/'
    postLogin:string = 'https://localhost:7001/api/Authentication/Login'
    // postDonorLogin:string = 'https://localhost:7081/api/Authentication/DonorLogin'
    postRegister:string = 'https://localhost:7001/api/Authentication/Register'
    // postDonorRegister:string = 'https://localhost:7081/api/Authentication/DonorRegister'
     getCheckUsername:string = 'https://localhost:7001/api/Authentication/CheckUsername/'
     postAdminLogin:string = 'https://localhost:7001/api/Authentication/AdminLogin'


    user!:UserModel | undefined;
    token:string | null

    constructor(private http:HttpClient){

        this.token = localStorage.getItem('User_Token_Key')
        if(this.token != null)
            http.get<any>(this.getAllowAccess + this.token).subscribe(data=>{
                this.user = {id:data.userId,username:data.username,email:data.email,role:data.role,token:data.token}
                
            })
    }


    GetToken()
    {
        return localStorage.getItem('User_Token_Key');
    }

    SetTokens(token:string)
    {
         localStorage.setItem('User_Token_Key',token)
    }

    Login(studentInfo:StudentLoginRequest)
    {
        return this.http.post<GeneralResponse<StudentLoginResponse>>(this.postLogin,studentInfo).pipe(map(data=>{
            if(data ) console.log(data);

            if(data.value)
            {
                this.user = {id:data.value.userId,username:data.value.username,email:'',role:data.value.role,token:data.value.jwtToken}
                localStorage.setItem('User_Token_Key',data.value.jwtToken)
                this.token =this.GetToken()
            }
            return data
        }));
    }

    Register(Info:Register)
    {
        return this.http.post<RegisterResponse>(this.postRegister,Info)
        .pipe(map(data=>{
            this.user = {id:data.value.userId,username:data.value.username,email:Info.email,role:data.value.role,token:data.value.jwtToken}
            localStorage.setItem('User_Token_Key',data.value.jwtToken)
            this.token = this.GetToken()
            return data;
        }));
    }

    // DonorLogin(donorInfo:DonorLoginRequest)
    // {
    //     return this.http.post<GeneralResponse<DonorLoginResponse>>(this.postDonorLogin,donorInfo)
    //     .pipe(
    //         map((data) =>{
    //         if(data) console.log(data);
            


    //         if(data.value)
    //         {
    //             this.user = {id:data.value.userId,username:data.value.username,email:'',role:data.value.role,token:data.value.jwtToken}
    //             localStorage.setItem('User_Token_Key',data.value.jwtToken)
    //             this.token =this.GetToken()
    //         }

    //         return data

    //     })
    //     );
    // }
    // DonorRegister(DonroInfo:DonorRegister)
    // {
    //     return this.http.post<StudentRegisterResponse>(this.postDonorRegister,DonroInfo)
    //     .pipe(map(data=>{
    //         this.user = {id:data.value.userId,username:data.value.username,email:DonroInfo.email,role:data.value.role,token:data.value.jwtToken}
    //         localStorage.setItem('User_Token_Key',data.value.jwtToken)
    //         this.token = this.GetToken()
    //         return data;
    //     }));
    // }

    AdminLogin(login:{username:string,password:string})
    {
        return this.http.post<GeneralResponse<DonorLoginResponse>>(this.postAdminLogin,login)
        .pipe(
            map((data) =>{
            if(data) console.log(data);
            

            if(data.value)
            {
                this.user = {id:data.value.userId,username:data.value.username,email:'',role:data.value.role,token:data.value.jwtToken}
                localStorage.setItem('User_Token_Key',data.value.jwtToken)
                this.token =this.GetToken()
            }
                return data
        })
        );
    }



    AllowAccessToken()
    {
        let token = this.GetToken();
            return this.http.get<AllowAccessResponse>(this.getAllowAccess+this.GetToken());
  
    }

    CheckUsrname(username:string)
    {
        return this.http.get<boolean>(this.getCheckUsername+username);
    }

    Logout()
    {
        localStorage.removeItem('User_Token_Key')
        // this.user = {id:'',username:'',email:'',role:'',token:''}
        this.user = undefined;
        this.token = null
    }


}