// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from 'src/app/auth/services/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(private aServ: AuthService, private router: Router) {
//   }

//   canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
//     if (this.aServ.userData != null) {
//         return true;
//     }

//     // navigate to login page
//     this.router.navigate(['/login']);
//     // you can save redirect url so after authing we can move them back to the page they requested
//     return false;
//   }
  
// }
