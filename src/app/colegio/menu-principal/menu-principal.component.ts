import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ColegioService } from '../services/colegio.service';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss'],
  providers: [AuthService],
})
export class MenuPrincipalComponent implements OnInit {
  escuelasUsuario: Array<any> = [];

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private afs: AngularFirestore
  ) {
    authSvc.afAuth.authState.subscribe((user) => {
      if (user) {
        this.afs.firestore
          .collection('schools')
          .where('userAdmin', '==', user.uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.escuelasUsuario.push({
                nombre: doc.data().nombre,
                id: doc.data().id,
                tipoUsuario: 'admin',
              });
            });
          });

        this.afs.firestore
          .collection('schools')
          .where('usuariosExtensiones', 'array-contains', user.uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.escuelasUsuario.push({
                nombre: doc.data().nombre,
                id: doc.data().id,
                tipoUsuario: 'extension',
              });
            });
          });
      }
    });
  }

  ngOnInit(): void {}

  irEleccion() {
    this.router.navigate(['/eleccion']);
  }

  irCrearColegio(nombreEscuela: string) {
    this.router.navigate(['/' + nombreEscuela + '/crear-colegio']);
  }

  async deleteSchool(escuela: any) {
    if (confirm(`¿Estas seguro/a que eliminar ${escuela.nombre}?`)) {
      this.afs.collection('schools').doc(escuela.nombre).delete();
      this.escuelasUsuario.splice(this.escuelasUsuario.indexOf(escuela), 1);
    }
  }

  async leaveSchool(escuela: any) {
    if (confirm(`¿Estas seguro/a que abandonar ${escuela.nombre}?`)) {
      this.afs.firestore
        .collection('schools')
        .where('nombre', '==', escuela.nombre)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let usuariosExtensionesArray = doc.data().usuariosExtensiones;
            usuariosExtensionesArray.splice(
              usuariosExtensionesArray.indexOf(this.authSvc.userData.uid),
              1
            );
            this.escuelasUsuario.splice(
              this.escuelasUsuario.indexOf(escuela),
              1
            );
            this.afs.collection('schools').doc(escuela.nombre).update({
              usuariosExtensiones: usuariosExtensionesArray,
            });
          });
        });
    }
  }

  copyLink(id: string) {
    navigator.clipboard
      .writeText(id)
      .then()
      .catch((e) => console.error(e));
    alert('¡Codigo copiado al portapapeles con exito!');
  }
}
