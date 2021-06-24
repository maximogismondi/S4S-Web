import { first, switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Colegio, User } from 'src/app/shared/interface/user.interface';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import firebase from 'firebase/app';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  public userData: any;

  //revisar
  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.afs
          .doc<User>(`users/${user.uid}`)
          .snapshotChanges()
          .pipe(
            map((res) => {
              this.userData = res;
            })
          );
      } else {
        this.userData = null;
      }
      // console.log(this.userData.uid);
    });
  }

  //joya
  async login(email: string, password: string) {
    const { user } = await this.afAuth.signInWithEmailAndPassword(
      email,
      password
    );
    if (user?.emailVerified) {
      this.updateUserData(user);
    }
    return user;
  }

  //joya
  async loginGoogle() {
    const { user } = await this.afAuth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
    if (user) {
      this.updateUserData(user);
    }
    return user;
  }

  //joya
  async register(email: string, password: string) {
    const user = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    this.sendVerificationEmail();
    return user;
  }

  //joya
  async sendVerificationEmail() {
    return (await this.afAuth.currentUser)?.sendEmailVerification();
  }

  //joya
  async logout() {
    await this.afAuth.signOut();
  }

  //revisar
  async createSchool(
    nombre: string,
    direccion: string,
    localidad: string,
    telefono: string
  ) {
    const school: Colegio = {
      nombre: nombre,
      direccion: direccion,
      localidad: localidad,
      telefono: telefono,
      usuariosExtensiones: [],
      // userAdmin: this.userData.uid,
    };
    if(school.nombre!="" && school.direccion!="" && school.localidad!="" && school.telefono!=""){
      this.SchoolData(school);
      this.router.navigate(['/crear-colegio']);
    }
    
  }

  //joya
  private updateUserData(user: any) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.email.split('@')[0],
      // colegios: user.colegio,
      // eleccion: user.eleccion,
    };

    return userRef.set(data, { merge: true });
  }
  
  //revisar
  private SchoolData(school: any) {
    const schoolRef: AngularFirestoreDocument<Colegio> = this.afs.doc(
      `schools/${school.nombre}`
    );

    const data: Colegio = {
      nombre: school.nombre,
      direccion: school.direccion,
      localidad: school.localidad,
      telefono: school.telefono,
      usuariosExtensiones: [],
      // codigo_Id: school.codigo_Id,
      // userAdmin: school.userAdmin,
    };

    return schoolRef.set(data, { merge: true });
  }
}
