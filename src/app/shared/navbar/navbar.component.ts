import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
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
  nombreUsuario:string;

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    // authSvc.afAuth.authState.subscribe((user) => {
    //   if (!user) {
    //     this.verificado = false;
    //   }
    // });

    // this.afAuth.authState.subscribe((user) => {
    //   if (user) {
    //     this.afs
    //       .doc<User>(`users/${user.uid}`)
    //       .get()
    //       .toPromise()
    //       .then((res) => {
    //         this.userData = res.data();
    //       });
    //   } else {
    //     this.userData = null;
    //   }
    // });

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.afs
          .doc<User>(`users/${user.uid}`).snapshotChanges().pipe().subscribe( res => {
            this.userData = res.payload.data();
          });
      } else {
        this.userData = null;
        this.router.navigate(['/login']);
      }
    });
    // authSvc.afAuth.authState.subscribe((user) => {
    //   if (user) {
    //     this.afs.collection('users', (ref) =>
    //         ref.where(user.uid, '==', this.authSvc.userData.uid)
    //       ).snapshotChanges().pipe(
    //         map((users) => {
    //           const usuario = users[0].payload.doc.data() as User;
    //           this.nombreUsuario = usuario.displayName;
    //         })
    //       ).subscribe();
    //   }
    // });
  }

  async onLogout() {
    await this.authSvc.logout();
  }

  // navbarCollapse(){
  //   document.getElementById('buttonNavbarColor02')?.getAttribute('aria-expanded');

  // }
}
