import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from '../interface/user.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [AuthService],
})
export class NavbarComponent {
  // user = this.authSvc.userData;
  // verificado: boolean = true;
  public userData: any;

  constructor(private authSvc: AuthService, private router: Router, private afs: AngularFirestore, public afAuth: AngularFireAuth,) {
    // authSvc.afAuth.authState.subscribe((user) => {
    //   if (!user) {
    //     this.verificado = false;
    //   }
    // });
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.afs
          .doc<User>(`users/${user.uid}`)
          .get()
          .toPromise()
          .then((res) => {
            this.userData = res.data();
          });
      } else {
        this.userData = null;
      }
    });
  }

  // async onLogout() {
  //   await this.authSvc.logout();
  //   this.router.navigate(['/home']);
  // }
  

  // navbarCollapse(){
  //   document.getElementById('buttonNavbarColor02')?.getAttribute('aria-expanded');
    
  // }
}
