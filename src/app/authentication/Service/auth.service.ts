import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserModel } from "src/app/share/Model/user.model";
import { DonorLoginRequest, StudentLoginRequest } from "../Model/request/login.request";
import { DonorLoginResponse, StudentLoginResponse } from "../Model/response/login.response";
import { AllowAccessResponse } from "../Model/response/allow-access.response";
import { DonorRegister, StudentRegister } from "../Model/request/register.request";
import { StudentRegisterResponse } from "../Model/response/register.response";
import { Observable, map, of } from "rxjs";
import { GeneralResponse } from "src/app/share/Model/general.response";

@Injectable({
    providedIn:'root'
})
export class AuthService{


    getAllowAccess:string = 'https://localhost:7081/api/Authentication/AllowAccess/'
    postStudentLogin:string = 'https://localhost:7081/api/Authentication/StudentLogin'
    postDonorLogin:string = 'https://localhost:7081/api/Authentication/DonorLogin'
    postStudentRegister:string = 'https://localhost:7081/api/Authentication/StudentRegister'
    postDonorRegister:string = 'https://localhost:7081/api/Authentication/DonorRegister'
    getCheckUsername:string = 'https://localhost:7081/api/Authentication/CheckUsername/'
    postAdminLogin:string = 'https://localhost:7081/api/Authentication/AdminLogin'


    user!:UserModel;
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

    StudentLogin(studentInfo:StudentLoginRequest)
    {
        return this.http.post<GeneralResponse<StudentLoginResponse>>(this.postStudentLogin,studentInfo).pipe(map(data=>{
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

    StudentRegister(studentInfo:StudentRegister)
    {
        return this.http.post<StudentRegisterResponse>(this.postStudentRegister,studentInfo)
        .pipe(map(data=>{
            this.user = {id:data.value.userId,username:data.value.username,email:studentInfo.email,role:data.value.role,token:data.value.jwtToken}
            localStorage.setItem('User_Token_Key',data.value.jwtToken)
            this.token = this.GetToken()
            return data;
        }));
    }

    DonorLogin(donorInfo:DonorLoginRequest)
    {
        return this.http.post<GeneralResponse<DonorLoginResponse>>(this.postDonorLogin,donorInfo)
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
    DonorRegister(DonroInfo:DonorRegister)
    {
        return this.http.post<StudentRegisterResponse>(this.postDonorRegister,DonroInfo)
        .pipe(map(data=>{
            this.user = {id:data.value.userId,username:data.value.username,email:DonroInfo.email,role:data.value.role,token:data.value.jwtToken}
            localStorage.setItem('User_Token_Key',data.value.jwtToken)
            this.token = this.GetToken()
            return data;
        }));
    }

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
        this.user = {id:'',username:'',email:'',role:'',token:''}
        this.token = null
    }


}