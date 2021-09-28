import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  Aula,
  Colegio,
  Curso,
  Materia,
  Modulo,
  Profesor,
  Turno,
} from 'src/app/shared/interface/user.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import { ColegioService } from '../services/colegio.service';

@Component({
  selector: 'app-crear-colegio',
  templateUrl: './crear-colegio.component.html',
  styleUrls: ['./crear-colegio.component.scss'],
  providers: [AuthService],
})
export class CrearColegioComponent implements OnInit {
  nombreColegio: string;
  nombreDocumento: string;
  duracionModulo: number;
  inicioHorario: string;
  finalizacionHorario: string;
  turnos: number;
  aulas: number;
  materias: number;
  cursos: number;
  profesores: number;
  turnoSeleccionado: string;
  horaInicial: number;
  horaFinal: number;
  botonesCrearColegio: number = 1;
  botonesCrearColegioProgreso: number;
  disponibilidadProfesor: boolean = false;
  disponibilidadProfesorSemana: Array<Array<Array<boolean>>> = [];
  turnoArray: Array<Turno> = [
    new Turno('manana'),
    new Turno('tarde'),
    new Turno('noche'),
  ];
  inicioModuloSeleccionado: Array<string> = [];
  profesorArray: Profesor[] = [];
  selectedProfesor: Profesor;
  aulaArray: Aula[] = [];
  selectedAula: Aula = new Aula();
  cursoArray: Curso[] = [];
  selectedCurso: Curso = new Curso();
  materiaArray: Materia[] = [];
  selectedMateria: Materia;

  constructor(
    public afAuth: AngularFireAuth,
    private colegioSvc: ColegioService,
    private router: Router,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private afs: AngularFirestore,
    private http: HttpClient
  ) {
    authSvc.afAuth.authState.subscribe((user) => {
      if (user) {
        // this.afs
        //   .collection('horariosHechos', (ref) =>
        //     ref.where('userAdmin', '==', user.uid)
        //   )
        //   .snapshotChanges()
        //   .pipe(
        //     map((schools) => {})
        //     )
        //     .subscribe();
        this.afs
          .collection('schools', (ref) =>
            ref.where('userAdmin', '==', user.uid)
          )
          .snapshotChanges()
          .pipe(
            map((schools) => {
              const school = schools[0].payload.doc.data() as Colegio;
              this.nombreColegio = school.nombre;
              this.nombreDocumento = school.id;
              this.duracionModulo = school.duracionModulo;
              this.inicioHorario = school.inicioHorario;
              this.finalizacionHorario = school.finalizacionHorario;
              if (this.inicioModuloSeleccionado.length == 0) {
                this.inicioModuloSeleccionado.push('05:00', '12:00', '18:00');
                if (school.inicioHorario < '12:00') {
                  this.inicioModuloSeleccionado[0] = school.inicioHorario;
                } else if (school.inicioHorario < '18:00') {
                  this.inicioModuloSeleccionado[1] = school.inicioHorario;
                } else {
                  this.inicioModuloSeleccionado[2] = school.inicioHorario;
                }
              }

              this.horaInicial = Number(
                String(this.inicioHorario).split(':')[0]
              );

              this.horaFinal = Number(
                String(this.finalizacionHorario).split(':')[0]
              );
              this.turnos =
                school.turnos[0].modulos.length +
                school.turnos[1].modulos.length +
                school.turnos[2].modulos.length;
              this.aulas = school.aulas.length;
              this.materias = school.materias.length;
              this.cursos = school.cursos.length;
              this.profesores = school.profesores.length;

              this.botonesCrearColegioProgreso =
                school.botonesCrearColegioProgreso;

              this.turnoArray = school.turnos;

              this.aulaArray = school.aulas;

              this.cursoArray = school.cursos;

              this.profesorArray = school.profesores;

              this.materiaArray = school.materias;
              if (!this.selectedProfesor) {
                this.selectedProfesor = new Profesor(this.turnoArray);
              }
              if (!this.selectedMateria) {
                this.selectedMateria = new Materia(
                  this.profesorArray,
                  this.aulaArray
                );
              }

              /* this.profesoresArrayMaterias = [];
               this.horarios.push(String(this.inicioHorario));
               this.minutos = Number(String(this.inicioHorario).split(':')[1]);
               this.modulos = school.modulos.length;
               this.botonesCrearColegio = school.botonesCrearColegio;
               school.profesores.forEach((profesor) => {
                 let profesorAux: ProfesorReducido = {
                   nombre: profesor.nombre,
                   valor: false,
                 };
                 this.profesoresArrayMaterias.push(profesorAux);
               });
               this.totalCursosColegio = [];
               school.cursos.forEach((cursos) => {
                 this.totalCursosColegio.push(cursos.nombre);
               });*/
            })
          )
          .subscribe();
      }
    });
  }

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
