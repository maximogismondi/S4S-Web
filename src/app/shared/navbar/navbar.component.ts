import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ColegioService } from 'src/app/colegio/services/colegio.service';
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
  nombreUsuario: string;

  constructor(
    private authSvc: AuthService,
    private colegioSvc: ColegioService,
    private router: Router,
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.afs
          .doc<User>(`users/${user.uid}`)
          .snapshotChanges()
          .pipe()
          .subscribe((res) => {
            this.userData = res.payload.data();
          });
      } else {
        this.userData = null;
      }
    });
  }

  async onLogout() {
    await this.authSvc.logout();
  }

  changeTheme() {
    alert('Bromita 🤙🤙🤙');
  }

  // goToHome() {

  //   // this.colegioSvc.irAHome = !this.colegioSvc.irAHome;
  //   this.router.navigate(['/home']);

  // }

  // navbarCollapse(){
  //   document.getElementById('buttonNavbarColor02')?.getAttribute('aria-expanded');

  // }
}
