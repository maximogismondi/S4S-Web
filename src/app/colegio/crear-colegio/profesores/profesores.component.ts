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
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.scss'],
})
export class ProfesoresComponent implements OnInit {
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

  // _______________________________________PROFESORES__________________________________________________________

  async updateDBProfesor() {
    this.selectedProfesor = new Profesor(this.turnoArray);
    let ProfesorArrayDiccionario: Array<any> = [];
    this.profesorArray.forEach((profesor) => {
      ProfesorArrayDiccionario.push({
        nombre: profesor.nombre,
        apellido: profesor.apellido,
        dni: profesor.dni,
        disponibilidad: profesor.disponibilidad,
        // id: profesor.id,
        // 'materias capacitado': profesor.materiasCapacitado,
        //  turnoPreferido: profesor.turnoPreferido,
        // condiciones: profesor.condiciones,
      });
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      profesores: ProfesorArrayDiccionario,
    });
  }

  openForEditProfesor(profesor: Profesor) {
    this.selectedProfesor = profesor;
  }

  addOrEditProfesor() {
    if (
      this.selectedProfesor.nombre != '' &&
      this.selectedProfesor.apellido != '' &&
      this.selectedProfesor.dni != '' &&
      this.selectedProfesor.dni >= '1000000' &&
      this.selectedProfesor.nombre.length <= 30
    ) {
      if (this.selectedProfesor.id == 0) {
        if (
          !this.colegioSvc.chequearRepeticionEnSubidaDatos(
            this.selectedProfesor,
            this.profesorArray
          )
        ) {
          let existeDni: boolean = false;
          this.profesorArray.forEach((dniProfe) => {
            if (this.selectedProfesor.dni == dniProfe.dni) {
              existeDni = true;
              alert(
                'El dni ya esta utilizado, edite el elemento creado o cree uno con distinto dni'
              );
            }
          });
          if (!existeDni) {
            let existeProfesorDisponible: boolean = false;
            const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
            dias.forEach((dia) => {
              this.turnoArray.forEach((turno) => {
                turno.modulos.forEach((modulo) => {
                  if (
                    this.selectedProfesor.disponibilidad[dia][turno.turno][
                      modulo.inicio
                    ]
                  ) {
                    existeProfesorDisponible = true;
                  }
                });
              });
            });
            if (existeProfesorDisponible) {
              this.selectedProfesor.id = this.profesorArray.length + 1;
              this.profesorArray.push(this.selectedProfesor);
            } else {
              alert('Coloque por lo menos un horario para el profesor/a');
            }
          }
        }
      }

      this.updateDBProfesor();
    } else {
      if (this.selectedProfesor.dni < '1000000') {
        alert('Ingrese un dni valido');
      } else {
        if (this.selectedProfesor.nombre.length > 30) {
          alert('Pone un nombre menor a los 30 caracteres');
        } else {
          alert('Complete los campos vacios');
        }
      }
    }
  }

  deleteProfesor() {
    if (confirm('¿Estas seguro/a que quieres eliminar este profesor/a?')) {
      this.profesorArray = this.profesorArray.filter(
        (x) => x != this.selectedProfesor
      );
      this.updateDBProfesor();
    }
  }

  availabilityProfesor() {
    if (!this.disponibilidadProfesor) {
      this.disponibilidadProfesor = true;
    } else {
      this.disponibilidadProfesor = false;
    }
  }

  clickFormCheck(dia: string, turno: string, modulo: string) {
    this.selectedProfesor.disponibilidad[dia][turno][modulo] =
      !this.selectedProfesor.disponibilidad[dia][turno][modulo];
  }

  async goFormMateria() {
    this.botonesCrearColegio = 5;
    if (this.botonesCrearColegioProgreso < 5) {
      this.botonesCrearColegioProgreso = 5;
      this.afs.collection('schools').doc(this.nombreDocumento).update({
        botonesCrearColegioProgreso: 5,
        botonesCrearColegio: 5,
      });
    }
  }
}
