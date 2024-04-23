import {  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../Service/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor{

    //constructor(private authServ:AuthService){}


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = localStorage.getItem('User_Token_Key');
        const authReq = req.clone(
            {setHeaders:{'Authorization':`Bearer ${token}`}}
        );

        return next.handle(authReq);
    }
}