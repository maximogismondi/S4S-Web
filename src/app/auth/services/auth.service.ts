import { first, switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  Aula,
  Colegio,
  Turno,
  User,
} from 'src/app/shared/interface/user.interface';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import firebase from 'firebase/app';
import { Router } from '@angular/router';
// import { Time } from '@angular/common';

@Injectable()
export class AuthService {
  public userData: any;
  ingresoEmailCompleto: boolean = false;
  nombresDeEscuelas: Array<any> = [];
  existeEscuela: boolean = false;

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.afs.firestore
          .collection('schools')
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.nombresDeEscuelas.push(doc.data().nombre);
            });
          });

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

  async isLoggedIn(): Promise<boolean> {
    let user = await this.afAuth.authState.toPromise();
    // console.log(user);
    if (!user) {
      return false;
    }
    // console.log('dsdsds');
    let userData = await this.afs
      .doc<User>(`users/${user.uid}`)
      .get()
      .toPromise();
    // console.log(userData.data()?.emailVerified);
    if (userData.data()?.emailVerified) {
      return true;
    }
    return false;
  }

  //joya
  async login(email: string, password: string) {
    // if(this.userData == null) {
    //   alert("No existe una cuenta con ese email, por favor registrese");
    //   this.router.navigate(['/register']);
    // }
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        alert('No existe una cuenta con ese email, por favor registrese');
        this.router.navigate(['/register']);

        // console.log(error.code);
        // console.log(error.message);
      });

    const { user } = await this.afAuth.signInWithEmailAndPassword(
      email,
      password
    );

    // if (user?.emailVerified) {
    //   this.updateUserData(user);
    // }
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
    // const { user } = await firebase
    //   .auth()
    //   .createUserWithEmailAndPassword(email, password)
    //   .catch((error) => {
    //     alert(
    //       'El email que esta ingresando ya esta siendo utilizado, por favor pruebe otro'
    //     );
    //   });

    const { user } = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );

    this.updateUserData(user);
    this.sendVerificationEmail();
    return user;
  }

  resetPassword(email: string) {
    var auth = firebase.auth();
    return auth
      .sendPasswordResetEmail(email)
      .then(() => console.log('email enviado'))
      .catch((error) => console.log(error));
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
    provincia: string,
    telefono: string,
    duracionModulo: number,
    inicioHorario: string,
    finalizacionHorario: string,
    id: string
  ) {
    const school: Colegio = {
      id: id,
      userAdmin: this.userData.uid,
      nombre: nombre,
      // ejecutado: "no",
      direccion: direccion,
      provincia: provincia,
      telefono: telefono,
      duracionModulo: duracionModulo,
      inicioHorario: inicioHorario,
      finalizacionHorario: finalizacionHorario,
      botonesCrearColegioProgreso: 1,
      // botonesCrearColegio: 1,
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
      String(school.provincia).length === 0 ||
      String(school.telefono).length === 0 ||
      String(school.duracionModulo).length === 0 ||
      String(school.inicioHorario).length === 0 ||
      String(school.finalizacionHorario).length === 0 ||
      String(school.inicioHorario).length === 0 ||
      String(school.finalizacionHorario).length === 0
    ) {
      alert('Completar los casilleros obligatorios');
      // Poner los valores que se piden
    } else if (String(school.nombre).length > 50) {
      alert('El nombre del colegio debe ser menor a los 50 caracteres');
    } else if (String(school.telefono).length != 8) {
      alert(
        'El numero de telefono no es igual a los 8 digitos, recuerda que no debe contener ningun espacio, ningun signo y debe ser de tamaño 8'
      );
    } else if (school.duracionModulo > 60 || school.duracionModulo < 20) {
      // console.log(school.duracionModulo)
      alert(
        'La duracion de cada modulo debe estar entre 20 a 60 min (incluidos los extremos)'
      );
    } else if (
      school.inicioHorario > school.finalizacionHorario &&
      school.finalizacionHorario != ' 00:00'
    ) {
      alert('El horario de finalizacion es mas chico que el de inicio');
    } else if (
      (school.inicioHorario < '05:00' && school.inicioHorario >= '00:00') ||
      school.inicioHorario > '12:00'
    ) {
      alert('El horario de inicio debe ser entre 05:00 - 12:00 pm');
    } else if (school.finalizacionHorario < '12:00') {
      alert('El horario de finalizacion debe ser mayor que las 12:00 pm');
    } else {
      this.nombresDeEscuelas.forEach((nombreEscuela) => {
        if (school.nombre == nombreEscuela) {
          this.existeEscuela = true;
        }
      });

      if (this.existeEscuela) {
        alert('El nombre ya esta utilizado, por favor ingrese otro');
      }
      else{
        this.SchoolData(school);
        this.router.navigate(["/"+school.nombre+'/crear-colegio']);
      }

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
      `schools/${school.nombre}`
    );

    let turnoArrayDiccionario: Array<any> = [];
    [new Turno('manana'), new Turno('tarde'), new Turno('noche')].forEach(
      (turno) => {
        let modulosTurno: Array<any> = [];
        turno.modulos.forEach((modulo) => {
          modulosTurno.push({
            inicio: modulo.inicio,
            final: modulo.final,
          });
        });
        turnoArrayDiccionario.push({
          turno: turno.turno,
          modulos: modulosTurno,
        });
      }
    );

    const data: Colegio = {
      id: school.id,
      userAdmin: school.userAdmin,
      nombre: school.nombre,
      // ejecutado: school.ejecutado,
      direccion: school.direccion,
      provincia: school.provincia,
      telefono: '11' + school.telefono,
      duracionModulo: school.duracionModulo,
      inicioHorario: school.inicioHorario,
      finalizacionHorario: school.finalizacionHorario,
      botonesCrearColegioProgreso: school.botonesCrearColegioProgreso,
      // botonesCrearColegio: school.botonesCrearColegio,
      usuariosExtensiones: [],
      aulas: [],
      turnos: turnoArrayDiccionario,
      // modulos: [],
      materias: [],
      cursos: [],
      profesores: [],
    };

    return schoolRef.set(data, { merge: true });
  }
}
