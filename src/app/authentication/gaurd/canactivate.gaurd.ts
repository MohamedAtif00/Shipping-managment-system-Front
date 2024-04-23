import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map } from "rxjs";
import { AuthService } from "../Service/auth.service";

@Injectable({
    providedIn:'root'
})
export class UserCanActivate implements CanActivate{


    constructor(private authServ: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.authServ.token) {
        return this.authServ.AllowAccessToken().pipe(
          map(data => {
            if (data.role.toLowerCase() === 'user') {
              return true; // Allow navigation
            } else {
              // Redirect to a different route if not authorized
              return this.router.createUrlTree(['/auth', 'login']);
            }
          })
        );
      } else {
        // Redirect to login page if token is not available
        return this.router.createUrlTree(['/auth', 'login']);
      }
    }

}
