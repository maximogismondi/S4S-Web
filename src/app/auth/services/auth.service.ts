import { first, switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Aula, Colegio, User } from 'src/app/shared/interface/user.interface';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import firebase from 'firebase/app';
import { Router } from '@angular/router';
import { Time } from '@angular/common';

@Injectable()
export class AuthService {
  public userData: any;

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
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

  //joya
  async createSchool(
    nombre: string,
    direccion: string,
    localidad: string,
    telefono: string,
    duracionModulo: number,
    inicioHorario: Time,
    finalizacionHorario: Time,
    id: string
  ) {
    const school: Colegio = {
      id: id,
      userAdmin: this.userData.uid,
      nombre: nombre,
      ejecutado: "no",
      direccion: direccion,
      localidad: localidad,
      telefono: telefono,
      duracionModulo: duracionModulo,
      inicioHorario: inicioHorario,
      finalizacionHorario: finalizacionHorario,
      usuariosExtensiones: [],
      aulas: [],
      turnos: [],
      // modulos: [],
      materias: [],
      cursos: [],
      profesores: [],
    };

    if (
      String(school.nombre).length === 0 ||
      String(school.direccion).length === 0 ||
      String(school.localidad).length === 0 ||
      String(school.telefono).length === 0 ||
      String(school.duracionModulo).length === 0 ||
      String(school.inicioHorario).length === 0 ||
      String(school.finalizacionHorario).length === 0 ||
      String(school.inicioHorario).length === 0 ||
      String(school.finalizacionHorario).length === 0
      // school.nombre != ' ' &&
      // school.direccion != ' ' &&
      // school.localidad != ' ' &&
      // school.telefono != ' ' &&
      // school.duracionModulo != null &&
      // school.inicioHorario != null &&
      // school.finalizacionHorario != null &&
      // school.inicioHorario < school.finalizacionHorario
    ){
      confirm("Completar los casilleros obligatorios");
      // Poner los valores que se piden
    }
    else if(String(school.telefono).length != 8){
      // console.log(school.nombre)
      // console.log(school.telefono)
      // console.log(school.telefono.length)
      confirm("El numero de telefono no es igual a los 8 digitos, recuerda que no debe contener ningun espacio, ningun signo y debe ser de tamaño 8");
    }
    else if(school.duracionModulo>60 || school.duracionModulo<1){
      // console.log(school.duracionModulo)
      confirm("La duracion de cada modulo debe estar entre 1 a 60 min (incluidos los extremos)");
    }
    else if(school.inicioHorario > school.finalizacionHorario){
      confirm("El horario de finalizacion es mas chico que el de inicio");
    }
    // else if (
    //   school.nombre != ' ' &&
    //   school.direccion != ' ' &&
    //   school.localidad != ' ' &&
    //   school.telefono != ' ' &&
    //   school.duracionModulo != null &&
    //   school.inicioHorario != null &&
    //   school.finalizacionHorario != null &&
    //   school.inicioHorario < school.finalizacionHorario
    // ) {
    //   this.SchoolData(school);
    //   this.router.navigate(['/crear-colegio']);
    // }
    else{
      this.SchoolData(school);
      this.router.navigate(['/crear-colegio']);
      // confirm("Poner los valores que se piden");
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
    };

    return userRef.set(data, { merge: true });
  }

  //joya
  private SchoolData(school: any) {
    const schoolRef: AngularFirestoreDocument<Colegio> = this.afs.doc(
      `schools/${school.id}`
    );

    const data: Colegio = {
      id: school.id,
      userAdmin: school.userAdmin,
      nombre: school.nombre,
      ejecutado: school.ejecutado,
      direccion: school.direccion,
      localidad: school.localidad,
      telefono: "11" + school.telefono,
      duracionModulo: school.duracionModulo,
      inicioHorario: school.inicioHorario,
      finalizacionHorario: school.finalizacionHorario,
      usuariosExtensiones: [],
      aulas: [],
      turnos: [],
      // modulos: [],
      materias: [],
      cursos: [],
      profesores: [],
    };

    return schoolRef.set(data, { merge: true });
  }

}
