import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
    private router: Router){}

  canActivate():boolean {
    if (this.authService.loggedIn()) {
      return true
    }
    else{
      this.router.navigate(["/auth/sign-in"]);
      // this.router.navigate(["/landing-page"]);
      return false;
    }
  }
  
}
