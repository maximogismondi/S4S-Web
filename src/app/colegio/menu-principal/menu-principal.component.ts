import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
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
  nombreColegio: string;
  nombreDocumento: string;
  borroColegio: boolean = true;
  // duracionModulo: number;

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private afs: AngularFirestore
  ) {
    authSvc.afAuth.authState.subscribe((user) => {
      //   if (user) {
      //     this.afs.firestore
      //       .collection('schools')
      //       .where('userAdmin', '==', user.uid)
      //       .get()
      //       .then((data) => {
      //         this.nombreColegio = data.docs[0].data().nombre;
      //         this.nombreDocumento = data.docs[0].data().id;
      //       });
      //   }
      // });
      if (user) {
        this.afs
          .collection('schools', (ref) =>
            ref.where('userAdmin', '==', user.uid)
          )
          .snapshotChanges()
          .pipe(
            map((schools) => {
              if (schools[0] != null) {
                const school = schools[0].payload.doc.data() as Colegio;
                this.nombreColegio = school.nombre;
                this.nombreDocumento = school.id;
                // this.duracionModulo = school.duracionModulo;
              }
              else{
                this.borroColegio = false;
              }
            })
          )
          .subscribe();
      }
    });
  }

  ngOnInit(): void {}

  irEleccion() {
    this.router.navigate(['/eleccion']);
  }

  irCrearColegio() {
    this.router.navigate(['/crear-colegio']);
  }

  async deleteSchool() {
    if (confirm('¿Estas seguro/a que quieres eliminar este colegio?')) {
      this.afs.collection('schools').doc(this.nombreDocumento).delete();
    }
  }
}
