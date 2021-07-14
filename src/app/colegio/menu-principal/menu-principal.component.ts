import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss'],
  providers: [AuthService],
})
export class MenuPrincipalComponent implements OnInit {

  nombreColegio:string;

  constructor(private router: Router, private authSvc: AuthService, private afs: AngularFirestore) {

    authSvc.afAuth.authState.subscribe((user) => {
      if (user) {
        this.afs.firestore.collection("schools").where("userAdmin", "==", user.uid).get().then((data) => {
          this.nombreColegio=data.docs[0].data().nombre;
        });
      }
    });
   }

  ngOnInit(): void {
  }

  irEleccion(){

      this.router.navigate(['/eleccion']);
  }

  irCrearColegio(){
    this.router.navigate(['/crear-colegio']);
  }

}
