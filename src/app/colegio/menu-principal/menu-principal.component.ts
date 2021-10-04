import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Colegio } from 'src/app/shared/interface/user.interface';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss'],
  providers: [AuthService],
})
export class MenuPrincipalComponent implements OnInit {
  // nombreColegio: string;
  // nombreColegio: string;
  // borroColegio: boolean = true;
  // duracionModulo: number;
  nombresDeEscuelasUsuario: Array<string> = [];
  

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
              this.nombresDeEscuelasUsuario.push(doc.data().nombre);
            });
          });
          
      }
    });
  }

  ngOnInit(): void {}

  irEleccion() {
    this.router.navigate(['/eleccion']);
  }

  irCrearColegio(escuela: string) {
    this.router.navigate(['/' + escuela + '/crear-colegio']);
  }

  async deleteSchool(escuela: string) {
    if (confirm('¿Estas seguro/a que quieres eliminar ' + escuela + '?')) {
      this.afs.collection('schools').doc(escuela).delete();
      var i = this.nombresDeEscuelasUsuario.indexOf(escuela);
      this.nombresDeEscuelasUsuario.splice(i, 1);
    }
  }
  
  // copyToClipboard(): void {
  //   // Se copia el texto del input al portapapeles
  //   this.clipboard.copy(this.textControl.value);

  //   // Se muestra un snackbar durante 2 segundos en la parte inferior
  //   this.snackBar.open('¡Texto copiado al portapapeles!', null, {
  //     duration: 2000,
  //     panelClass: 'snackbar'
  //   });
  // }

}
