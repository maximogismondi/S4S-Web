import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  providers: [AuthService],
})
export class SettingComponent implements OnInit {
  public userData: any;

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private fb: FormBuilder
  ) {
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

  ngOnInit(): void {
  }

  nuevoNombre: User = new User();

  async cambiarNombre() {
    // console.log(this.nuevoNombre.displayName);
    this.afs.collection('users').doc(this.userData.uid).update({
      displayName: this.nuevoNombre.displayName,
    });
  }

  async onLogout() {
    await this.authSvc.logout();
    this.router.navigate(['/home']);
  }

  // async borrarCuenta() {
  //   const user = firebase.auth().currentUser; 
  //   user.delete().then(() => {})
  // }
  // async borrarCuenta() {
  //   if (confirm('¿Estas seguro/a que quieres eliminar tu cuenta?')) {
  //     this.afs.collection('users').doc(this.idUsuarioAdmin).delete();
  //     this.afs.collection('schools').doc(this.nombreDocumento).delete();
  //   }
  // }
}
