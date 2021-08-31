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

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.afs
          .doc<User>(`users/${user.uid}`).snapshotChanges().pipe().subscribe( res => {
            this.userData = res.payload.data();
          });
      } else {
        this.userData = null;
        // this.router.navigate(['/login']);
      }
    });
    // const user2 = firebase.auth().currentUser;
    // user2?.reload().then(() => {
    //   const refreshUser = firebase.auth().currentUser;
    //   if(refreshUser?.emailVerified){
    //     console.log("A")
    //   }
    //   else{
    //     console.log("B")
    //   }
    // })

    // this.authSvc.afAuth.user.subscribe((user) => {

    //   if (user) {
    //     this.afs
    //       .doc<User>(`users/${user.uid}`)
    //       .snapshotChanges()
    //       .pipe()
    //       .subscribe((res) => {
    //         this.userData = res.payload.data();
    //         console.log("a")
    //         if (this.userData && this.userData.emailVerified){
    //           this.router.navigate(['/eleccion']);
    //         }
    //       });
    // if (this.userData) {
    //   if (this.mandarAEleccion && this.userData.emailVerified) {
    //     this.mandarAEleccion = false;
    //   }
    // } else {
    //   this.userData = null;
    // }
    //   }
    // });
    setInterval(()=>{
      firebase.auth().currentUser?.reload().then(() => {
        if(firebase.auth().currentUser?.emailVerified){
          this.afs.collection('users').doc(this.userData.uid).update({
            emailVerified: true,
          });
          this.router.navigate(['/eleccion']);
        }
        else{
          console.log("B")
        }
      });
    },1000);
  }

  ngOnInit(): void {}

  onSendEmail() {
    this.authSvc.sendVerificationEmail();
  }
}
