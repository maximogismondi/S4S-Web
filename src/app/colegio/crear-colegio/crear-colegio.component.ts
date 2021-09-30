import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ColegioService } from '../services/colegio.service';

@Component({
  selector: 'app-crear-colegio',
  templateUrl: './crear-colegio.component.html',
  styleUrls: ['./crear-colegio.component.scss'],
  providers: [AuthService],
})
export class CrearColegioComponent implements OnInit {
  
  constructor(public colegioSvc: ColegioService,) {}

  ngOnInit(): void {}

  async clickeoBotones(boton: string) {
    if (boton == 'turnos' && this.colegioSvc.turnos != 0) {
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
  }
}
