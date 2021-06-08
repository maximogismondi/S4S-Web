import { first, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';
import { User } from 'src/app/shared/interface/user.interface';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthService {
  user$: any;
  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );
  }

  async login(email:string, password:string){
    const result = await this.afAuth.signInWithEmailAndPassword(email, password);
    return result;
  }

  async register(email:string, password:string){
    const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
    this.sendVerificationEmail();
    return result;
  }

  async sendVerificationEmail(){
    return (await this.afAuth.currentUser)?.sendEmailVerification();
  }

  async logout(){
    await this.afAuth.signOut();
  }

  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
    };

    return userRef.set(data, { merge: true });
  }

}
