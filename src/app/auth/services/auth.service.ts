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

  

  //joya
  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        // console.log("hola");
        this.afs
          .doc<User>(`users/${user.uid}`)
          .get()
          .toPromise()
          .then((res) => {
            this.userData = res.data();
            // console.log(this.userData);
          });
      } else {
        this.userData = null;
      }
    });

    // var schoolRef = db.collection('schools');

    // var query = schoolRef.where('userAdmin', '==', this.userData.uid);
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
      direccion: direccion,
      localidad: localidad,
      telefono: telefono,
      duracionModulo: duracionModulo,
      inicioHorario: inicioHorario,
      finalizacionHorario: finalizacionHorario,
      usuariosExtensiones: [],
      aulas: [],
      modulos: [],
      cursos: [],
      profes: [],
    };
    if (
      school.nombre != '' &&
      school.direccion != '' &&
      school.localidad != '' &&
      school.telefono != '' &&
      school.duracionModulo != null &&
      school.inicioHorario != null &&
      school.finalizacionHorario != null &&
      school.inicioHorario < school.finalizacionHorario
    ) {
      this.SchoolData(school);
      this.router.navigate(['/crear-colegio']);
    }
  }

  // async infoSchoolGeneral(
  //   duracionModulo: number,
  //   InicioHorario: string,
  //   FinalizacionHorario: string,
  //   cantCursos: number,
  //   cantProfes: number,
  //   cantMaterias: number,
  //   id: string,
  // ) {
  //   const schoolDataGeneral: InfoColegio = {
  //     id: id,
  //    // codigoColegioCorrespondiente: this.userData. conseguir el id del colegio q creo el usuario
  //     duracionModulo: duracionModulo,
  //     InicioHorario: InicioHorario,
  //     FinalizacionHorario: FinalizacionHorario,
  //     cantCursos: cantCursos,
  //     cantProfes: cantProfes,
  //     cantMaterias: cantMaterias,
  //   };
  //   if (
  //     schoolDataGeneral.duracionModulo != null &&
  //     schoolDataGeneral.InicioHorario != '' &&
  //     schoolDataGeneral.FinalizacionHorario != '' &&
  //     schoolDataGeneral.cantCursos != null &&
  //     schoolDataGeneral.cantProfes != null &&
  //     schoolDataGeneral.cantMaterias != null
  //   ) {
  //     this.SchoolDataTotal(schoolDataGeneral);

  //   }
  // }

  // async joinSchool(
  //   codigoColegio: string
  // ) {
  //   if(codigoColegio == ){
  //     const school: Colegio = {
  //     // codigoColegio: codigoColegio
  //   };
  //   // if (
  //   //   school.codigoColegio != ''
  //   // ) {
  //   //   this.SchoolData(school);
  //   //   this.router.navigate(['/crear-colegio']);
  //   // }
  //   }

  // }

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

  //joya
  private SchoolData(school: any) {
    const schoolRef: AngularFirestoreDocument<Colegio> = this.afs.doc(
      `schools/${school.id}`
    );

    const data: Colegio = {
      id: school.id,
      userAdmin: school.userAdmin,
      nombre: school.nombre,
      direccion: school.direccion,
      localidad: school.localidad,
      telefono: school.telefono,
      duracionModulo: school.duracionModulo,
      inicioHorario: school.inicioHorario,
      finalizacionHorario: school.finalizacionHorario,
      usuariosExtensiones: [],
      aulas: [],
      modulos: [],
      cursos: [],
      profes: [],
    };

    return schoolRef.set(data, { merge: true });
  }

  // private SchoolDataTotal(school: any) {
  //   const schoolRef: AngularFirestoreDocument<InfoColegio> = this.afs.doc(
  //     `dataSchools/${school.id}`
  //   );

  //   let contador = 0;

  //   if(contador == 0){
  //     const dataGral: InfoColegio = {
  //       duracionModulo: school.duracionModulo,
  //       InicioHorario: school.InicioHorario,
  //       FinalizacionHorario: school.FinalizacionHorario,
  //       cantCursos: school.cantCursos,
  //       cantProfes: school.cantProfes,
  //       cantMaterias: school.cantMaterias,
  //       id: school.id,
  //       codigoColegioCorrespondiente: school.codigoColegioCorrespondiente,
  //     };
  //     contador += 1;
  //   }
  //   else if(contador == 1){

  //     contador += 1;
  //   }
  //   else if(contador == 2){

  //     contador += 1;
  //   }
  //   else if(contador == 3){

  //     contador += 1;
  //   }
  //   else if(contador == 4){

  //     contador = 0;
  //   }

  //   return schoolRef.set(dataGral, { merge: true });
  // }
}
