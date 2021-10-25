import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ColegioService } from '../services/colegio.service';

@Component({
  selector: 'app-crear-colegio',
  templateUrl: './crear-colegio.component.html',
  styleUrls: ['./crear-colegio.component.scss'],
  providers: [AuthService],
})
export class CrearColegioComponent implements OnInit {
  
  constructor(public colegioSvc: ColegioService, private activatedRoute: ActivatedRoute, private afs: AngularFirestore) {
    this.colegioSvc.nombreColegio = this.activatedRoute.snapshot.paramMap.get("nombreColegio");
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(async (params) => {
      if (params['status'] == 'approved') {
        // console.log(window.location.href)
        this.colegioSvc.botonesCrearColegio = 6;
        this.colegioSvc.pagoFinalizado = true;
        // this.router.navigate(['/' + this.colegioSvc.nombreColegio + '/crear-colegio']);
      }
      else if( params['status'] == 'disapproved') {
        alert('Error de Pago: GbFH6dhd84HSKfaWJWN7772yk7JGOD');
        this.colegioSvc.botonesCrearColegio = 1;
      }
    });
  }

  async clickeoBotones(boton: string) {
    if (boton == 'turnos') {
      this.colegioSvc.botonesCrearColegio = 1;
    } else if (boton == 'aulas') {
      this.colegioSvc.botonesCrearColegio = 2;
    } else if (boton == 'cursos') {
      this.colegioSvc.botonesCrearColegio = 3;
    } else if (boton == 'profesores') {
      this.colegioSvc.botonesCrearColegio = 4;
    } else if (boton == 'materias') {
      this.colegioSvc.botonesCrearColegio = 5;
    } else if (boton == 'finalizar') {
      this.colegioSvc.botonesCrearColegio = 6;
    }
    this.afs.collection('schools').doc(this.colegioSvc.nombreColegio).update({
      botonesCrearColegio: this.colegioSvc.botonesCrearColegio,
    });
  }
}
