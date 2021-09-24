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
import { ColegioService } from '../../services/colegio.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss'],
})
export class CursosComponent implements OnInit {
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
  ) {}

  ngOnInit(): void {}

  // _______________________________________CURSOS______________________________________________________________

  async updateDBCurso() {
    this.selectedCurso = new Curso();
    let CursoArrayDiccionario: Array<any> = [];
    this.cursoArray.forEach((curso) => {
      CursoArrayDiccionario.push({
        nombre: curso.nombre,
        turnoPreferido: curso.turnoPreferido,
        cantAlumnos: curso.cantAlumnos,
        // id: curso.id,
        // materiasCurso: curso.materiasCurso,
      });
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      cursos: CursoArrayDiccionario,
    });
  }

  openForEditCurso(curso: Curso) {
    this.selectedCurso = curso;
  }

  addOrEditCurso() {
    if (
      this.selectedCurso.nombre != '' &&
      this.selectedCurso.turnoPreferido != '' &&
      this.selectedCurso.cantAlumnos != '' &&
      this.selectedCurso.nombre.length <= 30
    ) {
      if (this.selectedCurso.id == 0) {
        if (
          !this.colegioSvc.chequearRepeticionEnSubidaDatos(
            this.selectedCurso,
            this.cursoArray
          )
        ) {
          this.selectedCurso.id = this.cursoArray.length + 1;
          this.cursoArray.push(this.selectedCurso);
        }
      }
      this.updateDBCurso();
    } else {
      if (this.selectedCurso.nombre.length > 30) {
        alert('Pone un nombre menor a los 30 caracteres');
      } else {
        alert('Complete los campos vacios');
      }
    }
  }

  deleteCurso() {
    if (confirm('¿Estas seguro/a que quieres eliminar este curso?')) {
      this.cursoArray = this.cursoArray.filter((x) => x != this.selectedCurso);
      this.updateDBCurso();
    }
  }

  async goFormProfesor() {
    this.botonesCrearColegio = 4;
    if (this.botonesCrearColegioProgreso < 4) {
      this.botonesCrearColegioProgreso = 4;
      this.afs.collection('schools').doc(this.nombreDocumento).update({
        botonesCrearColegioProgreso: 4,
        botonesCrearColegio: 4,
      });
    }
  }
}
