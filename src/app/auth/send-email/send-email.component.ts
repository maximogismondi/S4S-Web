import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/interface/user.interface';
import { AuthService } from '../services/auth.service';
import firebase from 'firebase/app';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
  providers: [AuthService],
})
export class SendEmailComponent implements OnInit {
  public user$: Observable<any> = this.authSvc.afAuth.user;
  public userData: any;
  mandarAEleccion: boolean = true;
  cambiarEmail: number = 0;
  usuarioEmail: string = ' ';
  emailsDeUsuarios: Array<any> = [];
  emailExistente: boolean = false;
  constructor(
    private authSvc: AuthService,
    private router: Router,
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.afs.firestore
          .collection('users')
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.emailsDeUsuarios.push(doc.data().email);
            });
          });

        this.afs
          .doc<User>(`users/${user.uid}`)
          .snapshotChanges()
          .pipe()
          .subscribe((res) => {
            this.userData = res.payload.data();
            this.usuarioEmail = this.userData.email;
          });
      } else {
        this.userData = null;
      }
    });
    setInterval(() => {
      firebase
        .auth()
        .currentUser?.reload()
        .then(() => {
          if (firebase.auth().currentUser?.emailVerified) {
            this.afs.collection('users').doc(this.userData.uid).update({
              emailVerified: true,
            });
            this.router.navigate(['menu-principal']);
          } 
        });
    }, 1000);
  }

  // async changeEmail() {
  //   if (this.cambiarEmail == 0) {
  //     this.cambiarEmail = 1;
  //   } else {
  //     this.emailsDeUsuarios.forEach((email) =>{
  //       if( this.usuarioEmail == email){
  //         this.emailExistente = true;
  //       }
  //     });
  //     if(this.emailExistente){
  //       alert('El email ya esta utilizado');
  //       this.emailExistente = false;
  //     }
  //     else{
  //       this.afs
  //       .collection('users')
  //       .doc(this.userData.uid)
  //       .update({
  //         email: this.usuarioEmail,
  //         displayName: this.usuarioEmail.split('@')[0],
  //       });

  //       (await this.afAuth.currentUser)?.updateEmail(this.usuarioEmail);
  //       this.cambiarEmail = 2;

  //       setTimeout(() => {
  //         this.onSendEmail();
  //       }, 1000);
  //     }
  //   }
  // }

  ngOnInit(): void {}

  onSendEmail() {
    this.authSvc.sendVerificationEmail();
  }
}
